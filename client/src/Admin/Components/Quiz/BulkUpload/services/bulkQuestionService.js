import { QUESTION_TYPE_LIST } from "../../../../../utils/questionExcelConstants";

export const SUBMIT_STATUS = {
  SUCCESS: "success",     // server confirmed it was created
  DUPLICATE: "duplicate", // server says it already exists in this group -> not re-created
  FAILED: "failed",       // server answered and rejected it
  UNCERTAIN: "uncertain", // network/no response: server MAY have saved it
};

// Rows that may be sent again. SUCCESS and DUPLICATE are never resent.
export const isRetryable = (r) =>
  r.status === SUBMIT_STATUS.FAILED || r.status === SUBMIT_STATUS.UNCERTAIN;

/** Same payload as the single-question form, plus check_duplicate for safe retries. */
export function buildQuestionPayload(question, groupId) {
  return {
    question_text: question.questionText,
    Ques_level: question.levelId,
    image: null,
    group_id: Number(groupId),
    question_type: question.questionType === QUESTION_TYPE_LIST.MULTIPLE ? 1 : 0,
    options: question.options.map((option) => ({
      option_text: option.text,
      image: null,
      is_correct: option.isCorrect ? 1 : 0,
    })),
    // Backend: if a question with the same text already exists in this group,
    // reply { success:false, duplicate:true } instead of inserting again.
    // Older backends simply ignore this field.
    check_duplicate: true,
  };
}

/**
 * Sends questions one at a time to POST quiz/createQuestion.
 * Never stops on a failure; each question gets its own result.
 */
export async function submitQuestionsSequentially({ questions, groupId, fetchData, userToken, onProgress }) {
  const headers = { "Content-Type": "application/json", "auth-token": userToken };
  const results = [];
  const total = questions.length;

  for (let i = 0; i < total; i++) {
    const question = questions[i];
    onProgress?.({ current: i + 1, total, results: [...results] });

    let status;
    let message;
    try {
      const data = await fetchData("quiz/createQuestion", "POST", buildQuestionPayload(question, groupId), headers);

      if (data?.success) {
        status = SUBMIT_STATUS.SUCCESS;
        message = data.message || "Question created.";
      } else if (data?.duplicate) {
        status = SUBMIT_STATUS.DUPLICATE;
        message = data.message || "Already exists in this group. Skipped.";
      } else if (!data) {
        status = SUBMIT_STATUS.UNCERTAIN;
        message = "No response from server. It may or may not have been saved.";
      } else {
        status = SUBMIT_STATUS.FAILED;
        message = data.message || "Server rejected the question.";
      }
    } catch (err) {
      // Lost response / timeout / network: the insert may have happened.
      status = SUBMIT_STATUS.UNCERTAIN;
      message = `${err?.message || "Network error"}. It may or may not have been saved.`;
    }

    results.push({ rowNumber: question.rowNumber, sno: question.sno, question, status, message });
  }

  onProgress?.({ current: total, total, results: [...results] });
  return results;
}

/** Replaces old results with new ones by Excel row number (used after a retry). */
export function mergeResults(previous, retried) {
  const byRow = new Map(previous.map((r) => [r.rowNumber, r]));
  retried.forEach((r) => byRow.set(r.rowNumber, r));
  return [...byRow.values()].sort((a, b) => a.rowNumber - b.rowNumber);
}

export function summarizeResults(results) {
  const count = (s) => results.filter((r) => r.status === s).length;
  return {
    total: results.length,
    success: count(SUBMIT_STATUS.SUCCESS),
    duplicate: count(SUBMIT_STATUS.DUPLICATE),
    failed: count(SUBMIT_STATUS.FAILED),
    uncertain: count(SUBMIT_STATUS.UNCERTAIN),
  };
}