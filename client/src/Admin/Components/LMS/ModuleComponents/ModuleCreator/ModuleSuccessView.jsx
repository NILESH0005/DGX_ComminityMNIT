import React from "react";
import { motion } from "framer-motion";
import ModuleCard from "./ModuleCard";

const ModuleSuccessView = ({
  existingModules,
  newModule,
  onCancel,
  onCreateAnother,
}) => {
  const allModules = [
    ...existingModules,
    {
      ...newModule,
      banner:
        newModule.bannerUrl ||
        (newModule.banner
          ? URL.createObjectURL(newModule.banner)
          : null),
      subModules: [],
      createdAt: new Date().toISOString(),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-4xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Module Created Successfully!
            </h3>
            <p className="text-gray-600">
              Your new learning module is ready for content
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={onCreateAnother}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-200 font-medium"
            >
              Create Another
            </button>
            <button
              onClick={onCancel}
              className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 active:scale-95 transition-all duration-200 font-medium"
            >
              Back to Modules
            </button>
          </div>
        </div>
      </motion.div>

      <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        Your Modules
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allModules.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </div>
    </motion.div>
  );
};

export default ModuleSuccessView;