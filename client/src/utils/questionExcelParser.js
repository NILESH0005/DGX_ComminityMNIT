import {
  REQUIRED_SHEETS,
  SHEET_NAMES,
  HEADERS,
  TOTAL_COLUMNS,
  HEADER_ROW,
  COL,
  OPTION_LABELS,
  MAX_QUESTIONS_PER_FILE,
  MAX_FILE_SIZE_BYTES,
  optionTextCol,
  optionCorrectCol,
  loadExcelJS,
} from "./questionExcelConstants";

/** Converts any ExcelJS cell value (string, number, rich text, formula, hyperlink) to a trimmed string. */
export function cellToString(cell) {
  const v = cell?.value;
  if (v === null || v === undefined) return "";
  let out;
  if (typeof v === "object") {
    if (v instanceof Date) out = v.toISOString();
    else if (Array.isArray(v.richText)) out = v.richText.map((t) => t.text).join("");
    else if ("formula" in v || "sharedFormula" in v) out = v.result == null ? "" : String(v.result?.error ? "" : v.result);
    else if ("text" in v) out = String(v.text); // hyperlink
    else out = "";
  } else {
    out = String(v);
  }
  return out.replace(/\u00A0/g, " ").trim();
}

const fileError = (message) => ({ row: null, sno: null, message });

/**
 * Reads the uploaded workbook and returns RAW row data (strings) with real Excel row numbers.
 * It checks file/sheet/header structure only; business rules live in validateBulkQuestions.js.
 */
export async function parseQuestionExcel(file) {
  const errors = [];

  if (!file) return { rows: [], errors: [fileError("No file selected.")] };
  if (!/\.xlsx$/i.test(file.name || "")) {
    return { rows: [], errors: [fileError("Only .xlsx files are accepted. Use the downloaded Questions_Template.xlsx.")] };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { rows: [], errors: [fileError(`File is too large. Maximum size is ${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB.`)] };
  }

  const ExcelJS = await loadExcelJS();
  const wb = new ExcelJS.Workbook();
  try {
    await wb.xlsx.load(await file.arrayBuffer());
  } catch {
    return { rows: [], errors: [fileError("The file could not be read. Make sure it is a valid .xlsx created from the template.")] };
  }

  // ---- Worksheet names: exactly the template's sheets ----
  const sheetNames = wb.worksheets.map((s) => s.name);
  const missing = REQUIRED_SHEETS.filter((n) => !sheetNames.includes(n));
  const extra = sheetNames.filter((n) => !REQUIRED_SHEETS.includes(n));
  if (missing.length) errors.push(fileError(`Missing worksheet(s): ${missing.join(", ")}. Use the official template.`));
  if (extra.length) errors.push(fileError(`Unexpected worksheet(s): ${extra.join(", ")}. Do not add or rename sheets.`));
  if (errors.length) return { rows: [], errors };

  const ws = wb.getWorksheet(SHEET_NAMES.QUESTIONS);

  // ---- Headers: exact text, exact order, nothing extra ----
  const headerRow = ws.getRow(HEADER_ROW);
  HEADERS.forEach((expected, i) => {
    const actual = cellToString(headerRow.getCell(i + 1));
    if (actual !== expected) {
      errors.push(
        fileError(
          actual
            ? `Header in column ${i + 1} should be "${expected}" but found "${actual}".`
            : `Missing header "${expected}" in column ${i + 1}.`,
        ),
      );
    }
  });
  headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
    if (colNumber > TOTAL_COLUMNS && cellToString(cell)) {
      errors.push(fileError(`Extra column "${cellToString(cell)}" found in column ${colNumber}. Remove it.`));
    }
  });
  if (errors.length) return { rows: [], errors };

  // ---- Data rows (row numbers come from Excel itself, never from array indexes) ----
  const rows = [];
  ws.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber <= HEADER_ROW) return;

    const get = (c) => cellToString(row.getCell(c));
    const values = [];
    for (let c = 1; c <= TOTAL_COLUMNS; c++) values.push(get(c));

    let hasExtraColumnData = false;
    row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
      if (colNumber > TOTAL_COLUMNS && cellToString(cell)) hasExtraColumnData = true;
    });

    // Completely empty row (template rows carry validation/style only) -> ignore
    if (!hasExtraColumnData && values.every((v) => v === "")) return;

    rows.push({
      rowNumber,
      snoRaw: get(COL.SNO),
      levelRaw: get(COL.LEVEL),
      typeRaw: get(COL.TYPE),
      questionText: get(COL.TEXT),
      optionCountRaw: get(COL.OPTION_COUNT),
      options: OPTION_LABELS.map((label, i) => ({
        label,
        text: get(optionTextCol(i)),
        correctRaw: get(optionCorrectCol(i)),
      })),
      hasExtraColumnData,
    });
  });

  if (rows.length === 0) {
    errors.push(fileError("No questions found in the 'Questions' sheet."));
  } else if (rows.length > MAX_QUESTIONS_PER_FILE) {
    errors.push(fileError(`Too many questions (${rows.length}). Maximum is ${MAX_QUESTIONS_PER_FILE} per file.`));
  }

  return { rows: errors.length ? [] : rows, errors };
}