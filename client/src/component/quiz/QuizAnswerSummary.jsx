// QuizAnswerSummary.jsx

import React from "react";

const QuizAnswerSummary = ({
  questions,
  selectedAnswers,
  onClose,
  onRetry,
}) => {
  const incorrectQuestions = questions.filter((question, index) => {
    const answer = selectedAnswers[index];

    if (!answer) return true;

    return !answer.isCorrect;
  });

  const correctCount = selectedAnswers.filter(
    (answer) => answer?.isCorrect,
  ).length;

  const incorrectCount = incorrectQuestions.length;

  return (
    <div className="w-full text-left">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-slate-800">
          Quiz Review Summary
        </h2>

        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Back
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Correct Answers</p>

          <h3 className="text-3xl font-bold text-green-600">
            {correctCount}
          </h3>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Incorrect Answers</p>

          <h3 className="text-3xl font-bold text-red-600">
            {incorrectCount}
          </h3>
        </div>
      </div>

      {/* Wrong Questions */}
      <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2">
        {incorrectQuestions.map((question, idx) => {
          const originalIndex = questions.findIndex(
            (q) => q.id === question.id,
          );

          const userAnswer = selectedAnswers[originalIndex];

          const selectedIds = userAnswer?.selectedOptionIds
            ? userAnswer.selectedOptionIds
            : userAnswer?.selectedOptionId
              ? [userAnswer.selectedOptionId]
              : [];

          const selectedOptions = question.options.filter((o) =>
            selectedIds.includes(Number(o.id)),
          );

          const correctOptions = question.options.filter((o) =>
            question.correctAnswers.includes(Number(o.id)),
          );

          return (
            <div
              key={question.id}
              className="border border-red-200 rounded-xl p-5 bg-red-50"
            >
              <h3 className="font-semibold text-lg text-slate-800 mb-3">
                Q{idx + 1}. {question.question_text}
              </h3>

              <div className="mb-3">
                <p className="font-medium text-red-600 mb-1">
                  Your Answer:
                </p>

                {selectedOptions.length > 0 ? (
                  <ul className="list-disc ml-5">
                    {selectedOptions.map((option) => (
                      <li key={option.id}>{option.option_text}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="italic text-gray-500">
                    Not Answered
                  </p>
                )}
              </div>

              <div>
                <p className="font-medium text-green-600 mb-1">
                  Correct Answer:
                </p>

                <ul className="list-disc ml-5">
                  {correctOptions.map((option) => (
                    <li key={option.id}>{option.option_text}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-center gap-4 mt-8">
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            Try Again
          </button>
        )}

        {onClose && (
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl"
          >
            Back To Result
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizAnswerSummary;