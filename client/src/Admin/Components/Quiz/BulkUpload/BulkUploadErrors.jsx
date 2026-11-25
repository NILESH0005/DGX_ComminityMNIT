import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

/**
 * Shows ALL errors together.
 * errors: [{ row, sno, message, status? }]
 * variant: "error" (red, validation) | "warning" (amber, API failures)
 */
const BulkUploadErrors = ({ title, errors = [], variant = "error", footer = null }) => {
  if (!errors.length) return null;

  const theme =
    variant === "warning"
      ? { box: "border-amber-300 bg-amber-50", head: "text-amber-800", item: "border-amber-200" }
      : { box: "border-red-300 bg-red-50", head: "text-red-700", item: "border-red-200" };

  return (
    <div className={`rounded-lg border ${theme.box} p-4`}>
      <div className={`flex items-center space-x-2 font-bold ${theme.head} mb-2`}>
        <FiAlertTriangle />
        <span>
          {title} ({errors.length})
        </span>
      </div>

      <ul className="max-h-72 overflow-y-auto space-y-2 pr-1">
        {errors.map((err, i) => (
          <li key={`${err.row}-${i}`} className={`bg-white rounded border ${theme.item} p-2 text-sm`}>
            <div className="font-semibold text-gray-800">
              {err.row ? `Excel Row ${err.row}` : "File"}
              {err.row ? ` | S.No ${err.sno ?? "—"}` : ""}
              {err.status === "uncertain" && (
                <span className="ml-2 text-xs font-normal bg-amber-200 text-amber-900 rounded px-1">
                  may already be saved
                </span>
              )}
            </div>
            <div className="text-gray-700">{err.message}</div>
          </li>
        ))}
      </ul>

      {footer && <div className="mt-3">{footer}</div>}
    </div>
  );
};

export default BulkUploadErrors;