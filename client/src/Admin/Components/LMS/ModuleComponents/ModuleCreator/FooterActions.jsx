import React from "react";

const FooterActions = ({
  onCancel,
  onCreate,
  isFormValid,
  isUploading,
  buttonText = "Create Module",
}) => {
  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-100 pt-6 flex justify-end gap-4">
      <button
        onClick={onCancel}
        type="button"
        className="px-6 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all"
      >
        Cancel
      </button>
      <button
        onClick={onCreate}
        disabled={!isFormValid || isUploading}
        className={`px-7 py-3 rounded-2xl text-white font-semibold shadow-lg transition-all duration-300 ${
          !isFormValid || isUploading
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] hover:shadow-blue-200"
        }`}
      >
        {isUploading ? "Uploading..." : buttonText}{" "}
      </button>
    </div>
  );
};

export default FooterActions;
