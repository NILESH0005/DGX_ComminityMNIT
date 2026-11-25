import {
  TEMPLATE_FILE_NAME,
  SHEET_NAMES,
  OPTION_LABELS,
  QUESTION_TYPES,
  QUESTION_TYPE_LIST,
  YES_NO_LIST,
  COL,
  HEADERS,
  TOTAL_COLUMNS,
  FIRST_DATA_ROW,
  TEMPLATE_DATA_ROWS,
  MIN_OPTIONS,
  MAX_OPTIONS,
  EXAMPLE_PREFIX,
  optionTextCol,
  optionCorrectCol,
  loadExcelJS,
} from "./questionExcelConstants";

const COLUMN_WIDTHS = [8, 18, 18, 55, 18, ...OPTION_LABELS.flatMap(() => [28, 18])];

const listValidation = (formula, title, message) => ({
  type: "list",
  allowBlank: true,
  formulae: [formula],
  showErrorMessage: true,
  errorStyle: "stop",
  errorTitle: title,
  error: message,
});

/**
 * Builds the workbook (no download). Kept separate from the download so it can be tested.
 * @param {Array<{idCode:number, ddValue:string}>} questionLevels  from dropdown/getDropdownValues?category=questionLevel
 * @param {string} groupName  shown on the Instructions sheet only (group is chosen in the app)
 */
