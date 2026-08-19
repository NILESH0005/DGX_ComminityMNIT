import React from "react";
import { motion } from "framer-motion";

const SUGGESTED_TAGS = [
  "#AI",
  "#MachineLearning",
  "#DeepLearning",
  "#React",
  "#Python",
  "#NVIDIA",
  "#DataScience",
  "#ComputerVision",
  "#Cloud",
  "#LMS",
];

const TagsSection = ({ module, onTagKeyDown, removeTag, setNewModule }) => {
  return (
    <div className="bg-gray-50/70 border border-gray-100 rounded-3xl p-7 space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Module Tags</h3>
          <p className="text-sm text-gray-500 mt-1">
            Add tags related to this module for AI recommendations, smart
            search, filtering, and discoverability.
          </p>
        </div>
        <div
          className={`px-4 py-2 rounded-2xl text-sm font-semibold ${
            module.tags.length >= 3
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {module.tags.length}/3 Minimum Tags
        </div>
      </div>

      <div
        className={`rounded-3xl border-2 bg-white p-4 transition-all duration-300 ${
          module.tags.length < 3
            ? "border-yellow-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100"
            : "border-green-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100"
        }`}
      >
        <div className="flex flex-wrap gap-3 mb-3">
          {module.tags.map((tag) => (
            <motion.div
              key={tag}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-2xl shadow-md hover:shadow-lg transition-all"
            >
              <span className="text-sm font-medium">{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="h-5 w-5 rounded-full bg-white/20 hover:bg-red-500 flex items-center justify-center transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            #
          </div>
          <input
            type="text"
            value={module.tagInput}
            placeholder="Type a tag and press Enter (e.g. AI, React, MachineLearning)"
            onChange={(e) =>
              setNewModule((prev) => ({ ...prev, tagInput: e.target.value }))
            }
            onKeyDown={onTagKeyDown}
            className="flex-1 border-none bg-transparent outline-none text-sm placeholder:text-gray-400"
          />
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-500 mb-3">
          Suggested Tags
        </p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_TAGS.map((suggestedTag) => (
            <button
              key={suggestedTag}
              type="button"
              onClick={() => {
                if (!module.tags.includes(suggestedTag)) {
                  setNewModule((prev) => ({
                    ...prev,
                    tags: [...prev.tags, suggestedTag],
                  }));
                }
              }}
              className="px-4 py-2 rounded-2xl border border-gray-200 bg-white text-sm text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
            >
              {suggestedTag}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            ℹ
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-800">
              Why tags matter?
            </h4>
            <p className="text-sm text-blue-700 mt-1 leading-relaxed">
              Tags improve module discoverability, AI recommendations,
              semantic search, trending systems, and personalized learning
              experiences inside the LMS.
            </p>
          </div>
        </div>
      </div>

      {module.tags.length < 1 && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Please add at least 1 tags to continue
        </div>
      )}
    </div>
  );
};

export default TagsSection;