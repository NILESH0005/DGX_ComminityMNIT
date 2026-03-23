import React, { useState, useEffect } from "react";
import DynamicModuleCard from "./ModuleCard";
import { FiHelpCircle } from "react-icons/fi";
import UserBadges from "../UserBadges";
import BadgeCompletion3D from "./BadgeCompletion3D";

const LearningPath = ({ userId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasModules, setHasModules] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // ✅ Badge toggle state
  const [showBadges, setShowBadges] = useState(false);

  // 🔥 Fallback userId (IMPORTANT FIX)
  const finalUserId = userId || 1;

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
          {/* Optional compact badges */}
          {/* <UserBadges userId={finalUserId} compact /> */}
        </div>

        {/* RIGHT */}
        <div className="flex-1 flex justify-end mt-4 md:mt-0">
          {/* Future AI button */}
        </div>
      </header>

      {/* CONTENT */}
      <div className="p-4 sm:p-6 md:p-8 flex-1">
        
        {/* 👑 3D Crown (ALWAYS RENDERED NOW) */}
        <div className="mb-6 flex justify-center">
          <BadgeCompletion3D userId={finalUserId} />
        </div>

        {/* MAIN CONTENT */}
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : hasModules ? (
          <DynamicModuleCard />
        ) : (
          <p className="text-center text-gray-600">
            No modules available
          </p>
        )}
      </div>

      {/* 🏆 FLOATING BADGES (BOTTOM RIGHT) */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
        
        {/* Expanded Badge Panel */}
        {showBadges && (
          <div className="mb-3 w-[320px] sm:w-[360px] max-h-[320px] bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300">
            
            {/* HEADER */}
            <div className="flex items-center justify-between px-4 py-2 border-b bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                🏆 Achievements
              </h3>

              {/* Close Button */}
              <button
                onClick={() => setShowBadges(false)}
                className="text-white hover:scale-110 transition"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="p-3 overflow-y-auto max-h-[240px]">
              
              {/* BADGES */}
              <div className="flex flex-wrap gap-3 justify-start">
                <UserBadges userId={finalUserId} compact={false} />
              </div>

            </div>

            {/* FOOTER */}
            <div className="px-3 py-2 border-t bg-gray-50 flex justify-between items-center text-xs text-gray-600">
              <span>Keep learning to unlock more 🚀</span>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setShowBadges(!showBadges)}
          className="relative group px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-medium shadow-lg flex items-center gap-2 overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
        >
          {/* Glow Effect */}
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 blur-xl"></span>

          {/* Content */}
          <span className="relative flex items-center gap-2">
            <span className="text-lg">🏆</span>
            <span className="text-sm tracking-wide">Badges</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default LearningPath;