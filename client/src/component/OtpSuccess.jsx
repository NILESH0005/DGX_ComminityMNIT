import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OtpSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const regNumber = location?.state?.regNumber || "N/A";

  useEffect(() => {
    const container = document.querySelector(".confetti-wrapper");

    const createConfetti = () => {
      const confetti = document.createElement("div");

      const colors = ["#EF2964", "#00C09D", "#2D87B0", "#48485E", "#EFFF1D"];
      const size = Math.floor(Math.random() * 8) + 6;

      confetti.style.position = "absolute";
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * window.innerWidth + "px";
      confetti.style.top = "-10px";
      confetti.style.borderRadius = "2px";
      confetti.style.animation = "fall 3s linear forwards";

      container.appendChild(confetti);

      setTimeout(() => {
        confetti.remove();
      }, 3000);
    };

    const interval = setInterval(createConfetti, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-50 overflow-hidden">

      {/* Confetti */}
      <div className="confetti-wrapper absolute inset-0 overflow-hidden"></div>

      <div className="bg-white shadow-xl rounded-xl p-10 text-center max-w-lg z-10">

        {/* Success Icon */}
        <div className="w-32 h-32 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6 animate-scaleIn">
          <svg
            className="w-16 h-16 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-3 text-gray-800">
          Account Verified Successfully 🎉
        </h1>

        <p className="text-gray-500 mb-6">
          Welcome to the <span className="font-semibold text-green-600">"AI Awareness for All"</span>.
          Your account has been successfully verified.
        </p>

        {/* Registration Number Card */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-5 mb-6">
          <p className="text-gray-600 text-sm mb-1">
            Your Registration Number
          </p>
          <p className="text-2xl font-bold text-green-700 tracking-wider">
            {regNumber}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Please save this number for future reference.
          </p>
        </div>

        <p className="text-gray-500 mb-8">
          You can now login and start exploring courses, discussions, and learning resources.
        </p>

        <button
          onClick={() => navigate("/SignInn")}
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg shadow-lg transition"
        >
          Continue to Login
        </button>
      </div>

      <style>
        {`
          @keyframes fall {
            0% { transform: translateY(0) rotate(0deg); }
            100% { transform: translateY(100vh) rotate(720deg); }
          }

          @keyframes scaleIn {
            0% { transform: scale(0); }
            100% { transform: scale(1); }
          }

          .animate-scaleIn {
            animation: scaleIn 0.6s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default OtpSuccess;