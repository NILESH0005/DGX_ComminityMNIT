import React from "react";
import ValidationError from "./ValidationError";
import CharacterCounter from "./CharacterCounter";

const BasicInfoSection = ({ module, errors, touched, onChange, onBlur }) => {
  return (
    <div className="bg-gray-50/70 border border-gray-100 rounded-3xl p-7 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          Basic Information
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Define the module title and description.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Module Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Introduction to Artificial Intelligence"
            value={module.name}
            onChange={onChange}
            onBlur={onBlur}
            className={`w-full rounded-2xl border px-4 py-3.5 text-sm transition-all duration-200 focus:outline-none ${
              errors.name && touched.name
                ? "border-red-300 bg-red-50 focus:ring-4 focus:ring-red-100"
                : "border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            }`}
          />
          <CharacterCounter value={module.name} maxLength={100} />
          <ValidationError error={errors.name} touched={touched.name} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Module Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            placeholder="Describe what learners will gain from this module..."
            value={module.description}
            onChange={onChange}
            onBlur={onBlur}
            className={`w-full rounded-2xl border px-4 py-3.5 h-32 text-sm transition-all duration-200 focus:outline-none ${
              errors.description && touched.description
                ? "border-red-300 bg-red-50 focus:ring-4 focus:ring-red-100"
                : "border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            }`}
          />
          <CharacterCounter value={module.description} maxLength={500} />
          <ValidationError error={errors.description} touched={touched.description} />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;