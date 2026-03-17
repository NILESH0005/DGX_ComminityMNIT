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
}) => {
  const isFileLocked = (files, file) => {
    const sorted = [...files].sort(
      (a, b) => a.FileSortingOrder - b.FileSortingOrder,
    );

    const index = sorted.findIndex((f) => f.FileID === file.FileID);

    if (index === 0) return false;

    const prevFile = sorted[index - 1];

    return !prevFile?.videoCompleted;
  };
  const isUnitLocked = (units, unit) => {
    const sorted = [...units].sort(
      (a, b) => a.UnitSortingOrder - b.UnitSortingOrder,
    );

    const index = sorted.findIndex((u) => u.UnitID === unit.UnitID);

    if (index === 0) return false;

    const prevUnit = sorted[index - 1];

    if (!prevUnit?.files?.length) return false;

    return !prevUnit.files.every((f) => f.videoCompleted);
  };

  const sortedUnits = [...filteredUnits].sort(
    (a, b) => a.UnitSortingOrder - b.UnitSortingOrder,
  );

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
          {/* Units Section */}
          {/* Units Section */}
          <div className="space-y-3">
            {[...filteredUnits]
              .sort((a, b) => a.UnitSortingOrder - b.UnitSortingOrder)
              .map((unit) => {
                const unitLocked = isUnitLocked(filteredUnits, unit);
                const needsReadMoreUnit = needsReadMore(unit.UnitDescription);
                const isExpanded = expandedDescriptions.has(
                  `unit-${unit.UnitID}`,
                );
                const isUnitExpanded = expandedUnits.has(unit.UnitID);
                const hasFiles = unit.files?.length > 0;

                const sortedFiles = [...(unit.files || [])].sort(
                  (a, b) => a.FileSortingOrder - b.FileSortingOrder,
                );

                return (
                  <div
                    key={unit.UnitID}
                    className={`bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-200 overflow-hidden ${
                      unitLocked
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:shadow-md"
                    }`}
                  >
                    {/* Unit Header */}
                    <div
                      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => {
                        if (unitLocked) return;
                        toggleUnitExpansion(unit.UnitID);
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg">
                          <FiFolder className="w-4 h-4 text-white" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {unitLocked && (
                              <FiLock className="text-gray-500 w-4 h-4" />
                            )}
                            <h3 className="font-semibold text-gray-800">
                              {unit.UnitName}
                            </h3>
                          </div>

                          {unit.UnitDescription && (
                            <p className="text-gray-600 text-sm mt-1">
                              {needsReadMoreUnit
                                ? isExpanded
                                  ? unit.UnitDescription
                                  : getTruncatedText(unit.UnitDescription)
                                : unit.UnitDescription}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* FILES */}
                    {hasFiles && isUnitExpanded && (
                      <div className="border-t border-gray-100 bg-gray-50/50">
                        {sortedFiles.map((file) => {
                          const locked = isFileLocked(sortedFiles, file);
                          const isViewed = viewedFiles.has(file.FileID);
                          const isSelected =
                            selectedFile?.FileID === file.FileID;

                          return (
                            <div
                              key={file.FileID}
                              className={`p-3 transition ${
                                locked ? "opacity-40 cursor-not-allowed" : ""
                              } ${
                                isSelected
                                  ? "bg-blue-50 border-l-4 border-blue-500"
                                  : "hover:bg-white"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (unitLocked || locked) return;
                                handleFileSelect(file, unit);
                              }}
                            >
                              <div className="flex items-center gap-3">
                                {locked ? (
                                  <FiLock className="text-gray-400" />
                                ) : (
                                  getFileIcon(file.FileType)
                                )}

                                <span className="text-sm font-medium">
                                  {removeFileExtension(file.FilesName)}
                                </span>

                                {isViewed && (
                                  <FiCheckCircle className="text-green-500 ml-auto" />
                                )}
                              </div>
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
      </div>{" "}
    </>
  );
};

export default LMSContentSidebar;
