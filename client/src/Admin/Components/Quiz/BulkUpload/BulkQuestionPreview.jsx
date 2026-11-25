import React from "react";
import { FiCheckCircle } from "react-icons/fi";
import { SUBMIT_STATUS } from "./services/bulkQuestionService";

const STATUS_BADGE = {
  [SUBMIT_STATUS.SUCCESS]: ["Saved", "bg-green-100 text-green-800"],
  [SUBMIT_STATUS.DUPLICATE]: ["Already existed", "bg-blue-100 text-blue-800"],
  [SUBMIT_STATUS.FAILED]: ["Failed", "bg-red-100 text-red-800"],
  [SUBMIT_STATUS.UNCERTAIN]: ["Unconfirmed", "bg-amber-100 text-amber-800"],
};

/**
 * questions: validated questions
 * resultsByRow: optional Map(rowNumber -> result) to show per-row status after submission
 */
const BulkQuestionPreview = ({ questions = [], resultsByRow }) => {
  if (!questions.length) return null;

  return (
    <div className="rounded-lg border border-gray-200">
      <div className="flex justify-between items-center p-3 bg-gray-50 border-b border-gray-200 rounded-t-lg">
        <h4 className="font-bold text-gray-800">Preview</h4>
        <span className="text-sm text-gray-600">
          Total questions: <b>{questions.length}</b>
        </span>
      </div>

      <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 sticky top-0 z-[1]">
            <tr className="text-left text-gray-700">
              <th className="p-2">S.No</th>
              <th className="p-2 min-w-[220px]">Question Text</th>
              <th className="p-2">Level</th>
              <th className="p-2">Type</th>
              <th className="p-2 text-center">Options</th>
              <th className="p-2 min-w-[260px]">Answer Options</th>
              <th className="p-2">Correct</th>
              {resultsByRow && <th className="p-2">Status</th>}
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => {
              const result = resultsByRow?.get(q.rowNumber);
              const badge = result && STATUS_BADGE[result.status];
              return (
                <tr key={q.rowNumber} className="border-t border-gray-100 align-top">
                  <td className="p-2 whitespace-nowrap">
                    {q.sno}
                    <div className="text-[10px] text-gray-400">Row {q.rowNumber}</div>
                  </td>
                  <td className="p-2 whitespace-pre-wrap">{q.questionText}</td>
                  <td className="p-2 whitespace-nowrap">{q.levelName}</td>
                  <td className="p-2 whitespace-nowrap">{q.questionType}</td>
                  <td className="p-2 text-center">{q.optionCount}</td>
                  <td className="p-2">
                    <ul className="space-y-1">
                      {q.options.map((o) => (
                        <li
                          key={o.label}
                          className={`flex items-start space-x-1 rounded px-1 ${
                            o.isCorrect ? "bg-green-50 text-green-800 font-semibold" : "text-gray-700"
                          }`}
                        >
                          <span>{o.label}.</span>
                          <span className="flex-1">{o.text}</span>
                          {o.isCorrect && <FiCheckCircle className="mt-0.5 shrink-0" />}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-2 whitespace-nowrap font-semibold text-green-700">
                    {q.options.filter((o) => o.isCorrect).map((o) => o.label).join(", ")}
                  </td>
                  {resultsByRow && (
                    <td className="p-2 whitespace-nowrap">
                      {badge ? (
                        <span className={`text-xs rounded px-2 py-0.5 ${badge[1]}`} title={result.message}>
                          {badge[0]}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Pending</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BulkQuestionPreview;