export async function buildQuestionTemplateWorkbook(questionLevels, groupName = "") {
  const ExcelJS = await loadExcelJS();

  const levelNames = [
    ...new Set(
      (questionLevels || [])
        .map((l) => String(l?.ddValue ?? "").trim())
        .filter(Boolean),
    ),
  ];
  if (levelNames.length === 0) {
    throw new Error("No Question Levels are available. Cannot generate the template.");
  }

  const wb = new ExcelJS.Workbook();
  wb.creator = "LMS Question Bank";
  wb.created = new Date();

  // ---------- Sheet 1: Instructions ----------
  const ins = wb.addWorksheet(SHEET_NAMES.INSTRUCTIONS);
  ins.getColumn(1).width = 120;
  const lines = [
    ["BULK QUESTION UPLOAD - INSTRUCTIONS", "title"],
    [groupName ? `Question Group selected in the app: ${groupName}` : "", "note"],
    ["", ""],
    ["1. Enter questions ONLY in the 'Questions' sheet. Do not rename, add or delete sheets.", ""],
    ["2. Do not change, move, insert or delete the header row or columns.", ""],
    [`3. Delete the example rows (Question Text starting with ${EXAMPLE_PREFIX}) before uploading.`, ""],
    ["4. S.No: a unique whole number per question (1, 2, 3 ...).", ""],
    [`5. Question Level: pick from the dropdown (${levelNames.join(", ")}).`, ""],
    [`6. Question Type: '${QUESTION_TYPES.SINGLE}' or '${QUESTION_TYPES.MULTIPLE}'.`, ""],
    [`7. Number of Options: a whole number from ${MIN_OPTIONS} to ${MAX_OPTIONS}.`, ""],
    ["8. Fill Option A, B, C ... up to the Number of Options. Each filled option MUST have Yes or No in its 'Correct?' column.", ""],
    ["9. Options after the Number of Options (and their 'Correct?' columns) must be left EMPTY.", ""],
    [`10. ${QUESTION_TYPES.SINGLE}: exactly ONE option marked Yes.`, ""],
    [`11. ${QUESTION_TYPES.MULTIPLE}: at least TWO options marked Yes.`, ""],
    ["12. Option texts within a question must be different from each other.", ""],
    [`13. Maximum ${TEMPLATE_DATA_ROWS} questions per file. Images are not supported in bulk upload - add them later by editing the question.`, ""],
    ["14. Save as .xlsx (Excel Workbook) and upload. If any row has an error, NOTHING is saved - fix the rows listed and upload again.", ""],
  ];
  lines.forEach(([text, kind]) => {
    const row = ins.addRow([text]);
    row.getCell(1).alignment = { wrapText: true, vertical: "middle" };
    if (kind === "title") row.getCell(1).font = { bold: true, size: 14, color: { argb: "FF1D4ED8" } };
    if (kind === "note") row.getCell(1).font = { italic: true, color: { argb: "FF374151" } };
  });
  await ins.protect("", { selectLockedCells: true, selectUnlockedCells: true });

  // ---------- Sheet 2: Questions ----------
  const ws = wb.addWorksheet(SHEET_NAMES.QUESTIONS, {
    views: [{ state: "frozen", ySplit: 1 }],
  });
  ws.columns = HEADERS.map((header, i) => ({
    header,
    key: `c${i + 1}`,
    width: COLUMN_WIDTHS[i],
  }));

  const headerRow = ws.getRow(1);
  headerRow.height = 30;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1D4ED8" } };
    cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    cell.border = { bottom: { style: "thin", color: { argb: "FF1E3A8A" } } };
  });

  // Example rows (rejected by the validator until removed)
  const lastLevel = levelNames[levelNames.length - 1];
  const examples = [
    [1, levelNames[0], QUESTION_TYPES.SINGLE,
      `${EXAMPLE_PREFIX} Which of these is a JavaScript library for building user interfaces?`,
      3, "React", "Yes", "MySQL", "No", "Linux", "No"],
    [2, lastLevel, QUESTION_TYPES.MULTIPLE,
      `${EXAMPLE_PREFIX} Which of the following are JavaScript frameworks or libraries?`,
      4, "React", "Yes", "Angular", "Yes", "Python", "No", "MySQL", "No"],
  ];
  examples.forEach((values, i) => {
    const row = ws.getRow(FIRST_DATA_ROW + i);
    values.forEach((v, c) => (row.getCell(c + 1).value = v));
    row.font = { italic: true, color: { argb: "FF6B7280" } };
  });

  // ---------- Sheet 3: Lists (hidden dropdown sources) ----------
  const lists = wb.addWorksheet(SHEET_NAMES.LISTS, { state: "hidden" });
  lists.getCell("A1").value = "Question Level";
  lists.getCell("B1").value = "Question Type";
  lists.getCell("C1").value = "Yes/No";
  levelNames.forEach((name, i) => (lists.getCell(i + 2, 1).value = name));
  QUESTION_TYPE_LIST.forEach((t, i) => (lists.getCell(i + 2, 2).value = t));
  YES_NO_LIST.forEach((v, i) => (lists.getCell(i + 2, 3).value = v));
  await lists.protect("", { selectLockedCells: true, selectUnlockedCells: true });

  const levelRange = `${SHEET_NAMES.LISTS}!$A$2:$A$${levelNames.length + 1}`;
  const typeRange = `${SHEET_NAMES.LISTS}!$B$2:$B$${QUESTION_TYPE_LIST.length + 1}`;
  const yesNoRange = `${SHEET_NAMES.LISTS}!$C$2:$C$${YES_NO_LIST.length + 1}`;

  const snoValidation = {
    type: "whole",
    operator: "greaterThan",
    allowBlank: true,
    formulae: [0],
    showErrorMessage: true,
    errorTitle: "Invalid S.No",
    error: "S.No must be a whole number greater than 0.",
  };
  const levelValidation = listValidation(levelRange, "Invalid Question Level", "Select a Question Level from the dropdown.");
  const typeValidation = listValidation(typeRange, "Invalid Question Type", `Select '${QUESTION_TYPES.SINGLE}' or '${QUESTION_TYPES.MULTIPLE}'.`);
  const countValidation = {
    type: "whole",
    operator: "between",
    allowBlank: true,
    formulae: [MIN_OPTIONS, MAX_OPTIONS],
    showErrorMessage: true,
    errorTitle: "Invalid Number of Options",
    error: `Number of Options must be a whole number from ${MIN_OPTIONS} to ${MAX_OPTIONS}.`,
    showInputMessage: true,
    promptTitle: "Number of Options",
    prompt: `${MIN_OPTIONS} to ${MAX_OPTIONS}. Fill exactly this many options; leave the rest empty.`,
  };
  const yesNoValidation = listValidation(yesNoRange, "Invalid value", "Select Yes or No.");

  const lastRow = FIRST_DATA_ROW + TEMPLATE_DATA_ROWS - 1;
  const colRange = (col) => {
    const letter = ws.getColumn(col).letter;
    return `${letter}${FIRST_DATA_ROW}:${letter}${lastRow}`;
  };

  // Range-based validations (one entry per column, no overlapping ranges)
  ws.dataValidations.add(colRange(COL.SNO), snoValidation);
  ws.dataValidations.add(colRange(COL.LEVEL), levelValidation);
  ws.dataValidations.add(colRange(COL.TYPE), typeValidation);
  ws.dataValidations.add(colRange(COL.OPTION_COUNT), countValidation);
  OPTION_LABELS.forEach((_, i) => ws.dataValidations.add(colRange(optionCorrectCol(i)), yesNoValidation));

  // Unlock every data cell so only the header row is protected
  for (let r = FIRST_DATA_ROW; r <= lastRow; r++) {
    const row = ws.getRow(r);
    for (let c = 1; c <= TOTAL_COLUMNS; c++) {
      row.getCell(c).protection = { locked: false };
    }
    row.getCell(COL.TEXT).alignment = { wrapText: true, vertical: "top" };
    OPTION_LABELS.forEach((_, i) => {
      row.getCell(optionTextCol(i)).alignment = { wrapText: true, vertical: "top" };
    });
  }

  // Header protected; data cells editable. No password (it's accidental-edit protection only).
  await ws.protect("", {
    selectLockedCells: true,
    selectUnlockedCells: true,
    formatColumns: true,
    formatRows: true,
  });

  // Open on the Questions tab
  wb.views = [{ x: 0, y: 0, width: 20000, height: 12000, firstSheet: 0, activeTab: 1, visibility: "visible" }];

  return wb;
}

/** Builds the workbook and triggers a browser download of Questions_Template.xlsx */
export async function downloadQuestionTemplate(questionLevels, groupName) {
  const wb = await buildQuestionTemplateWorkbook(questionLevels, groupName);
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = TEMPLATE_FILE_NAME;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}