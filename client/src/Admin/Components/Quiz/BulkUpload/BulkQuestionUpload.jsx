import React, { useState, useRef, useMemo, useEffect } from "react";
import Swal from "sweetalert2";
import { FiDownload, FiUpload, FiSend, FiRefreshCw, FiRotateCcw, FiFile } from "react-icons/fi";

import BulkQuestionPreview from "./BulkQuestionPreview";
import BulkUploadProgress from "./BulkUploadProgress";
import BulkUploadErrors from "./BulkUploadErrors";
import {
  submitQuestionsSequentially,
  mergeResults,
  summarizeResults,
  isRetryable,
  SUBMIT_STATUS,
} from "./services/bulkQuestionService";
import { downloadQuestionTemplate } from "../../../../utils/questionExcelTemplate";
import { parseQuestionExcel } from "../../../../utils/questionExcelParser";
import { validateBulkQuestions } from "../../../../utils/validateBulkQuestions";
import { TEMPLATE_FILE_NAME } from "../../../../utils/questionExcelConstants";

const STEPS = ["Select Group", "Download Template", "Upload Excel", "Preview", "Submit"];

const StepIndicator = ({ activeStep }) => (
  <ol className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
    {STEPS.map((label, i) => {
      const n = i + 1;
      const done = n < activeStep;
      const active = n === activeStep;
      return (
        <li key={label} className="flex items-center">
          <span
            className={`flex items-center justify-center w-6 h-6 rounded-full mr-1 font-bold ${
              done ? "bg-green-500 text-white" : active ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            {done ? "✓" : n}
          </span>
          <span className={active ? "font-semibold text-blue-700" : "text-gray-600"}>{label}</span>
          {n < STEPS.length && <span className="mx-2 text-gray-300">›</span>}
        </li>
      );
    })}
  </ol>
);

/**
 * Props (all from the existing QuizQuestions component — no new API calls for dropdowns):
 *  categories      [{ group_id, group_name }]
 *  questionLevels  [{ idCode, ddValue }]
 *  fetchData, userToken  from ApiContext
 *  onUploadComplete      refresh Question Bank (parent's onQuestionCreated)
 *  onBusyChange(bool)    lets parent disable the mode toggle while working
 */
const BulkQuestionUpload = ({ categories = [], questionLevels = [], fetchData, userToken, onUploadComplete, onBusyChange }) => {
  const [groupId, setGroupId] = useState("");
  const [fileName, setFileName] = useState("");
  const [rawRows, setRawRows] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, label: "Uploading" });
  const [results, setResults] = useState([]);
  const [submittedGroupId, setSubmittedGroupId] = useState(null); // locked at first submit, used for retries
  const fileInputRef = useRef(null);

  const isBusy = isParsing || isSubmitting || isDownloading;
  useEffect(() => {
    onBusyChange?.(isParsing || isSubmitting);
  }, [isParsing, isSubmitting, onBusyChange]);

  const hasSubmitted = results.length > 0;
  const summary = useMemo(() => (hasSubmitted ? summarizeResults(results) : null), [results, hasSubmitted]);
  const resultsByRow = useMemo(() => new Map(results.map((r) => [r.rowNumber, r])), [results]);
  const retryableResults = useMemo(() => results.filter(isRetryable), [results]);
  const groupName = categories.find((c) => String(c.group_id) === String(groupId))?.group_name || "";

  const activeStep = !groupId ? 1 : !fileName ? 2 : !questions.length ? 3 : !hasSubmitted ? 4 : 5;

  // ---------- helpers ----------
  const resetUpload = () => {
    setFileName("");
    setRawRows([]);
    setQuestions([]);
    setValidationErrors([]);
    setResults([]);
    setSubmittedGroupId(null);
    setProgress({ current: 0, total: 0, label: "Uploading" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleStartOver = async () => {
    if (retryableResults.length) {
      const { isConfirmed } = await Swal.fire({
        title: "Start over?",
        text: `${retryableResults.length} question(s) were not saved. If you start over you will need to upload them again.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Start over",
      });
      if (!isConfirmed) return;
    }
    resetUpload();
  };

  // ---------- Step 1: group ----------
  const handleGroupChange = (e) => setGroupId(e.target.value);

  // ---------- Step 2: template ----------
  const handleDownloadTemplate = async () => {
    if (!groupId) {
      Swal.fire("Select Question Group", "Please select a Question Group first.", "warning");
      return;
    }
    if (!questionLevels.length) {
      Swal.fire("Error", "Question Levels are not loaded yet. Please refresh and try again.", "error");
      return;
    }
    setIsDownloading(true);
    try {
      await downloadQuestionTemplate(questionLevels, groupName);
    } catch (err) {
      Swal.fire("Error", err?.message || "Could not generate the template.", "error");
    } finally {
      setIsDownloading(false);
    }
  };

  // ---------- Step 3: upload + parse + validate (no API calls) ----------
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow choosing the same file again after fixing it
    if (!file) return;

    if (!groupId) {
      Swal.fire("Select Question Group", "Please select a Question Group first.", "warning");
      return;
    }

    resetUpload();
    setFileName(file.name);
    setIsParsing(true);
    try {
      const { rows, errors: fileErrors } = await parseQuestionExcel(file);
      if (fileErrors.length) {
        setValidationErrors(fileErrors);
        return;
      }
      const result = validateBulkQuestions(rows, questionLevels);
      setRawRows(rows);
      setValidationErrors(result.errors);
      setQuestions(result.questions);
      if (!result.isValid) {
        Swal.fire(
          "Validation failed",
          `${result.errors.length} error(s) found. Nothing has been saved. Fix the listed Excel rows and upload again.`,
          "error",
        );
      }
    } catch (err) {
      setValidationErrors([{ row: null, sno: null, message: err?.message || "Could not read the Excel file." }]);
    } finally {
      setIsParsing(false);
    }
  };

  // ---------- Step 5: final validation + submit ----------
  const runSubmission = async (toSubmit, targetGroupId, label) => {
    setIsSubmitting(true);
    setProgress({ current: 1, total: toSubmit.length, label });
    try {
      const runResults = await submitQuestionsSequentially({
        questions: toSubmit,
        groupId: targetGroupId,
        fetchData,
        userToken,
        onProgress: ({ current, total }) => setProgress({ current, total, label }),
      });
      setResults((prev) => mergeResults(prev, runResults));
      return runResults;
    } finally {
      setIsSubmitting(false);
    }
  };

  const reportOutcome = (runResults) => {
    const s = summarizeResults(runResults);
    const notSaved = s.failed + s.uncertain;
    if (s.success > 0) onUploadComplete?.(); // refresh Question Bank

    if (notSaved === 0) {
      Swal.fire(
        "Upload complete",
        `${s.success} question(s) created${s.duplicate ? `, ${s.duplicate} already existed and were skipped` : ""}.`,
        "success",
      );
    } else {
      Swal.fire(
        "Upload finished with errors",
        `${s.success} created, ${notSaved} not saved. Review the failed rows below and click "Retry Failed".`,
        "warning",
      );
    }
  };

  const handleSubmit = async () => {
    if (hasSubmitted) return; // never resubmit the whole file
    if (!groupId) {
      Swal.fire("Select Question Group", "Please select a Question Group first.", "warning");
      return;
    }

    // Final validation, again, right before any API call
    const finalCheck = validateBulkQuestions(rawRows, questionLevels);
    if (!finalCheck.isValid) {
      setValidationErrors(finalCheck.errors);
      setQuestions([]);
      Swal.fire("Validation failed", "Fix the listed Excel rows and upload again. Nothing was saved.", "error");
      return;
    }

    const { isConfirmed } = await Swal.fire({
      title: "Submit questions?",
      html: `Create <b>${finalCheck.questions.length}</b> question(s) in group <b>${groupName}</b>?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Submit",
    });
    if (!isConfirmed) return;

    setQuestions(finalCheck.questions);
    setSubmittedGroupId(groupId);
    const runResults = await runSubmission(finalCheck.questions, groupId, "Uploading");
    reportOutcome(runResults);
  };

  const handleRetryFailed = async () => {
    if (!retryableResults.length) return;
    const uncertainCount = retryableResults.filter((r) => r.status === SUBMIT_STATUS.UNCERTAIN).length;

    const { isConfirmed } = await Swal.fire({
      title: `Retry ${retryableResults.length} question(s)?`,
      html:
        "Only questions that were not confirmed as saved will be sent again." +
        (uncertainCount
          ? `<br/><br/><b>${uncertainCount}</b> of them lost their server response and may already be saved. ` +
            "The server checks for duplicates, so they will not be created twice."
          : ""),
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Retry",
    });
    if (!isConfirmed) return;

    const toRetry = retryableResults.map((r) => r.question);
    const runResults = await runSubmission(toRetry, submittedGroupId, "Retrying");
    reportOutcome(runResults);
  };

  // ---------- derived lists for the error panels ----------
  const apiFailures = retryableResults.map((r) => ({
    row: r.rowNumber,
    sno: r.sno,
    message: r.message,
    status: r.status,
  }));

  // ---------- render ----------
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-4">
        <StepIndicator activeStep={activeStep} />

        {/* Step 1: Question Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              1. Question Group <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100"
              value={groupId}
              onChange={handleGroupChange}
              disabled={isBusy || hasSubmitted}
              title={hasSubmitted ? "Click 'Start Over' to change the group" : undefined}
            >
              <option value="">Select Question Group</option>
              {categories.map((cat) => (
                <option key={cat.group_id} value={cat.group_id}>
                  {cat.group_name}
                </option>
              ))}
            </select>
            {hasSubmitted && (
              <p className="text-xs text-gray-500 mt-1">Group is locked for this upload. Use Start Over to change it.</p>
            )}
          </div>

          {/* Step 2: Template */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">2. Template</label>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              disabled={!groupId || isBusy || !questionLevels.length}
              className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiDownload />
              <span>{isDownloading ? "Generating..." : "Download Question Template"}</span>
            </button>
            <p className="text-xs text-gray-500 mt-1">{TEMPLATE_FILE_NAME} - text-only questions, up to 6 options.</p>
          </div>
        </div>

        {/* Step 3: Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">3. Upload Filled Template (.xlsx)</label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label
              className={`flex items-center justify-center space-x-2 px-4 py-2 rounded text-sm font-semibold border-2 border-dashed transition-colors ${
                !groupId || isBusy || hasSubmitted
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-blue-300 text-blue-700 hover:bg-blue-50 cursor-pointer"
              }`}
            >
              <FiUpload />
              <span>{isParsing ? "Reading file..." : "Choose Excel File"}</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                className="hidden"
                onChange={handleFileChange}
                disabled={!groupId || isBusy || hasSubmitted}
              />
            </label>

            {fileName && (
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <FiFile className="text-green-600" />
                <span className="font-medium">{fileName}</span>
                <span
                  className={`text-xs rounded px-2 py-0.5 ${
                    isParsing
                      ? "bg-gray-100 text-gray-600"
                      : validationErrors.length
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  {isParsing
                    ? "Validating..."
                    : validationErrors.length
                      ? `${validationErrors.length} error(s)`
                      : `${questions.length} valid question(s)`}
                </span>
              </div>
            )}

            {(fileName || hasSubmitted) && (
              <button
                type="button"
                onClick={handleStartOver}
                disabled={isBusy}
                className="sm:ml-auto flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
              >
                <FiRotateCcw size={14} />
                <span>Start Over</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Validation errors (all of them) */}
      <BulkUploadErrors title="Validation errors - nothing was saved" errors={validationErrors} />

      {/* Step 4: Preview */}
      {!validationErrors.length && questions.length > 0 && (
        <BulkQuestionPreview questions={questions} resultsByRow={hasSubmitted ? resultsByRow : undefined} />
      )}

      {/* Progress */}
      {(isSubmitting || hasSubmitted) && (
        <BulkUploadProgress
          isRunning={isSubmitting}
          current={progress.current}
          total={progress.total}
          summary={summary}
          runLabel={progress.label}
        />
      )}

      {/* API failures + retry */}
      {!isSubmitting && (
        <BulkUploadErrors
          variant="warning"
          title="Questions not saved"
          errors={apiFailures}
          footer={
            <button
              type="button"
              onClick={handleRetryFailed}
              disabled={isBusy}
              className="flex items-center space-x-2 bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 transition-colors text-sm font-semibold disabled:opacity-50"
            >
              <FiRefreshCw />
              <span>Retry Failed ({apiFailures.length})</span>
            </button>
          }
        />
      )}

      {/* Step 5: Submit */}
      {!validationErrors.length && questions.length > 0 && !hasSubmitted && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isBusy}
            className="flex items-center space-x-2 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors text-sm font-semibold shadow disabled:opacity-50"
          >
            <FiSend />
            <span>Submit {questions.length} Question(s)</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default BulkQuestionUpload;