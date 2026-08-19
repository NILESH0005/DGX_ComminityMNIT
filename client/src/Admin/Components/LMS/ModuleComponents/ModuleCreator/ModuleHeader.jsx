import React from "react";

const ModuleHeader = ({ mode }) => {
  return (
    <div className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50 px-8 py-7">
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-100 blur-3xl opacity-40" />
      <div className="relative flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            {mode === "edit" ? "Edit Module" : "Create New Module"}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            {mode === "edit"
              ? "Update the module details and save your changes."
              : "Configure your LMS module, assign batches, UI type, access permissions, and learning settings."}
          </p>
        </div>
        <div className="hidden md:flex h-16 w-16 rounded-2xl bg-white shadow-md items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ModuleHeader;
