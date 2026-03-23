import React from "react";
import {
  FiFolder,
  FiChevronDown,
  FiCheckCircle,
  FiClock,
  FiAward,
  FiBarChart2,
  FiPlay,
  FiX,
  FiLock,
  FiMenu,
} from "react-icons/fi";

const LMSContentSidebar = ({
  filteredUnits,
  completedFiles,        // ← Set of completed FileIDs from parent state
  quizzes,
  expandedUnits,
  expandedDescriptions,
  viewedFiles,
  selectedFile,
  isSidebarCollapsed,
  isMobile,
  toggleSidebar,
  toggleUnitExpansion,
  toggleDescription,
  handleFileSelect,
  handleQuizSelect,
  needsReadMore,
  getTruncatedText,
  removeFileExtension,
  getFileIcon,
  subModuleName,
  isFileLocked,          // ← Locking logic owned by parent (UnitsWithFiles)
}) => {
  // ── Unit-level lock: every file in the previous unit must be completed ────
  const isUnitLocked = (unit) => {
    const sorted = [...filteredUnits].sort(
      (a, b) => a.UnitSortingOrder - b.UnitSortingOrder,
    );
    const index = sorted.findIndex((u) => u.UnitID === unit.UnitID);
    if (index === 0) return false;

    const prevUnit = sorted[index - 1];
    if (!prevUnit?.files?.length) return false;

    return !prevUnit.files.every(
      (f) => f.videoCompleted === true || completedFiles?.has(f.FileID),
    );
  };

  return (
    <>
      <div
        className={`${
          isSidebarCollapsed ? "w-20" : "w-full md:w-80"
        } bg-white border-r border-gray-200 overflow-y-auto transition-all duration-300 ease-in-out relative flex flex-col shadow-lg ${
          isMobile && isSidebarCollapsed ? "hidden" : "flex"
        } ${isMobile ? "h-1/2 md:h-full" : "h-full"}`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-800 truncate">
                  {subModuleName || "Content"}
                </h2>
                <p className="text-sm text-gray-600 truncate">
                  {filteredUnits.length} units • {quizzes.length} quizzes
                </p>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="bg-white border border-gray-300 text-gray-700 rounded-lg p-2 hover:bg-gray-50 transition-all duration-200 shadow-sm hidden md:flex"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarCollapsed ? (
                <FiMenu className="w-4 h-4" />
              ) : (
                <FiX className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {[...filteredUnits]
              .sort((a, b) => a.UnitSortingOrder - b.UnitSortingOrder)
              .map((unit) => {
                const unitLocked = isUnitLocked(unit);
                const isUnitExpanded = expandedUnits.has(unit.UnitID);
                const hasFiles = unit.files?.length > 0;

                const sortedFiles = [...(unit.files || [])].sort(
                  (a, b) => a.FileSortingOrder - b.FileSortingOrder,
                );

                // Unit is fully complete when every file is done
                const unitCompleted =
                  sortedFiles.length > 0 &&
                  sortedFiles.every(
                    (f) =>
                      f.videoCompleted === true || completedFiles?.has(f.FileID),
                  );

                return (
                  <div
                    key={unit.UnitID}
                    className={`bg-white rounded-xl border shadow-sm transition-all duration-200 overflow-hidden ${
                      unitLocked
                        ? "opacity-50 cursor-not-allowed border-gray-200"
                        : unitCompleted
                        ? "border-green-200 hover:shadow-md"
                        : "border-gray-200 hover:shadow-md"
                    }`}
                  >
                    {/* Unit Header */}
                    <div
                      className={`p-4 transition-colors duration-200 ${
                        unitLocked
                          ? "cursor-not-allowed"
                          : "cursor-pointer hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        if (unitLocked) return;
                        toggleUnitExpansion(unit.UnitID);
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        {/* Unit icon */}
                        <div
                          className={`p-2 rounded-lg ${
                            unitCompleted
                              ? "bg-gradient-to-br from-green-400 to-green-500"
                              : "bg-gradient-to-br from-yellow-500 to-yellow-600"
                          }`}
                        >
                          {unitCompleted ? (
                            <FiCheckCircle className="w-4 h-4 text-white" />
                          ) : (
                            <FiFolder className="w-4 h-4 text-white" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {unitLocked && (
                              <FiLock className="text-gray-400 w-4 h-4 flex-shrink-0" />
                            )}
                            <h3
                              className={`font-semibold truncate ${
                                unitLocked ? "text-gray-400" : "text-gray-800"
                              }`}
                            >
                              {unit.UnitName}
                            </h3>
                            {unitCompleted && (
                              <span className="flex-shrink-0 text-[10px] font-semibold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">
                                Done
                              </span>
                            )}
                          </div>

                          {unit.UnitDescription && (
                            <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                              {needsReadMore(unit.UnitDescription)
                                ? expandedDescriptions.has(`unit-${unit.UnitID}`)
                                  ? unit.UnitDescription
                                  : getTruncatedText(unit.UnitDescription)
                                : unit.UnitDescription}
                            </p>
                          )}
                        </div>

                        {/* Chevron */}
                        {!unitLocked && hasFiles && (
                          <FiChevronDown
                            className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                              isUnitExpanded ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </div>

                    {/* FILES */}
                    {hasFiles && isUnitExpanded && !unitLocked && (
                      <div className="border-t border-gray-100 bg-gray-50/50">
                        {sortedFiles.map((file) => {
                          // ── Use parent's isFileLocked — respects videoCompleted ──
                          const locked = isFileLocked(file);
                          // A file is "done" if the API says so OR local state confirms it
                          const done =
                            file.videoCompleted === true ||
                            completedFiles?.has(file.FileID);
                          const isSelected = selectedFile?.FileID === file.FileID;

                          return (
                            <div
                              key={file.FileID}
                              title={
                                locked
                                  ? "Complete the previous file to unlock"
                                  : file.FilesName
                              }
                              className={[
                                "flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150 select-none",
                                locked
                                  ? "opacity-50 cursor-not-allowed bg-gray-50"
                                  : isSelected
                                  ? "bg-blue-50 border-l-4 border-blue-500 cursor-pointer"
                                  : "hover:bg-white border-l-4 border-transparent cursor-pointer",
                              ].join(" ")}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (locked) return;
                                handleFileSelect(file, unit);
                              }}
                            >
                              {/* Left icon: lock / check / file-type */}
                              <span className="flex-shrink-0">
                                {locked ? (
                                  <FiLock className="w-4 h-4 text-gray-400" />
                                ) : done ? (
                                  <FiCheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  getFileIcon(file.FileType)
                                )}
                              </span>

                              {/* File name */}
                              <span
                                className={[
                                  "flex-1 truncate font-medium",
                                  locked
                                    ? "text-gray-400"
                                    : done
                                    ? "text-green-700"
                                    : isSelected
                                    ? "text-blue-700"
                                    : "text-gray-700",
                                ].join(" ")}
                              >
                                {removeFileExtension(file.FilesName)}
                              </span>

                              {/* Right status badge */}
                              {done && !locked && (
                                <span className="flex-shrink-0 text-[10px] font-semibold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">
                                  Done
                                </span>
                              )}
                              {locked && (
                                <span className="flex-shrink-0 text-[10px] font-semibold text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded-full">
                                  Locked
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          {/* Quizzes Section */}
          {quizzes.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center space-x-2 mb-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                  <FiAward className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-800">Assessments</h3>
              </div>
              <div className="space-y-2">
                {quizzes.map((quiz) => (
                  <div
                    key={quiz.QuizID}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer group hover:border-purple-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuizSelect(quiz);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                          <FiBarChart2 className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-gray-800 truncate">
                            {quiz.QuizName}
                          </h4>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                              {quiz.QuizDuration} min
                            </span>
                            <span className="text-xs text-gray-600">
                              {quiz.PassingPercentage}% to pass
                            </span>
                          </div>
                        </div>
                      </div>
                      <FiPlay className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LMSContentSidebar;