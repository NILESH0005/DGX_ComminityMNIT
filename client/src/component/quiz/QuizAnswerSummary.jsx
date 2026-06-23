// QuizAnswerSummary.jsx

import React from "react";
import {
  AlertTriangle,
  ArrowLeft,
  XCircle,
  CheckCircle2,
} from "lucide-react";

const QuizAnswerSummary = ({
  questions,
  selectedAnswers,
  onClose,
}) => {
  const incorrectQuestions = questions.filter((question, index) => {
    const answer = selectedAnswers[index];

    if (!answer) return true;

    return !answer.isCorrect;
  });

  const incorrectCount = incorrectQuestions.length;

  return (
    <div className="w-full text-left bg-white rounded-3xl overflow-hidden flex flex-col max-h-[80vh]">
      {/* ========================================= */}
      {/* HERO SECTION */}
      {/* ========================================= */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-slate-50 border border-slate-200 mb-4 sm:mb-6 flex-shrink-0">
        {/* Decorative Elements */}

        <div className="absolute top-0 left-0 w-full h-1 bg-[#76B900]" />

        <div className="absolute top-6 right-6 sm:top-10 sm:right-10 w-32 h-32 sm:w-52 sm:h-52 rounded-full bg-[#76B900]/10 blur-3xl" />

        <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-80 sm:h-80 rounded-full bg-[#013D54]/10 blur-3xl" />

        <div className="relative z-10 px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-6">
            <div className="w-full lg:w-auto">
              <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-[#76B900]/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle
                    size={20}
                    className="text-[#76B900] sm:w-6 sm:h-6"
                  />
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#013D54]">
                  Quiz Review Summary
                </h2>
              </div>

              <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-xl">
                Review the questions you answered incorrectly and
                strengthen your understanding before attempting the
                quiz again.
              </p>
            </div>

            {/* Wrong Answer Card */}

            <div className="w-full lg:w-auto min-w-[160px] sm:min-w-[200px] md:min-w-[240px] bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-[#76B900]/30 p-3 sm:p-4 md:p-5">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-[#76B900]/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold text-[#76B900]">
                    {incorrectCount}
                  </span>
                </div>

                <div>
                  <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider">
                    Total
                  </p>

                  <h3 className="text-sm sm:text-lg md:text-xl font-bold text-[#013D54]">
                    Wrong Answers
                  </h3>

                  <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">
                    Needs Review
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* QUESTIONS */}
      {/* ========================================= */}

      <div className="space-y-3 sm:space-y-4 md:space-y-5 overflow-y-auto flex-1 pr-1 sm:pr-2 scrollbar-thin scrollbar-thumb-[#76B900]/30 scrollbar-track-slate-100">
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
              className="group bg-white border border-slate-200 hover:border-[#76B900]/40 hover:shadow-xl transition-all duration-300 rounded-xl sm:rounded-2xl overflow-hidden"
            >
              {/* Header */}

              <div className="bg-slate-50 border-b border-slate-200 px-3 sm:px-4 md:px-5 py-3 sm:py-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#013D54] text-white flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">
                    {idx + 1}
                  </div>

                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-slate-800">
                    {question.question_text}
                  </h3>
                </div>
              </div>

              {/* Answers */}

              <div className="p-3 sm:p-4 md:p-5 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                {/* Wrong Answer */}

                <div className="bg-red-50 border border-red-100 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                    <XCircle
                      size={14}
                      className="text-red-500 sm:w-4 sm:h-4"
                    />

                    <p className="text-xs sm:text-sm font-semibold text-red-600">
                      Your Answer
                    </p>
                  </div>

                  {selectedOptions.length > 0 ? (
                    <ul className="space-y-1 sm:space-y-1.5">
                      {selectedOptions.map((option) => (
                        <li
                          key={option.id}
                          className="text-xs sm:text-sm text-slate-700"
                        >
                          • {option.option_text}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs sm:text-sm italic text-slate-500">
                      Not Answered
                    </p>
                  )}
                </div>

                {/* Correct Answer */}

                <div className="bg-green-50 border border-green-100 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                    <CheckCircle2
                      size={14}
                      className="text-[#76B900] sm:w-4 sm:h-4"
                    />

                    <p className="text-xs sm:text-sm font-semibold text-[#76B900]">
                      Correct Answer
                    </p>
                  </div>

                  <ul className="space-y-1 sm:space-y-1.5">
                    {correctOptions.map((option) => (
                      <li
                        key={option.id}
                        className="text-xs sm:text-sm text-slate-700"
                      >
                        • {option.option_text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================= */}
      {/* FOOTER */}
      {/* ========================================= */}

      {onClose && (
        <div className="flex justify-center mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-200 flex-shrink-0">
          <button
            onClick={onClose}
            className="
              group
              flex
              items-center
              justify-center
              gap-2 sm:gap-3
              bg-[#013D54]
              hover:bg-[#012f41]
              text-white
              w-full sm:w-auto
              px-4 sm:px-6 md:px-8
              py-2.5 sm:py-3
              rounded-xl sm:rounded-2xl
              font-semibold
              text-sm sm:text-base
              shadow-lg
              transition-all
              duration-300
              hover:scale-105
            "
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform sm:w-4 sm:h-4"
            />

            Back to Submodule
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizAnswerSummary;