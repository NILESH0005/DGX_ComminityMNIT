import React from "react";

const Stat = ({ label, value, className }) => (
  <div className={`rounded border px-3 py-2 text-center ${className}`}>
    <div className="text-lg font-bold">{value}</div>
    <div className="text-xs">{label}</div>
  </div>
);

/**
 * current/total: position in the CURRENT run (first submit or retry)
 * summary: counts across ALL rows of the file ({ total, success, duplicate, failed, uncertain })
 */
const BulkUploadProgress = ({ isRunning, current, total, summary, runLabel = "Uploading" }) => {
  const percent = total ? Math.round(((isRunning ? current - 1 : current) / total) * 100) : 0;

  return (
    <div className="rounded-lg border border-gray-200 p-4 space-y-3">
      <div className="flex justify-between text-sm font-medium text-gray-700">
        <span>
          {isRunning ? `${runLabel} Question ${current} of ${total}` : `Finished ${total} of ${total}`}
        </span>
        <span>{isRunning ? percent : 100}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 transition-all duration-300 ${isRunning ? "bg-blue-500" : "bg-green-500"}`}
          style={{ width: `${isRunning ? percent : 100}%` }}
        />
      </div>

      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Stat label="Total" value={summary.total} className="border-gray-200 text-gray-800" />
          <Stat label="Successful" value={summary.success} className="border-green-200 bg-green-50 text-green-700" />
          <Stat
            label="Already existed"
            value={summary.duplicate}
            className="border-blue-200 bg-blue-50 text-blue-700"
          />
          <Stat
            label="Failed"
            value={summary.failed + summary.uncertain}
            className="border-red-200 bg-red-50 text-red-700"
          />
        </div>
      )}
    </div>
  );
};

export default BulkUploadProgress;