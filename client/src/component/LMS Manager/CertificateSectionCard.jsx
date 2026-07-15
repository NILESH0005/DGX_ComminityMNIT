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
  const [completionLoading, setCompletionLoading] = useState(true);
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
      if (!certificatePath) {
        Swal.fire({
          icon: "error",
          title: "Certificate not available",
        });
        return;
      }

      const baseUrl = import.meta.env.VITE_API_BASEURL;

      const fullUrl = `${baseUrl.replace(/\/$/, "")}/${certificatePath.replace(
        /^\//,
        "",
      )}`;

      window.open(fullUrl, "_blank");
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
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-xl h-full">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5">
        <div className="flex-1">
          <h3 className="text-white text-xl sm:text-2xl font-bold">
            Certificate
          </h3>
          <p className="text-blue-100 text-xs sm:text-sm mt-0.5 sm:mt-1">
            Course Completion Reward
          </p>
        </div>

        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 flex-shrink-0">
          <FaCertificate className="text-2xl sm:text-3xl text-green-300" />
        </div>
      </div>

      {/* CERTIFICATE PREVIEW SECTION */}
      <div className="rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 bg-black/20">
        <div className="relative overflow-hidden group">
          <img
            src={images.silverCertificateBackground}
            alt="Certificate Preview"
            className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* OVERLAY - Responsive padding */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3 sm:p-4 md:p-5">
            <div>
              <h4 className="text-white text-base sm:text-lg md:text-xl font-bold">
                Verified Certificate
              </h4>
              <p className="text-blue-100 text-xs sm:text-sm mt-0.5 sm:mt-1">
                Unlock after passing the final assessment
              </p>
            </div>
          </div>
        </div>

        {/* INFO SECTION */}
        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-yellow-400/20 flex items-center justify-center flex-shrink-0">
              <FaLock className="text-yellow-300 text-lg sm:text-xl" />
            </div>

            <div className="flex-1">
              <h4 className="text-white text-base sm:text-lg font-semibold">
                Certificate Locked
              </h4>
              <p className="text-blue-100 text-xs sm:text-sm mt-1 sm:mt-2 leading-relaxed">
                Pass the final quiz successfully to unlock your downloadable
                certificate.
              </p>
            </div>
          </div>

          {/* FEATURES - Responsive flex wrap */}
          <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-start sm:justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 sm:gap-2 text-green-200">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-xs sm:text-sm">Shareable</span>
            </div>

            <div className="text-blue-100 flex items-center gap-1">
              <span className="text-sm">🎓</span>
              <span className="text-xs sm:text-sm">Verified</span>
            </div>

            <div className="text-blue-100 flex items-center gap-1">
              <span className="text-sm">⬇️</span>
              <span className="text-xs sm:text-sm">Downloadable</span>
            </div>
          </div>
        </div>
      </div>

      {/* BUTTON - Responsive sizing */}
      <button
        onClick={handleCertificateClick}
        disabled={completionLoading}
        className={`mt-4 sm:mt-5 md:mt-6 w-full border border-white/20 text-white font-semibold py-3 sm:py-3.5 md:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 ${
          completionLoading
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-white/10 active:scale-95"
        }`}
      >
        <FaDownload className="text-sm sm:text-base" />
        <span className="text-sm sm:text-base">
          {completionLoading ? "Checking Status..." : "View Certificate"}
        </span>
      </button>
    </div>
  );
};

export default CertificateSection;
