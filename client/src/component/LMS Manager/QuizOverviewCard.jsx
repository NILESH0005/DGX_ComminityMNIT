<<<<<<< HEAD
import React, { useContext, useState } from "react";
import { FaStar, FaPlayCircle, FaClock } from "react-icons/fa";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import ApiContext from "../../context/ApiContext";
=======
import React, { useContext, useState, useEffect } from "react";
import { FaStar, FaPlayCircle, FaClock, FaCheckCircle } from "react-icons/fa";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import ApiContext from "../../context/ApiContext";
import images from "../../../public/images";

>>>>>>> 436d2bc667e0b0de423b8f17655dab9e8d93c9f1

const QuizOverviewCard = ({
  moduleId,
  allSubModulesCompleted = false,
  subModules = [],
  isSubModuleCompleted = () => false,
<<<<<<< HEAD
=======
  shouldLockQuiz = false,
  hasCertificate,
  eventType,
>>>>>>> 436d2bc667e0b0de423b8f17655dab9e8d93c9f1
}) => {
  const navigate = useNavigate();

  const { fetchData, userToken } = useContext(ApiContext);
<<<<<<< HEAD

  const [quizLoading, setQuizLoading] = useState(false);

  const handleCertificateClick = async () => {
    console.log("🔥 BUTTON CLICKED");

    // LOCK CHECK
    if (!allSubModulesCompleted) {
=======
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

      console.log("whatis teh satatataatatt", res)

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
>>>>>>> 436d2bc667e0b0de423b8f17655dab9e8d93c9f1
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
<<<<<<< HEAD
=======

          hasCertificate: Number(hasCertificate) === 1,
          eventType,
>>>>>>> 436d2bc667e0b0de423b8f17655dab9e8d93c9f1
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
<<<<<<< HEAD
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl">
      {/* TOP */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-white text-2xl font-bold">Final Quiz</h3>

          <p className="text-blue-100 text-sm mt-1">AI Generated Assessment</p>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
          <FaStar className="text-3xl text-yellow-300" />
        </div>
      </div>

      {/* QUIZ INFO */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between bg-black/20 rounded-2xl p-4 border border-white/10">
          <div>
            <p className="text-sm text-blue-100">Questions</p>

            <h4 className="text-xl font-bold text-white mt-1">Dynamic Quiz</h4>
          </div>

          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <FaPlayCircle className="text-blue-200 text-xl" />
          </div>
        </div>

        <div className="flex items-center justify-between bg-black/20 rounded-2xl p-4 border border-white/10">
          <div>
            <p className="text-sm text-blue-100">Duration</p>

            <h4 className="text-xl font-bold text-white mt-1">
              Auto Generated
            </h4>
          </div>

          <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
            <FaClock className="text-green-200 text-xl" />
          </div>
        </div>
      </div>

      {/* BUTTON */}
      <button
        onClick={handleCertificateClick}
        disabled={quizLoading}
        className="w-full bg-white text-blue-700 font-bold py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg flex items-center justify-center gap-3 disabled:opacity-60"
      >
        <FaPlayCircle />

        {quizLoading ? "Loading Quiz..." : "Start Final Quiz"}
      </button>

      {/* FOOTER */}
      <div className="mt-6 p-4 rounded-2xl bg-black/20 border border-white/10">
        <p className="text-sm text-blue-100 leading-relaxed">
          Pass the final assessment to unlock your course certificate.
        </p>
      </div>
    </div>
=======
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-14"
    >
      <div className="relative overflow-hidden rounded-[32px] border border-white/30 bg-white/70 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
        {/* TOP GLOW */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-green-500/10 pointer-events-none" />

        <div className="relative p-8">
          {/* HEADER */}
          <div className="flex items-start justify-between flex-wrap gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-4">
                <FaCheckCircle className="text-[11px]" />
                Final Assessment
              </div>

              <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
                Module Completion Quiz
              </h2>

              <p className="text-gray-600 mt-2 text-[15px] max-w-xl leading-relaxed">
                Test your understanding and complete the final assessment to
                finish this learning journey.
              </p>

              {quizCompleted && (
                <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-green-100 border border-green-200 text-green-700 text-sm font-semibold">
                  ✅ Assessment Completed Successfully
                </div>
              )}
            </div>

            {/* ICON */}
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center shadow-xl">
              <FaPlayCircle className="text-white text-3xl" />
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-5">
              <p className="text-sm text-blue-700 font-medium mb-1">
                Assessment Type
              </p>

              <h4 className="text-xl font-bold text-gray-900">Final Quiz</h4>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-5">
              <p className="text-sm text-green-700 font-medium mb-1">Access</p>

              <h4 className="text-xl font-bold text-gray-900">Module Based</h4>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 p-5">
              <p className="text-sm text-purple-700 font-medium mb-1">Unlock</p>

              <h4 className="text-xl font-bold text-gray-900">Certificate</h4>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8">
            <button
              onClick={handleCertificateClick}
              disabled={quizLoading || completionLoading || quizCompleted}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg
            ${
              quizCompleted
                ? "bg-green-500 text-white cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-green-500 text-white hover:scale-[1.01] hover:shadow-2xl"
            }`}
            >
              <FaPlayCircle />

              {completionLoading
                ? "Checking Status..."
                : quizCompleted
                  ? "Assessment Completed"
                  : quizLoading
                    ? "Loading Assessment..."
                    : "Start Assessment"}
            </button>
          </div>

          {/* FOOTER */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              {hasCertificate
                ? "Complete the final assessment successfully to unlock your verified certificate."
                : "Finish the assessment to complete this learning module successfully."}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
>>>>>>> 436d2bc667e0b0de423b8f17655dab9e8d93c9f1
  );
};

export default QuizOverviewCard;
