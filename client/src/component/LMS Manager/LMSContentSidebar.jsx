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
          <div className="space-y-3">
            {filteredUnits.map((unit) => {
              const needsReadMoreUnit = needsReadMore(unit.UnitDescription);
              const isExpanded = expandedDescriptions.has(
                `unit-${unit.UnitID}`,
              );
              const isUnitExpanded = expandedUnits.has(unit.UnitID);
              const hasFiles = unit.files?.length > 0;

              return (
                <div
                  key={unit.UnitID}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  {/* Unit Header */}
                  {/* Expanded Sidebar: Full Unit Header */}
                  {!isSidebarCollapsed && (
                    <div
                      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => toggleUnitExpansion(unit.UnitID)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex-shrink-0 shadow-sm">
                          <FiFolder className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-800 leading-tight break-words">
                              {unit.UnitName}
                            </h3>
                            <FiChevronDown
                              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                                isUnitExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                          {unit.UnitDescription && (
                            <p className="text-gray-600 text-sm leading-relaxed break-words mt-1">
                              {needsReadMoreUnit ? (
                                <>
                                  {isExpanded
                                    ? unit.UnitDescription
                                    : getTruncatedText(unit.UnitDescription)}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleDescription(`unit-${unit.UnitID}`);
                                    }}
                                    className="ml-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                  >
                                    {isExpanded ? "Show less" : "Show more"}
                                  </button>
                                </>
                              ) : (
                                unit.UnitDescription
                              )}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {unit.files?.length || 0} files
                            </span>
                            {hasFiles && (
                              <span className="text-xs text-gray-500">
                                {Math.round(
                                  unit.files.reduce(
                                    (acc, file) =>
                                      acc + (file.EstimatedTime || 0),
                                    0,
                                  ),
                                )}{" "}
                                min total
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Collapsed Sidebar: Minimal Unit Header with Tooltip */}
                  {isSidebarCollapsed && (
                    <div
                      className="group p-2 flex flex-col items-center cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => toggleUnitExpansion(unit.UnitID)}
                    >
                      <div className="p-2 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-sm flex items-center justify-center">
                        <FiFolder className="w-5 h-5 text-white" />
                      </div>
                      {/* Only show unit name, truncate if long */}
                      <h3 className="mt-2 text-xs font-semibold text-gray-900 text-center truncate max-w-[60px]">
                        {unit.UnitName}
                      </h3>
                      {/* Tooltip with expanded info */}
                      <div className="hidden group-hover:flex flex-col absolute left-full top-0 ml-3 px-3 py-2 bg-white shadow-lg rounded-lg z-50 w-[220px]">
                        <div className="flex items-center space-x-2">
                          <FiFolder className="w-4 h-4 text-yellow-600" />
                          <span className="font-semibold text-gray-800">
                            {unit.UnitName}
                          </span>
                        </div>
                        {unit.UnitDescription && (
                          <p className="text-gray-600 text-xs mt-2">
                            {unit.UnitDescription.length > 80
                              ? unit.UnitDescription.slice(0, 80) + "..."
                              : unit.UnitDescription}
                          </p>
                        )}
                        <div className="flex items-center space-x-3 mt-2">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {unit.files?.length || 0} files
                          </span>
                          {hasFiles && (
                            <span className="text-xs text-gray-500">
                              {Math.round(
                                unit.files.reduce(
                                  (acc, file) =>
                                    acc + (file.EstimatedTime || 0),
                                  0,
                                ),
                              )}{" "}
                              min total
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Files List */}
                  {/* Expanded Sidebar: Detailed Files List */}
                  {hasFiles && isUnitExpanded && !isSidebarCollapsed && (
                    <div className="border-t border-gray-100 bg-gray-50/50">
                      {unit.files.map((file) => {
                        const isViewed = viewedFiles.has(file.FileID);
                        const isSelected = selectedFile?.FileID === file.FileID;
                        const timeSpent =
                          file.UserLmsProgresses?.[0]?.TimeSpentSeconds || 0;
                        const estimatedTime = file.EstimatedTime * 60;
                        const percentageSpent = Math.min(
                          (timeSpent / estimatedTime) * 100,
                          100,
                        );

                        return (
                          <div
                            key={file.FileID}
                            className={`group p-3 border-b border-gray-100 last:border-b-0 transition-all duration-200 ${
                              isSelected
                                ? "bg-blue-50 border-l-4 border-l-blue-500"
                                : "hover:bg-white border-l-4 border-l-transparent"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFileSelect(file, unit);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 min-w-0 flex-1">
                                <div
                                  className={`p-2 rounded-lg ${
                                    isSelected
                                      ? "bg-blue-100"
                                      : "bg-gray-100 group-hover:bg-white"
                                  } transition-colors`}
                                >
                                  {getFileIcon(file.FileType)}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center space-x-2">
                                    <span
                                      className={`font-medium text-sm truncate ${
                                        isSelected
                                          ? "text-blue-900"
                                          : "text-gray-800"
                                      }`}
                                    >
                                      {removeFileExtension(file.FilesName)}
                                    </span>
                                    {isViewed && (
                                      <FiCheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                                    )}
                                  </div>
                                  {file.Description && (
                                    <p className="text-xs text-gray-600 truncate mt-1">
                                      {file.Description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col items-end flex-shrink-0 ml-2">
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                  <FiClock className="w-3 h-3" />
                                  <span>
                                    {Math.floor(file.totalTimeSpent / 60)}m /{" "}
                                    {file.EstimatedTime}m
                                  </span>
                                </div>
                                <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
                                  <div
                                    className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                                    style={{
                                      width: `${Math.min(
                                        100,
                                        Math.floor(
                                          (file.totalTimeSpent /
                                            (file.EstimatedTime * 60)) *
                                            100,
                                        ),
                                      )}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Collapsed Sidebar: Icons + Tooltip */}
                  {hasFiles && isUnitExpanded && isSidebarCollapsed && (
                    <div className="flex flex-col items-center py-1 space-y-2">
                      {unit.files.map((file) => {
                        const isViewed = viewedFiles.has(file.FileID);
                        const isSelected = selectedFile?.FileID === file.FileID;
                        const timeSpent =
                          file.UserLmsProgresses?.[0]?.TimeSpentSeconds || 0;
                        const estimatedTime = file.EstimatedTime * 60;
                        const percentageSpent = Math.min(
                          (timeSpent / estimatedTime) * 100,
                          100,
                        );

                        return (
                          <div
                            key={file.FileID}
                            className={`group relative flex flex-col items-center cursor-pointer`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFileSelect(file, unit);
                            }}
                          >
                            {/* File Icon */}
                            <div
                              className={`p-2 rounded-full shadow-sm
              ${
                isSelected
                  ? "bg-blue-200"
                  : "bg-gray-200 group-hover:bg-yellow-100"
              }
              transition-colors`}
                            >
                              {getFileIcon(file.FileType)}
                            </div>
                            {/* Check icon if viewed */}
                            {isViewed && (
                              <FiCheckCircle className="absolute -top-1 -right-1 w-3 h-3 text-green-500" />
                            )}
                            {/* Tooltip with details */}
                            <div className="hidden group-hover:flex flex-col absolute left-full top-0 ml-3 px-3 py-2 bg-white shadow-lg rounded-lg z-50 w-[200px]">
                              <span className="font-semibold text-gray-800 truncate">
                                {removeFileExtension(file.FilesName)}
                              </span>
                              {file.Description && (
                                <p className="text-xs text-gray-600 mt-1 truncate">
                                  {file.Description.length > 60
                                    ? file.Description.slice(0, 60) + "..."
                                    : file.Description}
                                </p>
                              )}
                              <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                                <FiClock className="w-3 h-3" />
                                <span>{file.EstimatedTime} min</span>
                              </div>
                              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-2">
                                <div
                                  className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                                  style={{ width: `${percentageSpent}%` }}
                                ></div>
                              </div>
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
