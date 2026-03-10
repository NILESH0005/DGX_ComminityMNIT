import React, { useState, useEffect } from "react";
import DynamicModuleCard from "./ModuleCard";
import LeaderBoard from "./LeaderBoard";
import HeroModel from "./ChatBot";
import ChatBotModal from "./ChatBotModal";
import { FiHelpCircle } from "react-icons/fi";

const LearningPath = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasModules, setHasModules] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const simulateLoad = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(simulateLoad);
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-blue-100 to-purple-100 overflow-hidden">

      {/* Animated background blobs */}
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-indigo-300 rounded-full opacity-30 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-300 rounded-full opacity-30 blur-3xl animate-pulse"></div>

      {/* HEADER */}
      <header className="relative z-10 backdrop-blur-xl bg-white/60 border-b border-white/40 shadow-md px-6 py-6 flex flex-col md:flex-row justify-between items-center">

        <div className="space-y-3 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 tracking-tight">
            DGX Learning Platform
          </h1>

          <p className="text-gray-600 text-lg md:text-xl">
            Explore interactive learning modules and enhance your AI skills
          </p>
        </div>

        {/* Chat Assistant Shortcut */}
        <div
          onClick={() => setIsChatOpen(true)}
          className="mt-4 md:mt-0 flex items-center gap-3 px-5 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all cursor-pointer"
        >
          <FiHelpCircle size={20} />
          Ask AI Assistant
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex flex-col lg:flex-row flex-1 relative z-10">

        {/* MODULE AREA */}
        <div className="w-full lg:w-3/4 overflow-y-auto p-8">

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-80 text-gray-600">

              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>

              <p className="text-lg font-medium">Loading learning modules...</p>

            </div>
          ) : hasModules ? (
            <div className="animate-fadeIn">
              <DynamicModuleCard />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-center">

              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                No Learning Modules Available
              </h3>

              <p className="text-gray-600">
                Your learning space is being prepared. Please check again soon.
              </p>

            </div>
          )}

        </div>

        {/* LEADERBOARD PANEL */}
        <div className="w-full lg:w-1/4 backdrop-blur-xl bg-white/60 border-t lg:border-t-0 lg:border-l border-white/30 shadow-lg">

          <div className="p-6 sticky top-0 bg-white/80 backdrop-blur-md border-b border-white/30">

            <h2 className="text-2xl font-bold text-indigo-800">
              Top Learners
            </h2>

            <p className="text-sm text-gray-600 mt-1">
              Celebrating outstanding learners
            </p>

          </div>

          <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(100vh-150px)]">
            <LeaderBoard />
          </div>

        </div>

      </div>

      {/* FLOATING AI ASSISTANT */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex flex-col items-center group"
      >

        <div className="w-[130px] h-[130px] flex justify-center items-center bg-white/70 backdrop-blur-lg rounded-full shadow-xl group-hover:scale-110 transition-transform">

          <HeroModel />

        </div>

        <span className="text-sm text-indigo-700 font-medium mt-2 opacity-80">
          AI Assistant
        </span>

      </button>

      {/* CHATBOT MODAL */}
      <ChatBotModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

    </div>
  );
};

export default LearningPath;