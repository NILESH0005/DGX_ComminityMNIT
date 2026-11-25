import {
  QUESTION_TYPES,
  QUESTION_TYPE_LIST,
  YES,
  NO,
  MIN_OPTIONS,
  MAX_OPTIONS,
  EXAMPLE_PREFIX,
} from "./questionExcelConstants";

const norm = (s) => String(s ?? "").trim().toLowerCase();

// "5" -> 5, "05" -> 5, "5.0" / "5.5" / "abc" / "" -> null
const parseStrictInt = (raw) => {
  const s = String(raw ?? "").trim();
  return /^\d+$/.test(s) ? Number(s) : null;
};

// "Yes"/"yes" -> true, "No" -> false, anything else -> null
const parseYesNo = (raw) => {
  const s = norm(raw);
  if (s === norm(YES)) return true;
  if (s === norm(NO)) return false;
  return null;
};

/**
 * Validates every business rule for the raw rows produced by parseQuestionExcel.
 * Call it right after upload AND again right before submission.
 * questions is EMPTY whenever there is any error (all-or-nothing).
 */
export function validateBulkQuestions(rawRows, questionLevels) {
  const errors = [];
  const questions = [];

  if (!Array.isArray(rawRows) || rawRows.length === 0) {
    return {
      isValid: false,
      errors: [{ row: null, sno: null, message: "No questions found to validate." }],
      questions: [],
    };
  }

  const levelMap = new Map(
    (questionLevels || []).map((l) => [norm(l.ddValue), { id: l.idCode, name: l.ddValue }]),
  );
  if (levelMap.size === 0) {
    return {
      isValid: false,
      errors: [{ row: null, sno: null, message: "Question Levels could not be loaded. Refresh the page and try again." }],
      questions: [],
    };
  }

  const snoSeen = new Map(); // sno -> rowNumber
  const textSeen = new Map(); // normalized question text -> rowNumber

  for (const row of rawRows) {
    const rowErrors = [];
    const add = (msg) => rowErrors.push(msg);

    // ---------- S.No ----------
    const sno = parseStrictInt(row.snoRaw);
    if (row.snoRaw === "") add("S.No is required.");
    else if (sno === null || sno < 1) add(`S.No must be a positive whole number. Found "${row.snoRaw}".`);
    else if (snoSeen.has(sno)) add(`Duplicate S.No ${sno} (already used in Excel Row ${snoSeen.get(sno)}).`);
    else snoSeen.set(sno, row.rowNumber);

    if (row.hasExtraColumnData) add("Data found after the 'Option F Correct?' column. Remove it.");

    // ---------- Question Level ----------
    const level = levelMap.get(norm(row.levelRaw));
    if (!row.levelRaw) add("Question Level is required.");
    else if (!level) add(`Invalid Question Level "${row.levelRaw}". Allowed: ${[...levelMap.values()].map((l) => l.name).join(", ")}.`);

    // ---------- Question Type ----------
    const questionType = QUESTION_TYPE_LIST.find((t) => norm(t) === norm(row.typeRaw)) || null;
    if (!row.typeRaw) add("Question Type is required.");
    else if (!questionType) add(`Invalid Question Type "${row.typeRaw}". Use "${QUESTION_TYPES.SINGLE}" or "${QUESTION_TYPES.MULTIPLE}".`);

    // ---------- Question Text ----------
    const questionText = row.questionText;
    if (!questionText) add("Question Text is required.");
    else if (questionText.startsWith(EXAMPLE_PREFIX)) add("This is a template example row. Delete it before uploading.");
    else {
      const key = norm(questionText).replace(/\s+/g, " ");
      if (textSeen.has(key)) add(`Same Question Text as Excel Row ${textSeen.get(key)}.`);
      else textSeen.set(key, row.rowNumber);
    }

    // ---------- Number of Options ----------
    const optionCount = parseStrictInt(row.optionCountRaw);
    const countValid = optionCount !== null && optionCount >= MIN_OPTIONS && optionCount <= MAX_OPTIONS;
    if (row.optionCountRaw === "") add("Number of Options is required.");
    else if (!countValid) add(`Number of Options must be a whole number from ${MIN_OPTIONS} to ${MAX_OPTIONS}. Found "${row.optionCountRaw}".`);

    // ---------- Options + Correct? ----------
    const options = [];
    let allYesNoValid = true;

    if (countValid) {
      row.options.forEach((opt, i) => {
        const active = i < optionCount;
        if (active) {
          const isCorrect = parseYesNo(opt.correctRaw);
          if (!opt.text) {
            add(isCorrect === true
              ? `Option ${opt.label} is marked correct (Yes) but has no text.`
              : `Option ${opt.label} text is required (Number of Options is ${optionCount}).`);
          }
          if (opt.correctRaw === "") {
            allYesNoValid = false;
            add(`Option ${opt.label} Correct? is empty. Select Yes or No.`);
          } else if (isCorrect === null) {
            allYesNoValid = false;
            add(`Option ${opt.label} Correct? must be Yes or No. Found "${opt.correctRaw}".`);
          }
          options.push({ label: opt.label, text: opt.text, isCorrect: isCorrect === true });
        } else if (opt.text || opt.correctRaw) {
          add(
            parseYesNo(opt.correctRaw) === true
              ? `Option ${opt.label} is marked correct but Number of Options is ${optionCount}. Clear Option ${opt.label} or increase Number of Options.`
              : `Option ${opt.label} must be empty because Number of Options is ${optionCount}.`,
          );
        }
      });

      // Duplicate option texts in the same question
      const seen = new Map();
      options.forEach((o) => {
        if (!o.text) return;
        const k = norm(o.text);
        if (seen.has(k)) add(`Option ${o.label} has the same text as Option ${seen.get(k)}.`);
        else seen.set(k, o.label);
      });

      // ---------- MOST IMPORTANT: correct-answer count ----------
      if (questionType && allYesNoValid) {
        const correctCount = options.filter((o) => o.isCorrect).length;
        if (questionType === QUESTION_TYPES.SINGLE && correctCount !== 1) {
          add(`Single Choice requires exactly 1 correct answer. Found ${correctCount}.`);
        }
        if (questionType === QUESTION_TYPES.MULTIPLE && correctCount < 2) {
          add(`Multiple Choice requires at least 2 correct answers. Found ${correctCount}.`);
        }
      }
    }

    if (rowErrors.length) {
      const snoForReport = sno ?? (row.snoRaw || null);
      rowErrors.forEach((message) => errors.push({ row: row.rowNumber, sno: snoForReport, message }));
    } else {
      questions.push({
        sno,
        rowNumber: row.rowNumber,
        questionText,
        questionType,
        levelId: level.id,
        levelName: level.name,
        optionCount,
        options,
      });
    }
  }

  errors.sort((a, b) => (a.row ?? 0) - (b.row ?? 0));
  const isValid = errors.length === 0;
  return { isValid, errors, questions: isValid ? questions : [] };
}