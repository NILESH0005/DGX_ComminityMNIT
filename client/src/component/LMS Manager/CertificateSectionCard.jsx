import React, { useContext, useEffect, useState } from "react";
import { FaCertificate, FaLock, FaDownload } from "react-icons/fa";
import images from "../../../public/images";
import CertificateTemplate from "../quiz/CertificateTemplate";
import ApiContext from "../../context/ApiContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CertificateSection = ({
  shouldLockQuiz,
  subModules,
  isSubModuleCompleted,
  moduleId,
  hasCertificate,
  eventType,
}) => {
  const [certificatePath, setCertificatePath] = useState("");
  const [showCertificate, setShowCertificate] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const { fetchData, userToken } = useContext(ApiContext);
  const navigate = useNavigate();

  if (showCertificate) {
    return (
      <CertificateTemplate
        name="Student Name"
        college="College Name"
        certificatePath={certificatePath}
        eventType={eventType}
      />
    );
  }
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

      if (res?.success) {
        setQuizCompleted(res.quizIsComplete);

        // ✅ SAVE CERTIFICATE PATH
        if (res?.certificatePath) {
          setCertificatePath(res.certificatePath);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCompletionLoading(false);
    }
  };

  const handleCertificateClick = async () => {
    console.log("🔥 BUTTON CLICKED");

    // ✅ IF QUIZ ALREADY COMPLETED → OPEN CERTIFICATE
    if (quizCompleted) {
      setShowCertificate(true);
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

      const res = await fetchData(
        "quiz/getRandomQuiz",
        "POST",
        { moduleId },
        {
          "Content-Type": "application/json",
          "auth-token": userToken,
        },
      );

      if (!res?.success) {
        throw new Error(res?.message || "Failed to fetch quiz");
      }

      const quiz = res?.data || [];

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

  useEffect(() => {
    checkModuleCompletion();
  }, []);

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-white text-2xl font-bold">Certificate</h3>

          <p className="text-blue-100 text-sm mt-1">Course Completion Reward</p>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
          <FaCertificate className="text-3xl text-green-300" />
        </div>
      </div>

      <div className="rounded-3xl overflow-hidden border border-white/10 bg-black/20">
        <div className="relative overflow-hidden group">
          <img
            src={images.silverCertificateBackground}
            alt="Certificate Preview"
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-5">
            <div>
              <h4 className="text-white text-xl font-bold">
                Verified Certificate
              </h4>

              <p className="text-blue-100 text-sm mt-1">
                Unlock after passing the final assessment
              </p>
            </div>
          </div>
        </div>

        {/* INFO */}
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-400/20 flex items-center justify-center">
              <FaLock className="text-yellow-300 text-xl" />
            </div>

            <div>
              <h4 className="text-white text-lg font-semibold">
                Certificate Locked
              </h4>

              <p className="text-blue-100 text-sm mt-2 leading-relaxed">
                Pass the final quiz successfully to unlock your downloadable
                certificate.
              </p>
            </div>
          </div>

          {/* FEATURES */}
          <div className="mt-5 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-green-200">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              Shareable
            </div>

            <div className="text-blue-100">🎓 Verified</div>

            <div className="text-blue-100">⬇️ Downloadable</div>
          </div>
        </div>
      </div>

      {/* BUTTON */}
      <button
        onClick={handleCertificateClick}
        className="mt-6 w-full border border-white/20 text-white font-semibold py-4 rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3"
      >
        <FaDownload />
        View Certificate
      </button>
    </div>
  );
};

export default CertificateSection;
