// Shared constants for the bulk question Excel template, parser and validator.
// Keep ALL header text / sheet names here so template + parser can never drift apart.

export const TEMPLATE_FILE_NAME = "Questions_Template.xlsx";

export const SHEET_NAMES = {
  INSTRUCTIONS: "Instructions",
  QUESTIONS: "Questions",
  LISTS: "Lists", // hidden lookup sheet for dropdown sources
};

export const REQUIRED_SHEETS = [
  SHEET_NAMES.INSTRUCTIONS,
  SHEET_NAMES.QUESTIONS,
  SHEET_NAMES.LISTS,
];

export const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"];
export const MIN_OPTIONS = 2;
export const MAX_OPTIONS = 6;

export const QUESTION_TYPES = {
  SINGLE: "Single Choice",
  MULTIPLE: "Multiple Choice",
};
export const QUESTION_TYPE_LIST = [QUESTION_TYPES.SINGLE, QUESTION_TYPES.MULTIPLE];

export const YES = "Yes";
export const NO = "No";
export const YES_NO_LIST = [YES, NO];

// Fixed column positions (1-based, as Excel / ExcelJS use)
export const COL = {
  SNO: 1,
  LEVEL: 2,
  TYPE: 3,
  TEXT: 4,
  OPTION_COUNT: 5,
};
export const optionTextCol = (index) => 6 + index * 2; // A=6, B=8 ... F=16
export const optionCorrectCol = (index) => 7 + index * 2; // A=7, B=9 ... F=17

export const HEADERS = [
  "S.No",
  "Question Level",
  "Question Type",
  "Question Text",
  "Number of Options",
  ...OPTION_LABELS.flatMap((l) => [`Option ${l}`, `Option ${l} Correct?`]),
];
export const TOTAL_COLUMNS = HEADERS.length; // 17

export const HEADER_ROW = 1;
export const FIRST_DATA_ROW = 2;

// Rows in the template that get dropdowns + are unlocked for editing.
export const TEMPLATE_DATA_ROWS = 500;
export const MAX_QUESTIONS_PER_FILE = 500;
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

// Example rows in the template start with this, and the validator rejects them,
// so sample questions can never be uploaded by accident.
export const EXAMPLE_PREFIX = "[EXAMPLE]";

// Lazy-load ExcelJS so it is not in the main bundle (only loaded on the bulk screen).
export const loadExcelJS = async () => {
  const mod = await import("exceljs");
  return mod.default || mod;
};