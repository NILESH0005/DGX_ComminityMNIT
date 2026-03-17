import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const WelcomeBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const badge = location.state?.badge;

  useEffect(() => {
    console.log("BADGE DATA:", badge);

    if (!badge?.badge) {
      navigate("/LearningPath");
    }
  }, [badge, navigate]);

  const imageSrc = badge?.badge
    ? `data:image/png;base64,${badge.badge}`
    : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          🎉 Congratulations!
        </h1>

        <p className="text-gray-600 mb-4">You unlocked:</p>

        {imageSrc ? (
          <img
            src={imageSrc}
            alt="Badge"
            className="w-32 h-32 mx-auto mb-4 rounded-full shadow-lg"
          />
        ) : (
          <p className="text-red-500">Image not found</p>
        )}

        <h2 className="text-xl font-semibold mb-6">
          {badge?.badge_name}
        </h2>

        <button
          onClick={() => navigate("/LearningPath")}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-blue-600"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default WelcomeBadge;