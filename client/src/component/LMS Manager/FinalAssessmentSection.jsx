import React from "react";
import { motion } from "framer-motion";

import QuizOverviewCard from "./QuizOverviewCard";
import CertificateSectionCard from "./CertificateSectionCard";
// import ProgressJourney from "./ProgressJourney";

const FinalAssessmentSection = ({
  allSubModulesCompleted,
  moduleId,
  subModules,
  isSubModuleCompleted,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mt-16"
    >
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-700 via-indigo-700 to-green-600 shadow-2xl border border-white/10">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-green-300/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 p-8 md:p-12">
          {/* HEADER */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-5">
              <span className="text-sm font-semibold text-white tracking-wide">
                FINAL LEARNING STAGE
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Final Quiz &
              <span className="block text-green-300 mt-1">Certification</span>
            </h2>

            <p className="mt-5 text-lg text-blue-100 leading-relaxed">
              Complete the final assessment to unlock your course completion
              certificate.
            </p>
          </div>

          {/* JOURNEY */}
          {/* <ProgressJourney /> */}

          {/* MAIN CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
            <QuizOverviewCard
              allSubModulesCompleted={allSubModulesCompleted}
              subModules={subModules}
              moduleId={moduleId}
              isSubModuleCompleted={isSubModuleCompleted}
            />{" "}
            <CertificateSectionCard />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FinalAssessmentSection;
