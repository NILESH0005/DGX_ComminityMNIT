import React from "react";
import { FiEdit3, FiFileText } from "react-icons/fi";

const MODES = [
  { value: "single", label: "Single Question", Icon: FiEdit3 },
  { value: "bulk", label: "Bulk Upload Excel", Icon: FiFileText },
];

const QuestionCreationMode = ({ mode, onChange, disabled = false }) => (
  <div className="flex justify-center mb-4">
    <div className="inline-flex rounded-lg border border-gray-300 bg-gray-50 p-1">
      {MODES.map(({ value, label, Icon }) => {
        const active = mode === value;
        return (
          <button
            key={value}
            type="button"
            disabled={disabled}
            onClick={() => !active && onChange(value)}
            title={disabled ? "Please wait until the bulk upload finishes" : undefined}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
              active ? "bg-blue-600 text-white shadow" : "text-gray-700 hover:bg-gray-200"
            } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <Icon size={14} />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  </div>
);

export default QuestionCreationMode;