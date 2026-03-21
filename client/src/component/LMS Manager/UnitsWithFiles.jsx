import React, { useState, useEffect, useContext, useRef } from "react";
import PropTypes from "prop-types";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import ApiContext from "../../context/ApiContext";
import FileViewer from "../../utils/FileViewer";
import Quiz from "../quiz/Quiz";
import Swal from "sweetalert2";
import {
  FiFileText,
  FiFolder,
  FiX,
  FiMenu,
  FiBook,
  FiArrowLeft,
  FiChevronRight,
  FiChevronDown,
  FiExternalLink,
  FiPlay,
  FiAward,
  FiClock,
  FiCheckCircle,
  FiBarChart2,
} from "react-icons/fi";
import FetchQuizQuestions from "../quiz/DemoQuiz";
import UnitQueryPanel from "./UnitQueryPanel";
import YoutubeProgressPlayer from "./YoutubeProgressPlayer";
import LMSContentSidebar from "./LMSContentSidebar";
import Badges from "./Badges";

const UnitsWithFiles = () => {
  const { subModuleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [allUnits, setAllUnits] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchData, userToken, user } = useContext(ApiContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [viewedFiles, setViewedFiles] = useState(new Set());
  const [completedFiles, setCompletedFiles] = useState(new Set()); // only completed
  const [userFileIds, setUserFileIds] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [moduleName, setModuleName] = useState("");
  const [subModuleName, setSubModuleName] = useState("");
  const [expandedDescriptions, setExpandedDescriptions] = useState(new Set());
  const [expandedUnits, setExpandedUnits] = useState(new Set());
  const currentFileIdRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showBadges, setShowBadges] = useState(false);
  const [completedFileId, setCompletedFileId] = useState(null);

  // ── Track whether we've already auto-selected the initial file ────────────
  // We need both units AND completedFiles loaded before we can decide.
  // This ref prevents double-firing if either effect re-runs.
  const autoPlayDoneRef = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile && (selectedFile || selectedQuiz)) {
        setIsSidebarCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedFile, selectedQuiz]);

  useEffect(() => {
    const moduleName =
      location.state?.moduleName || localStorage.getItem("moduleName");
    const submoduleName =
      location.state?.submoduleName || localStorage.getItem("submoduleName");

    if (moduleName) setModuleName(moduleName);
    if (submoduleName) setSubModuleName(submoduleName);

    if (!subModuleId) {
      const storedSubModuleId = localStorage.getItem("subModuleId");
      if (storedSubModuleId) {
        navigate(`/submodule/${storedSubModuleId}`, {
          replace: true,
          state: {
            moduleName,
            submoduleName,
            moduleId: localStorage.getItem("moduleId"),
          },
        });
      }
    }
  }, [location.state, subModuleId, navigate]);

  useEffect(() => {
    const fetchUserFileIds = async () => {
      try {
        if (!userToken) {
          console.log("No user token available, skipping file IDs fetch");
          return;
        }

        const response = await fetchData(
          "progressTrack/getUserFileIDs",
          "POST",
          {},
          {
            "Content-Type": "application/json",
            "auth-token": userToken,
          },
        );

        if (response?.success) {
          const fileIds = response.data.fileIds
            .filter((f) => f.IsCompleted) // only truly completed
            .map((f) => f.FileID);
          setCompletedFiles(new Set(fileIds));
          setViewedFiles(new Set(fileIds));
          setUserFileIds(response.data.fileIds);
        } else {
          console.error("Failed to fetch user file IDs:", response?.message);
        }
      } catch (error) {
        console.error("Error fetching user's file IDs:", error);
      }
    };

    if (userToken) {
      fetchUserFileIds();
    }
  }, [userToken, fetchData]);

  useEffect(() => {
    const fetchDataForSubmodule = async () => {
      try {
        setLoading(true);
        setError(null);
        const unitsResponse = await fetchData(
          `dropdown/getUnitsWithFiles/${subModuleId}`,
          "GET",
          {},
          {
            "Content-Type": "application/json",
            "auth-token": userToken,
          },
        );
        console.log("rrrrrrrrrrrrrr", unitsResponse);

        const quizzesResponse = await fetchData(
          "quiz/getQuizzesByRefId",
          "POST",
          { refId: subModuleId },
          {
            "Content-Type": "application/json",
            "auth-token": userToken,
          },
        );

        console.log("reessspoonnseee", quizzesResponse);

        if (unitsResponse?.success) {
          const unitsWithTotalTime = unitsResponse.data.map((unit) => {
            const files = (unit.FilesDetails || []).map((file) => {
              const totalTimeSpent =
                file.UserLmsProgresses?.reduce(
                  (acc, progress) => acc + (progress.TimeSpentSeconds || 0),
                  0,
                ) || 0;

              return {
                ...file,
                totalTimeSpent,
              };
            });

            return {
              ...unit,
              files,
            };
          });

          setAllUnits(unitsWithTotalTime);

          const filtered = unitsWithTotalTime.filter(
            (unit) => String(unit.SubModuleID) === String(subModuleId),
          );
          setFilteredUnits(filtered);

          // Auto-expand first unit on load
          if (filtered.length > 0) {
            setExpandedUnits(new Set([filtered[0].UnitID]));
          }
        }

        if (quizzesResponse?.success) {
          const transformedQuizzes = quizzesResponse.data
            .map((quiz) => ({
              ...quiz,
              group_id: quiz.QuizGroupID,
            }))
            .sort((a, b) => a.QuizLevel - b.QuizLevel);
          setQuizzes(transformedQuizzes);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    if (subModuleId) {
      fetchDataForSubmodule();
    }
  }, [subModuleId, fetchData, userToken]);

  // ─────────────────────────────────────────────────────────────────────────
  // AUTO-PLAY: once both filteredUnits and completedFiles are ready,
  // find the first YouTube file (by unit sort order → file sort order)
  // whose FileID is NOT in completedFiles, and auto-select it.
  //
  // Rules:
  //   1. Sort units by UnitSortingOrder, files within each unit by FileSortingOrder.
  //   2. Walk through every file in order.
  //   3. The first file where IsCompleted is false (not in completedFiles) is
  //      auto-selected and its unit is expanded.
  //   4. If ALL files are completed, auto-select the very last file so the
  //      user can replay.
  //   5. We only do this once per page load (autoPlayDoneRef).
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (autoPlayDoneRef.current) return;       // already ran
    if (loading) return;                       // units not ready yet
    if (filteredUnits.length === 0) return;    // no units

    // completedFiles starts as empty Set; if userToken exists we wait for it
    // to be populated before we decide — but we proceed immediately when
    // there's no token (guest users).
    // We detect "still loading completedFiles" by checking userToken + loading.
    // Since fetchUserFileIds runs independently, we can't know if it's done.
    // Solution: we wait until userFileIds array has been set OR userToken is absent.
    const hasToken = !!userToken;
    if (hasToken && userFileIds.length === 0 && completedFiles.size === 0) {
      // completedFiles haven't loaded yet — don't auto-play yet
      return;
    }

    autoPlayDoneRef.current = true;

    const sortedUnits = [...filteredUnits].sort(
      (a, b) => a.UnitSortingOrder - b.UnitSortingOrder,
    );

    let firstIncompleteFile = null;
    let firstIncompleteUnit = null;
    let lastFile = null;
    let lastUnit = null;

    outer: for (const unit of sortedUnits) {
      const sortedFiles = [...(unit.files || [])].sort(
        (a, b) => a.FileSortingOrder - b.FileSortingOrder,
      );

      for (const file of sortedFiles) {
        lastFile = file;
        lastUnit = unit;

        if (!completedFiles.has(file.FileID)) {
          firstIncompleteFile = file;
          firstIncompleteUnit = unit;
          break outer;
        }
      }
    }

    const fileToPlay = firstIncompleteFile || lastFile;
    const unitToExpand = firstIncompleteUnit || lastUnit;

    if (!fileToPlay || !unitToExpand) return;

    // Expand the unit that contains the file to play
    setExpandedUnits((prev) => {
      const next = new Set(prev);
      next.add(unitToExpand.UnitID);
      return next;
    });

    // Auto-select the file (mirrors handleFileSelect without re-recording view
    // since the user hasn't clicked yet — we just pre-load it)
    setSelectedFile({
      ...fileToPlay,
      unitName: unitToExpand.UnitName,
      unitDescription: unitToExpand.UnitDescription,
      UnitID: unitToExpand.UnitID,
      creatorId: unitToExpand.creatorId,
    });
    currentFileIdRef.current = fileToPlay.FileID;
    recordFileView(fileToPlay.FileID, unitToExpand.UnitID);

    if (isMobile) {
      setIsSidebarCollapsed(true);
    }
  }, [filteredUnits, completedFiles, userFileIds, loading, userToken]);

  // ─────────────────────────────────────────────────────────────────────────

  const handleVideoComplete = (fileId) => {
    // Step 1: mark as completed in local state
    setCompletedFiles((prev) => {
      const updated = new Set(prev);
      updated.add(fileId);
      return updated;
    });

    setFilteredUnits((prevUnits) => {
      let nextFileToPlay = null;
      let nextUnitToExpand = null;

      const sortedUnits = [...prevUnits].sort(
        (a, b) => a.UnitSortingOrder - b.UnitSortingOrder,
      );

      const updatedUnits = sortedUnits.map((unit, unitIndex) => {
        const sortedFiles = [...(unit.files || [])].sort(
          (a, b) => a.FileSortingOrder - b.FileSortingOrder,
        );

        const updatedFiles = sortedFiles.map((file, fileIndex) => {
          if (file.FileID === fileId) {
            // CASE 1: Next file in SAME unit
            if (sortedFiles[fileIndex + 1]) {
              nextFileToPlay = {
                ...sortedFiles[fileIndex + 1],
                unitName: unit.UnitName,
                UnitID: unit.UnitID,
              };
            } else {
              // CASE 2: Move to NEXT UNIT
              const nextUnit = sortedUnits[unitIndex + 1];

              if (nextUnit && nextUnit.files?.length) {
                const sortedNextFiles = [...nextUnit.files].sort(
                  (a, b) => a.FileSortingOrder - b.FileSortingOrder,
                );

                nextFileToPlay = {
                  ...sortedNextFiles[0],
                  unitName: nextUnit.UnitName,
                  UnitID: nextUnit.UnitID,
                };

                nextUnitToExpand = nextUnit.UnitID;
              }
            }

            return { ...file, videoCompleted: true };
          }

          return file;
        });

        return { ...unit, files: updatedFiles };
      });

      // Expand next unit
      if (nextUnitToExpand) {
        setExpandedUnits((prev) => {
          const updated = new Set(prev);
          updated.add(nextUnitToExpand);
          return updated;
        });
      }

      // Auto-play next file
      if (nextFileToPlay) {
        setSelectedFile(nextFileToPlay);
        currentFileIdRef.current = nextFileToPlay.FileID;
        recordFileView(nextFileToPlay.FileID, nextFileToPlay.UnitID);

        if (isMobile) {
          setIsSidebarCollapsed(true);
        }
      }

      // Show badges
      setCompletedFileId(fileId);
      setShowBadges(true);

      return updatedUnits;
    });
  };

  const sendFileViewEndTime = async (fileId) => {
    if (!fileId || !userToken) return;

    try {
      await fetchData(
        "lmsEdit/updateFileViewEndTime",
        "POST",
        { FileID: fileId },
        {
          "Content-Type": "application/json",
          "auth-token": userToken,
        },
      );
    } catch (error) {
      console.error("Error sending file view end time:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (currentFileIdRef.current) {
        sendFileViewEndTime(currentFileIdRef.current);
      }
    };
  }, []);

  const recordFileView = async (fileId, unitId) => {
    try {
      if (currentFileIdRef.current && currentFileIdRef.current !== fileId) {
        await sendFileViewEndTime(currentFileIdRef.current);
      }

      const response = await fetchData(
        "lmsEdit/recordFileView",
        "POST",
        { FileID: fileId },
        {
          "Content-Type": "application/json",
          "auth-token": userToken,
        },
      );

      if (response?.success) {
        if (response.message !== "File view already recorded for this user") {
        }
        currentFileIdRef.current = fileId;
      } else {
        console.error("Error recording file view:", response?.message);
      }
    } catch (error) {
      console.error("Error recording file view:", error);
    }
  };

  const handleFileSelect = (file, unit) => {
    if (currentFileIdRef.current) {
      sendFileViewEndTime(currentFileIdRef.current);
    }

    currentFileIdRef.current = file.FileID;
    setSelectedQuiz(null);
    setSelectedFile(() => ({
      ...file,
      unitName: unit.UnitName,
      unitDescription: unit.UnitDescription,
      UnitID: unit.UnitID,
      creatorId: unit.creatorId,
    }));

    if (isMobile) {
      setIsSidebarCollapsed(true);
    }

    recordFileView(file.FileID, unit.UnitID);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleUnitExpansion = (unitId) => {
    setExpandedUnits((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(unitId)) {
        newSet.delete(unitId);
      } else {
        newSet.add(unitId);
      }
      return newSet;
    });
  };

  const handleBackToSubmodules = () => {
    if (currentFileIdRef.current) {
      sendFileViewEndTime(currentFileIdRef.current);
      currentFileIdRef.current = null;
    }

    const moduleId = localStorage.getItem("moduleId");
    const moduleName = localStorage.getItem("moduleName");

    if (moduleId && moduleName) {
      navigate(`/module/${moduleId}`, {
        state: { moduleName, moduleId },
      });
    } else {
      navigate(-1);
    }
  };

  const needsReadMore = (text) => {
    if (!text) return false;
    return text.split(" ").length > 10;
  };

  const getTruncatedText = (text, wordLimit = 10) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  const toggleDescription = (id) => {
    setExpandedDescriptions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case "pdf":
        return <FiFileText className="w-4 h-4 text-red-500" />;
      case "ipynb":
        return <FiBook className="w-4 h-4 text-orange-500" />;
      case "docx":
        return <FiFileText className="w-4 h-4 text-blue-500" />;
      default:
        return <FiFileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const isExternalLink = (file) => {
    if (
      file.FilePath &&
      (file.FilePath.includes("youtube.com") ||
        file.FilePath.includes("youtu.be"))
    ) {
      return false;
    }

    return (
      file.FileType === "link" ||
      (file.FilePath &&
        (file.FilePath.startsWith("http://") ||
          file.FilePath.startsWith("https://")))
    );
  };

  const removeFileExtension = (filename) => {
    return filename.replace(/\.[^/.]+$/, "");
  };

  if (!subModuleId) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen p-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-8 max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiFolder className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            No Submodule Selected
          </h2>
          <p className="text-gray-600 mb-4">
            Please select a submodule from the menu to view its units and files.
          </p>
        </div>
      </div>
    );
  }

  const handleQuizSelect = (quiz) => {
    if (isMobile) {
      setIsSidebarCollapsed(true);
    }

    navigate(`/quiz/${quiz.QuizID}`, {
      state: {
        quiz: {
          ...quiz,
          group_id: 2,
          QuizID: quiz.QuizID,
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-foreground">
        <div
          className={`${
            isSidebarCollapsed ? "w-20" : "w-80"
          } bg-white border-r border-gray-200 p-4 transition-all duration-300 hidden md:block shadow-lg`}
        >
          <div className="h-8 bg-gray-200 rounded-lg w-3/4 mb-4 animate-pulse"></div>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-200 rounded-xl mb-4 animate-pulse"
            ></div>
          ))}
        </div>
        <div className="flex-1 p-6 w-full">
          <div className="h-8 bg-gray-200 rounded-lg w-1/2 mb-4 animate-pulse"></div>
          <div className="h-full bg-gray-200 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen p-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-8 max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiX className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (filteredUnits.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen p-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-8 max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiFolder className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            No Units Found
          </h2>
          <p className="text-gray-600">
            There are no units available for the selected submodule.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-foreground">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
        <button
          onClick={handleBackToSubmodules}
          className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl transition-all duration-200"
        >
          <FiArrowLeft className="text-gray-700" />
          <span className="font-medium text-gray-700">Back</span>
        </button>

        <h1 className="text-lg font-bold text-gray-800 truncate max-w-[200px]">
          {subModuleName || "Submodule Content"}
        </h1>

        <button
          onClick={toggleSidebar}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-2 hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isSidebarCollapsed ? (
            <FiMenu className="w-5 h-5" />
          ) : (
            <FiX className="w-5 h-5" />
          )}
        </button>
      </div>

      <LMSContentSidebar
        filteredUnits={filteredUnits}
        completedFiles={completedFiles}
        quizzes={quizzes}
        expandedUnits={expandedUnits}
        expandedDescriptions={expandedDescriptions}
        viewedFiles={viewedFiles}
        selectedFile={selectedFile}
        isSidebarCollapsed={isSidebarCollapsed}
        isMobile={isMobile}
        toggleSidebar={toggleSidebar}
        toggleUnitExpansion={toggleUnitExpansion}
        toggleDescription={toggleDescription}
        handleFileSelect={handleFileSelect}
        handleQuizSelect={handleQuizSelect}
        needsReadMore={needsReadMore}
        getTruncatedText={getTruncatedText}
        removeFileExtension={removeFileExtension}
        getFileIcon={getFileIcon}
        subModuleName={subModuleName}
      />
      <div
        className={`flex-1 flex flex-col min-h-0 p-4 md:p-6 ${
          isMobile && !isSidebarCollapsed ? "hidden" : "flex"
        }`}
      >
        {/* Content Header */}

        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <button
                onClick={handleBackToSubmodules}
                className="hidden md:inline-flex items-center space-x-1 px-2 py-1 text-sm rounded-md border border-gray-200 bg-white
  hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 group"
                aria-label="Go back"
              >
                <FiArrowLeft className="w-4 h-4 text-gray-600 group-hover:-translate-x-1 transition-transform duration-150" />
                <span className="text-gray-600 group-hover:text-blue-600">
                  Back
                </span>
              </button>
            </div>
            {selectedFile && (
              <div className="flex items-center space-x-2 text-gray-600">
                <FiFolder className="w-4 h-4 text-yellow-500" />
                <span className="text-sm md:text-base">
                  Unit: {selectedFile.unitName || "Current Unit"}
                </span>
              </div>
            )}
          </div>
        </div>
        <hr className="my-2 border-gray-200" />

        {/* Content Area */}
        {selectedQuiz ? (
          <div className="flex-1 overflow-auto">
            <div className="mb-2">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 break-words mb-2">
                  {selectedQuiz.QuizName}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm md:text-base">
                  <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                    <FiClock className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-700">
                      Duration: {selectedQuiz.QuizDuration} minutes
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                    <FiAward className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-700">
                      Passing Score: {selectedQuiz.PassingPercentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Quiz
              quizz={{
                ...selectedQuiz,
                QuizID: selectedQuiz.QuizID,
                group_id: selectedQuiz.group_id || selectedQuiz.QuizGroupID,
                title: selectedQuiz.QuizName,
                duration: selectedQuiz.QuizDuration,
                passingPercentage: selectedQuiz.PassingPercentage,
              }}
              onQuizComplete={() => {
                setSelectedQuiz(null);
                Swal.fire({
                  title: "Quiz Completed!",
                  icon: "success",
                  confirmButtonText: "OK",
                });
              }}
            />
          </div>
        ) : selectedFile ? (
          <>
            {console.log("Module ID:", localStorage.getItem("moduleId"))}
            {console.log("SubModule ID:", subModuleId)}
            {console.log("Selected File:", selectedFile)}
            {console.log("Unit ID:", selectedFile?.UnitID)}
            {console.log("File ID:", selectedFile?.FileID)}
            {console.log("CREATOR ID:", selectedFile?.FileAuthAdd)}

            <div className="mb-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-base md:text-lg font-semibold text-gray-800 truncate">
                    {removeFileExtension(selectedFile.FilesName)}
                  </h2>
                </div>

                {selectedFile.Description && (
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {selectedFile.Description}
                  </p>
                )}
              </div>
            </div>

            {isExternalLink(selectedFile) &&
            !selectedFile.FilePath.includes("youtube.com") &&
            !selectedFile.FilePath.includes("youtu.be") ? (
              <div className="flex flex-col items-center justify-center h-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 min-h-[400px]">
                <div className="max-w-md w-full text-center">
                  <div className="mb-4">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <FiExternalLink className="w-10 h-10 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 break-words">
                    {selectedFile.FilesName || "External Content Link"}
                  </h3>
                  <p className=" text-gray-600 text-sm md:text-base leading-relaxed">
                    {selectedFile.Description ||
                      "This content is hosted externally. Click the button below to view it in a new tab."}
                  </p>
                  <a
                    href={selectedFile.FilePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <FiExternalLink className="w-5 h-5" />
                    <span>Open External Link</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4">
                {" "}
                {/* File Viewer Container */}
                <div className="relative flex flex-col w-full lg:flex-[3] min-h-[250px] lg:min-h-0">
                  {" "}
                  <div
                    className={`relative flex-1 w-full ${
                      selectedFile?.fileType === "ipynb" ? "bg-[#f8f9fa]" : ""
                    }`}
                  >
                    {selectedFile?.fileType === "ipynb" && (
                      <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-r from-gray-800 to-gray-900 flex items-center px-6 z-10">
                        <div className="flex space-x-2 mr-4">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="text-sm text-gray-300 font-medium truncate">
                          {removeFileExtension(selectedFile.FilesName)}.ipynb
                        </div>
                      </div>
                    )}

                    <div
                      className={`flex-1 min-h-0 ${
                        selectedFile?.FilePath?.includes("youtube.com") ||
                        selectedFile?.FilePath?.includes("youtu.be")
                          ? ""
                          : "overflow-y-auto"
                      } ${selectedFile?.FileType === "ipynb" ? "pt-10" : ""}`}
                    >
                      {selectedFile.FilePath.includes("youtube.com") ||
                      selectedFile.FilePath.includes("youtu.be") ? (
                        <YoutubeProgressPlayer
                          key={selectedFile.FileID}
                          youtubeUrl={selectedFile.FilePath}
                          userId={user.UserID}
                          fileId={selectedFile.FileID}
                          onVideoComplete={handleVideoComplete}
                        />
                      ) : (
                        <FileViewer
                          fileUrl={`${import.meta.env.VITE_API_BASEURL.replace(
                            /\/$/,
                            "",
                          )}/${selectedFile?.FilePath.replace(/^\//, "")}`}
                        />
                      )}

                      {/* Add Badges here */}
                      {showBadges && completedFileId && (
                        <Badges
                          user={user}
                          fetchData={fetchData}
                          onClose={() => setShowBadges(false)}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-full lg:flex-[1] lg:min-w-[300px] lg:max-w-[400px] bg-white border border-gray-200 rounded-xl overflow-y-auto max-h-[300px] lg:max-h-none">
                  {" "}
                  <UnitQueryPanel
                    moduleId={localStorage.getItem("moduleId")}
                    subModuleId={subModuleId}
                    unitId={selectedFile?.UnitID}
                    fileId={selectedFile?.FileID}
                    creatorId={selectedFile?.FileAuthAdd}
                  />
                </div>
                {/* Resizable Handle */}
                <div className="h-2 bg-gray-100 border-t border-b border-gray-200 cursor-ns-resize hover:bg-gray-200 transition-colors flex items-center justify-center flex-shrink-0">
                  <div className="w-20 h-1 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="text-center p-8 max-w-md w-full">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiFileText className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Select Content to Begin
              </h2>
              <p className="text-gray-600">
                Choose a file from the sidebar to start learning. Your progress
                will be automatically saved.
              </p>
              {isMobile && (
                <button
                  onClick={() => setIsSidebarCollapsed(false)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 md:hidden"
                >
                  Show Content List
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

UnitsWithFiles.propTypes = {
  subModuleId: PropTypes.string.isRequired,
};

export default UnitsWithFiles;