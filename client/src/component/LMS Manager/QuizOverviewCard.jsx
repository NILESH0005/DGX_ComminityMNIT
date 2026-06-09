import React, { useContext, useState, useEffect } from "react";
import { FaStar, FaPlayCircle, FaClock, FaCheckCircle } from "react-icons/fa";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import ApiContext from "../../context/ApiContext";
import images from "../../../public/images";

const QuizOverviewCard = ({
  moduleId,
  allSubModulesCompleted = false,
  subModules = [],
  isSubModuleCompleted = () => false,
  shouldLockQuiz = false,
  hasCertificate,
  eventType,
}) => {
  const navigate = useNavigate();

  const { fetchData, userToken } = useContext(ApiContext);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const [completionLoading, setCompletionLoading] = useState(true);
  const [quizLoading, setQuizLoading] = useState(false);

  const checkModuleCompletion = async () => {
    try {
      setCompletionLoading(true);

      const res = await fetchData(
        `quiz/check-module-completion/${moduleId}`,
        "GET",
        {},
        {
          "auth-token": userToken,
        },
      );

      console.log("whatis teh satatataatatt", res);

      if (res?.success) {
        setQuizCompleted(res.quizIsComplete);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCompletionLoading(false);
    }
  };

  useEffect(() => {
    checkModuleCompletion();
  }, []);

  const handleCertificateClick = async () => {
    console.log("🔥 BUTTON CLICKED");
    if (quizCompleted) {
      Swal.fire({
        icon: "success",
        title: "Quiz Already Completed 🎉",
        text: "You have already completed this assessment successfully.",
        confirmButtonColor: "#16a34a",
      });

      return;
    }
    // LOCK CHECK
    if (shouldLockQuiz) {
      const remainingCount = subModules.filter(
        (sm) => !isSubModuleCompleted(sm.SubModuleID),
      ).length;

      Swal.fire({
        icon: "info",
        title: "🔒 Quiz Locked",
        html: `
          <div style="text-align:center;font-family:'Nunito',sans-serif;">
            <p style="color:#4b5563;margin-bottom:12px;font-size:15px;">
              Complete all milestones before taking the final quiz.
            </p>

            <div style="display:inline-flex;align-items:center;gap:8px;background:#fef3c7;border:1.5px solid #f59e0b;border-radius:10px;padding:8px 16px;">
              <span style="font-size:18px;">📚</span>

              <span style="color:#92400e;font-weight:700;font-size:13px;">
                ${remainingCount} milestone${remainingCount !== 1 ? "s" : ""} remaining
              </span>
            </div>

            <p style="color:#6b7280;font-size:12px;margin-top:12px;">
              Finish all learning modules to unlock the assessment.
            </p>
          </div>
        `,
        confirmButtonColor: "#6b7280",
        confirmButtonText: "Got it",
      });

      return;
    }

    try {
      setQuizLoading(true);

      console.log("🔥 CALLING API");

      const res = await fetchData(
        "quiz/getRandomQuiz",
        "POST",
        { moduleId },
        {
          "Content-Type": "application/json",
          "auth-token": userToken,
        },
      );

      console.log("🔥 API RESPONSE:", res);

      if (!res?.success) {
        throw new Error(res?.message || "Failed to fetch quiz");
      }

      const quiz = res?.data || [];

      console.log("🔥 QUIZ DATA:", quiz);
      navigate("/quiz", {
        state: {
          quiz: {
            QuizID: quiz.QuizID,
            group_id: quiz.QuizCategory,
            title: quiz.QuizName,
            QuizDuration: quiz.QuizDuration,
          },

          hasCertificate: Number(hasCertificate) === 1,
          eventType,
        },
      });
    } catch (error) {
      console.error("❌ Quiz Fetch Error:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to load quiz. Please try again.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setQuizLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 sm:mt-10 lg:mt-14"
    >
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-[32px] border border-white/30 bg-white/70 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
        {/* TOP GLOW */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-green-500/10 pointer-events-none" />

        <div className="relative p-4 sm:p-6 md:p-7 lg:p-8">
          {/* HEADER - Responsive flex column on mobile */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
            <div className="flex-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-full bg-blue-100 text-blue-700 text-[10px] sm:text-xs font-semibold mb-3 sm:mb-4">
                <FaCheckCircle className="text-[9px] sm:text-[11px]" />
                <span>Final Assessment</span>
              </div>

              {/* Title - Responsive font sizes */}
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-extrabold text-gray-900 leading-tight">
                Module Completion Quiz
              </h2>

              {/* Description */}
              <p className="text-gray-600 mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-[15px] max-w-xl leading-relaxed">
                Test your understanding and complete the final assessment to
                finish this learning journey.
              </p>

              {/* Completion Status */}
              {quizCompleted && (
                <div className="mt-3 sm:mt-4 md:mt-5 inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-green-100 border border-green-200 text-green-700 text-xs sm:text-sm font-semibold">
                  <FaCheckCircle className="text-green-600 text-sm sm:text-base" />
                  <span>Assessment Completed Successfully</span>
                </div>
              )}
            </div>

            {/* Icon - Hidden on very small screens, visible from sm up */}
            <div className="hidden sm:flex w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-500 to-green-500 items-center justify-center shadow-xl flex-shrink-0">
              <FaPlayCircle className="text-white text-xl sm:text-2xl md:text-3xl" />
            </div>
          </div>

          {/* STATS - Responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-7 md:mt-8">
            {/* Assessment Type */}
            <div className="rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-3 sm:p-4 md:p-5">
              <p className="text-[11px] sm:text-xs md:text-sm text-blue-700 font-medium mb-0.5 sm:mb-1">
                Assessment Type
              </p>
              <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                Final Quiz
              </h4>
            </div>

            {/* Access */}
            <div className="rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-3 sm:p-4 md:p-5">
              <p className="text-[11px] sm:text-xs md:text-sm text-green-700 font-medium mb-0.5 sm:mb-1">
                Access
              </p>
              <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                Module Based
              </h4>
            </div>

            {/* Unlock */}
            <div className="rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 p-3 sm:p-4 md:p-5">
              <p className="text-[11px] sm:text-xs md:text-sm text-purple-700 font-medium mb-0.5 sm:mb-1">
                Unlock
              </p>
              <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                Certificate
              </h4>
            </div>
          </div>

          {/* CTA BUTTON - Responsive sizing */}
          <div className="mt-6 sm:mt-7 md:mt-8">
            <button
              onClick={handleCertificateClick}
              disabled={quizLoading || completionLoading || quizCompleted}
              className={`w-full py-3 sm:py-3.5 md:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base md:text-lg transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-lg
            ${
              quizCompleted
                ? "bg-green-500 text-white cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-green-500 text-white hover:scale-[1.01] hover:shadow-2xl"
            } ${!quizCompleted && !completionLoading && !quizLoading ? "active:scale-95" : ""}`}
            >
              <FaPlayCircle className="text-sm sm:text-base md:text-lg" />

              <span className="text-sm sm:text-base md:text-lg">
                {completionLoading
                  ? "Checking Status..."
                  : quizCompleted
                    ? "Assessment Completed"
                    : quizLoading
                      ? "Loading Assessment..."
                      : "Start Assessment"}
              </span>
            </button>
          </div>

          {/* FOOTER NOTE - Responsive */}
          <div className="mt-4 sm:mt-5 md:mt-6 rounded-xl sm:rounded-2xl border border-gray-200 bg-gray-50 px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-4">
            <p className="text-[11px] sm:text-xs md:text-sm text-gray-600 leading-relaxed">
              {hasCertificate
                ? "✅ Complete the final assessment successfully to unlock your verified certificate."
                : "📝 Finish the assessment to complete this learning module successfully."}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuizOverviewCard;