import React, { useContext, useState } from "react";
import { FaStar, FaPlayCircle, FaClock } from "react-icons/fa";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import ApiContext from "../../context/ApiContext";

const QuizOverviewCard = ({
  moduleId,
  allSubModulesCompleted = false,
  subModules = [],
  isSubModuleCompleted = () => false,
}) => {
  const navigate = useNavigate();

  const { fetchData, userToken } = useContext(ApiContext);

  const [quizLoading, setQuizLoading] = useState(false);

  const handleCertificateClick = async () => {
    console.log("🔥 BUTTON CLICKED");

    // LOCK CHECK
    if (!allSubModulesCompleted) {
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
  );
};

export default QuizOverviewCard;
