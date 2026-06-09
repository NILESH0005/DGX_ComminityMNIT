import React from "react";
import { motion } from "framer-motion";

import {
  FaCheckCircle,
  FaLock,
  FaGraduationCap,
  FaClipboardCheck,
  FaArrowRight,
} from "react-icons/fa";

import QuizOverviewCard from "./QuizOverviewCard";
import CertificateSectionCard from "./CertificateSectionCard";

const FinalAssessmentSection = ({
  allSubModulesCompleted,
  moduleId,
  subModules,
  isSubModuleCompleted,
  quizAccessOnSubModuleCompletion,
  hasCertificate,
  eventType,
}) => {
  const shouldLockQuiz =
    Number(quizAccessOnSubModuleCompletion) === 1 && !allSubModulesCompleted;

  const showCertificate = Number(hasCertificate) === 1;

  // COMPLETION STATS
  const completedCount = subModules.filter((sm) =>
    isSubModuleCompleted(sm.SubModuleID),
  ).length;

  const totalCount = subModules.length;

  const completionPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="mt-8 sm:mt-12 lg:mt-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-[36px] bg-gradient-to-br from-blue-700 via-indigo-700 to-green-600 shadow-xl lg:shadow-2xl border border-white/10">
        {/* BACKGROUND GLOW - Responsive sizing */}
        <div className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-white/10 rounded-full blur-2xl lg:blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-green-300/10 rounded-full blur-2xl lg:blur-3xl"></div>

        {/* CONTENT */}
        <div className="relative z-10 p-5 sm:p-6 md:p-8 lg:p-12">
          
          {/* ========== DESKTOP LAYOUT (lg screens and above) ========== */}
          <div className="hidden lg:block">
            {/* HERO SECTION */}
            <div className="max-w-5xl mx-auto text-center">
              {/* TAG */}
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
                <FaGraduationCap className="text-green-300 text-base" />
                <span className="text-sm font-semibold text-white tracking-wide">
                  COURSE COMPLETION JOURNEY
                </span>
              </div>

              {/* TITLE */}
              <h2 className="text-6xl font-extrabold text-white leading-tight">
                You're in the
                <span className="block text-green-300 mt-2">
                  Final Learning Stage
                </span>
              </h2>

              {/* DESCRIPTION */}
              <p className="mt-6 text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
                Complete all learning modules, unlock the final assessment, and
                earn your verified course completion certificate.
              </p>

              {/* PROGRESS BOX */}
              <div className="mt-10 bg-white/10 border border-white/20 rounded-3xl p-6 backdrop-blur-xl">
                <div className="flex flex-row items-center justify-between gap-8">
                  {/* LEFT */}
                  <div className="text-left">
                    <p className="text-blue-100 text-sm uppercase tracking-wider">
                      Course Progress
                    </p>
                    <h3 className="text-4xl font-bold text-white mt-2">
                      {completedCount} / {totalCount}
                    </h3>
                    <p className="text-green-200 text-lg mt-2">
                      Modules Completed
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                      <FaCheckCircle className="text-green-300 text-base" />
                      <span className="text-white font-medium">
                        {completionPercentage}% Completed
                      </span>
                    </div>
                  </div>

                  {/* PROGRESS CIRCLE */}
                  <div className="relative w-36 h-36">
                    <div className="absolute inset-0 rounded-full border-[12px] border-white/20"></div>
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{
                        rotate: (completionPercentage / 100) * 360,
                      }}
                      transition={{
                        duration: 1,
                        ease: "easeOut",
                      }}
                      className="absolute inset-0 rounded-full border-[12px] border-green-400 border-t-transparent"
                    ></motion.div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <h3 className="text-3xl font-bold text-white">
                          {completionPercentage}%
                        </h3>
                        <p className="text-xs text-blue-100 mt-1">Progress</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* LEARNING JOURNEY - Horizontal */}
            <div className="mt-14 flex flex-row items-center justify-center gap-5">
              {/* STEP 1 */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-6 w-80 shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 ${
                      completedCount === totalCount
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    <FaCheckCircle className="text-white text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xl">
                      Complete Modules
                    </h3>
                    <p className="text-blue-100 mt-1">
                      Finish all learning submodules to unlock your final
                      assessment.
                    </p>
                    <div className="mt-3 text-green-200 font-semibold">
                      {completedCount} of {totalCount} completed
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ARROW */}
              <FaArrowRight className="text-white text-3xl" />

              {/* STEP 2 */}
              <motion.div
                whileHover={{ y: -5 }}
                className={`bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-6 shadow-lg ${
                  showCertificate ? "w-80" : "w-[420px]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 ${
                      shouldLockQuiz ? "bg-gray-500" : "bg-blue-500"
                    }`}
                  >
                    {shouldLockQuiz ? (
                      <FaLock className="text-white text-2xl" />
                    ) : (
                      <FaClipboardCheck className="text-white text-2xl" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xl">
                      Final Assessment
                    </h3>
                    <p className="text-blue-100 mt-1">
                      Test your understanding through the final course quiz.
                    </p>
                    <div
                      className={`mt-3 font-semibold ${
                        shouldLockQuiz ? "text-yellow-200" : "text-green-200"
                      }`}
                    >
                      {shouldLockQuiz
                        ? "Quiz Locked Until Completion"
                        : "Quiz Unlocked"}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* CERTIFICATE STEP */}
              {showCertificate && (
                <>
                  <FaArrowRight className="text-white text-3xl" />
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-6 w-80 shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-green-600 shadow-lg flex-shrink-0">
                        <FaGraduationCap className="text-white text-2xl" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-xl">
                          Earn Certificate
                        </h3>
                        <p className="text-blue-100 mt-1">
                          Successfully complete the quiz and unlock your verified
                          certificate.
                        </p>
                        <div className="mt-3 text-green-200 font-semibold">
                          Shareable & Verified
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          </div>

          {/* ========== MOBILE & TABLET LAYOUT (below lg screens) ========== */}
          <div className="lg:hidden">
            {/* HEADER SECTION - Compact */}
            <div className="max-w-5xl mx-auto">
              {/* BADGE */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4 sm:mb-6">
                <FaGraduationCap className="text-green-300 text-xs sm:text-sm" />
                <span className="text-[11px] sm:text-xs font-semibold text-white tracking-wide uppercase">
                  Final Stage
                </span>
              </div>

              {/* TITLE - Compact for mobile */}
              <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
                Final Learning
                <span className="block text-green-300 text-lg sm:text-2xl md:text-3xl mt-1">
                  Assessment Stage
                </span>
              </h2>

              {/* DESCRIPTION - Condensed */}
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-blue-100 leading-relaxed">
                Complete all modules to unlock the final assessment and earn your certificate.
              </p>

              {/* PROGRESS SECTION - Compact Card */}
              <div className="mt-5 sm:mt-6 bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4">
                  {/* Progress Stats */}
                  <div className="flex-1">
                    <p className="text-blue-100 text-[10px] sm:text-xs uppercase tracking-wider">
                      Course Progress
                    </p>
                    <div className="flex items-baseline gap-1 sm:gap-2 mt-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-white">
                        {completedCount}/{totalCount}
                      </h3>
                      <span className="text-green-200 text-xs sm:text-sm">
                        modules
                      </span>
                    </div>
                    <div className="mt-2 sm:mt-3 flex items-center gap-2">
                      <div className="flex-1 h-1.5 sm:h-2 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${completionPercentage}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-green-400 rounded-full"
                        />
                      </div>
                      <span className="text-white text-xs sm:text-sm font-semibold min-w-[45px]">
                        {completionPercentage}%
                      </span>
                    </div>
                  </div>

                  {/* Mini Progress Ring */}
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
                    <div className="absolute inset-0 rounded-full border-4 sm:border-[5px] border-white/20"></div>
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: (completionPercentage / 100) * 360 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="absolute inset-0 rounded-full border-4 sm:border-[5px] border-green-400 border-t-transparent"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-xs sm:text-sm font-bold">
                        {completionPercentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* JOURNEY STEPS - Vertical Timeline for Mobile/Tablet */}
            <div className="mt-8 sm:mt-10">
              <div className="flex flex-col gap-4">
                
                {/* Step 1 - Complete Modules */}
                <motion.div
                  whileHover={{ x: 5 }}
                  className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-xl p-3.5 sm:p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        completedCount === totalCount ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    >
                      <FaCheckCircle className="text-white text-base" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-sm sm:text-base">
                        Complete Modules
                      </h3>
                      <p className="text-blue-100 text-xs mt-0.5">
                        {completedCount}/{totalCount} completed
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Connector Line */}
                <div className="flex justify-center">
                  <div className="w-px h-6 bg-white/30"></div>
                </div>

                {/* Step 2 - Final Assessment */}
                <motion.div
                  whileHover={{ x: 5 }}
                  className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-xl p-3.5 sm:p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        shouldLockQuiz ? "bg-gray-500/50" : "bg-blue-500"
                      }`}
                    >
                      {shouldLockQuiz ? (
                        <FaLock className="text-white text-sm" />
                      ) : (
                        <FaClipboardCheck className="text-white text-sm" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-sm sm:text-base">
                        Final Assessment
                      </h3>
                      <p className={`text-xs mt-0.5 font-medium ${
                        shouldLockQuiz ? "text-yellow-200" : "text-green-200"
                      }`}>
                        {shouldLockQuiz ? "🔒 Locked" : "✓ Unlocked"}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Certificate Step - Conditional */}
                {showCertificate && (
                  <>
                    <div className="flex justify-center">
                      <div className="w-px h-6 bg-white/30"></div>
                    </div>

                    <motion.div
                      whileHover={{ x: 5 }}
                      className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-xl p-3.5 sm:p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-600 flex-shrink-0">
                          <FaGraduationCap className="text-white text-base" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold text-sm sm:text-base">
                            Earn Certificate
                          </h3>
                          <p className="text-green-200 text-xs mt-0.5 font-medium">
                            ✓ Upon completion
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            </div>

            {/* COMPACT INFO BANNER - Only shown on mobile when quiz is locked */}
            {shouldLockQuiz && !allSubModulesCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 sm:mt-5 p-3 bg-yellow-500/20 border border-yellow-400/30 rounded-lg"
              >
                <p className="text-yellow-100 text-xs text-center">
                  Complete all {totalCount} modules to unlock the final assessment
                </p>
              </motion.div>
            )}
          </div>

          {/* MAIN CARDS SECTION - Shared between both layouts */}
          <div
            className={`grid gap-5 sm:gap-6 mt-10 sm:mt-12 lg:mt-14 ${
              showCertificate ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
            }`}
          >
            {/* QUIZ CARD */}
            <QuizOverviewCard
              allSubModulesCompleted={allSubModulesCompleted}
              subModules={subModules}
              moduleId={moduleId}
              isSubModuleCompleted={isSubModuleCompleted}
              shouldLockQuiz={shouldLockQuiz}
              hasCertificate={hasCertificate}
              eventType={eventType}
            />
            
            {/* CERTIFICATE CARD */}
            {showCertificate && (
              <CertificateSectionCard
                shouldLockQuiz={shouldLockQuiz}
                subModules={subModules}
                isSubModuleCompleted={isSubModuleCompleted}
                moduleId={moduleId}
                hasCertificate={hasCertificate}
                eventType={eventType}
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FinalAssessmentSection;