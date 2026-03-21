import React, { useState, useEffect } from "react";
import DynamicModuleCard from "./ModuleCard";
import { FiHelpCircle } from "react-icons/fi";
import UserBadges from "../UserBadges"; // ✅ FIXED IMPORT

const LearningPath = ({ userId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasModules, setHasModules] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-blue-100 to-purple-100">

      {/* HEADER */}
      <header className="bg-white/60 border-b shadow-md px-6 py-6 flex flex-col md:flex-row items-center">

        {/* LEFT */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-indigo-700">
            DGX Learning Platform
          </h1>
        </div>

        {/* CENTER → BADGES */}
        <div className="flex-1 flex justify-center mt-4 md:mt-0">
          {/* 🔥 HARD TEST (remove userId condition) */}
          <UserBadges userId={userId || 1} compact={true} />
        </div>

        {/* RIGHT */}
        <div className="flex-1 flex justify-end mt-4 md:mt-0">
          <div
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer"
          >
            <FiHelpCircle />
            Ask AI
          </div>
        </div>

      </header>

      {/* CONTENT */}
      <div className="p-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : hasModules ? (
          <DynamicModuleCard />
        ) : (
          <p>No modules available</p>
        )}
      </div>

    </div>
  );
};

export default LearningPath;