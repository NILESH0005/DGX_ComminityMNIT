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
  FiLock,
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
  const [completedFiles, setCompletedFiles] = useState(new Set());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [moduleName, setModuleName] = useState("");
  const [subModuleName, setSubModuleName] = useState("");
  const [expandedDescriptions, setExpandedDescriptions] = useState(new Set());
  const [expandedUnits, setExpandedUnits] = useState(new Set());
  const currentFileIdRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showBadges, setShowBadges] = useState(false);
  const [completedFileId, setCompletedFileId] = useState(null);
  // Tracks whether the "Mark as Complete" action is in-flight for a file
  const [markingComplete, setMarkingComplete] = useState(false);

  const autoPlayDoneRef = useRef(false);

  // ── Resize listener ────────────────────────────────────────────────────────
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

  // ── Restore module/submodule names ─────────────────────────────────────────
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

  // ── SINGLE merged fetch: units + quizzes + user progress ──────────────────
  useEffect(() => {
    if (!subModuleId || !userToken) return;

    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);
        autoPlayDoneRef.current = false;

        const [unitsResponse, quizzesResponse, progressResponse] =
          await Promise.all([
            fetchData(
              `dropdown/getUnitsWithFiles/${subModuleId}`,
              "GET",
              {},
              { "Content-Type": "application/json", "auth-token": userToken },
            ),
            fetchData(
              "quiz/getQuizzesByRefId",
              "POST",
              { refId: subModuleId },
              { "Content-Type": "application/json", "auth-token": userToken },
            ),
            fetchData(
              "progressTrack/getUserFileIDs",
              "POST",
              {},
              { "Content-Type": "application/json", "auth-token": userToken },
            ),
          ]);

        // Build completed-file Set from the progress API
        let serverCompletedIds = new Set();
        if (progressResponse?.success) {
          const completedIds = progressResponse.data.fileIds
            .filter((f) => f.IsCompleted)
            .map((f) => f.FileID);
          serverCompletedIds = new Set(completedIds);
          setCompletedFiles(serverCompletedIds);
          setViewedFiles(new Set(completedIds));
        }

        if (unitsResponse?.success) {
          const unitsWithCompletion = unitsResponse.data.map((unit) => {
            const files = (unit.files || []).map((file) => {
              const totalTimeSpent =
                file.totalTimeSpent ??
                file.UserLmsProgresses?.reduce(
                  (acc, p) => acc + (p.TimeSpentSeconds || 0),
                  0,
                ) ??
                0;

              // Merge both sources — file is done if EITHER the API flag OR
              // the progress endpoint confirms it. This survives page reloads.
              const videoCompleted =
                file.videoCompleted === true ||
                serverCompletedIds.has(file.FileID);

              return { ...file, totalTimeSpent, videoCompleted };
            });

            return { ...unit, files };
          });

          setAllUnits(unitsWithCompletion);

          const filtered = unitsWithCompletion.filter(
            (unit) => String(unit.SubModuleID) === String(subModuleId),
          );
          setFilteredUnits(filtered);

          if (filtered.length > 0) {
            setExpandedUnits(new Set([filtered[0].UnitID]));
          }

          // Autoplay — runs here with fully-resolved data
          const sortedUnits = [...filtered].sort(
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
              if (!file.videoCompleted) {
                firstIncompleteFile = file;
                firstIncompleteUnit = unit;
                break outer;
              }
            }
          }

          const fileToPlay = firstIncompleteFile || lastFile;
          const unitToExpand = firstIncompleteUnit || lastUnit;

          if (fileToPlay && unitToExpand) {
            setExpandedUnits((prev) => {
              const next = new Set(prev);
              next.add(unitToExpand.UnitID);
              return next;
            });

            setSelectedFile({
              ...fileToPlay,
              unitName: unitToExpand.UnitName,
              unitDescription: unitToExpand.UnitDescription,
              UnitID: unitToExpand.UnitID,
              creatorId: unitToExpand.creatorId,
            });

            currentFileIdRef.current = fileToPlay.FileID;
            recordFileView(fileToPlay.FileID, unitToExpand.UnitID);

            if (isMobile) setIsSidebarCollapsed(true);
          }

          autoPlayDoneRef.current = true;
        }

        if (quizzesResponse?.success) {
          const transformedQuizzes = quizzesResponse.data
            .map((quiz) => ({ ...quiz, group_id: quiz.QuizGroupID }))
            .sort((a, b) => a.QuizLevel - b.QuizLevel);
          setQuizzes(transformedQuizzes);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [subModuleId, userToken]);

  // ── Shared completion logic (used by YouTube auto-complete AND manual button) ──
  // isManual = true  → called from "Mark as Complete" button (PDF / non-YouTube)
  // isManual = false → called automatically when YouTube player finishes
  const handleVideoComplete = async (fileId, isManual = false) => {
    try {
      setMarkingComplete(true);

      await fetchData(
        "video-progress/save",
        "POST",
        {
          UserID: user.UserID,
          FileID: fileId,
          CurrentTime: 9999,
          Duration: 9999,
        },
        { "Content-Type": "application/json", "auth-token": userToken },
      );

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
              if (sortedFiles[fileIndex + 1]) {
                nextFileToPlay = {
                  ...sortedFiles[fileIndex + 1],
                  unitName: unit.UnitName,
                  UnitID: unit.UnitID,
                };
              } else {
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

        if (nextUnitToExpand) {
          setExpandedUnits((prev) => {
            const updated = new Set(prev);
            updated.add(nextUnitToExpand);
            return updated;
          });
        }

        // For manual completion (PDF), also auto-advance to the next file
        if (isManual && nextFileToPlay) {
          setSelectedFile(nextFileToPlay);
          currentFileIdRef.current = nextFileToPlay.FileID;
          recordFileView(nextFileToPlay.FileID, nextFileToPlay.UnitID);
        } else if (!isManual && nextFileToPlay) {
          // YouTube auto-complete — same behaviour as before
          setSelectedFile(nextFileToPlay);
          currentFileIdRef.current = nextFileToPlay.FileID;
          recordFileView(nextFileToPlay.FileID, nextFileToPlay.UnitID);
        }

        setCompletedFileId(fileId);
        setShowBadges(true);

        return updatedUnits;
      });
    } catch (err) {
      console.error("Completion save failed", err);
    } finally {
      setMarkingComplete(false);
    }
  };

  // Convenience wrapper called from the "Mark as Complete" button in the viewer
  const handleMarkAsComplete = (fileId) => handleVideoComplete(fileId, true);

  // ── File view tracking ─────────────────────────────────────────────────────
  const sendFileViewEndTime = async (fileId) => {
    if (!fileId || !userToken) return;
    try {
      await fetchData(
        "lmsEdit/updateFileViewEndTime",
        "POST",
        { FileID: fileId },
        { "Content-Type": "application/json", "auth-token": userToken },
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
        { "Content-Type": "application/json", "auth-token": userToken },
      );
      if (response?.success) {
        currentFileIdRef.current = fileId;
      } else {
        console.error("Error recording file view:", response?.message);
      }
    } catch (error) {
      console.error("Error recording file view:", error);
    }
  };

  // ── Flat ordered file list ─────────────────────────────────────────────────
  const orderedFiles = filteredUnits
    .slice()
    .sort((a, b) => a.UnitSortingOrder - b.UnitSortingOrder)
    .flatMap((unit) =>
      (unit.files || [])
        .slice()
        .sort((a, b) => a.FileSortingOrder - b.FileSortingOrder)
        .map((file) => ({
          ...file,
          unitName: unit.UnitName,
          unitDescription: unit.UnitDescription,
          UnitID: unit.UnitID,
          creatorId: unit.creatorId,
        })),
    );

  // ── Locking logic ──────────────────────────────────────────────────────────
  const isFileLocked = (targetFile) => {
    if (targetFile.videoCompleted === true) return false;
    if (completedFiles.has(targetFile.FileID)) return false;

    for (const f of orderedFiles) {
      if (f.FileID === targetFile.FileID) return false;
      const fDone = f.videoCompleted === true || completedFiles.has(f.FileID);
      if (!fDone) return true;
    }
    return false;
  };

  // ── File select ────────────────────────────────────────────────────────────
  const handleFileSelect = (file, unit) => {
    if (isFileLocked(file)) return;

    if (currentFileIdRef.current) {
      sendFileViewEndTime(currentFileIdRef.current);
    }

    currentFileIdRef.current = file.FileID;
    setSelectedQuiz(null);
    setSelectedFile({
      ...file,
      unitName: unit.UnitName,
      unitDescription: unit.UnitDescription,
      UnitID: unit.UnitID,
      creatorId: unit.creatorId,
    });

    if (isMobile) setIsSidebarCollapsed(true);
    recordFileView(file.FileID, unit.UnitID);
  };

  // ── UI helpers ─────────────────────────────────────────────────────────────
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const toggleUnitExpansion = (unitId) => {
    setExpandedUnits((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(unitId)) newSet.delete(unitId);
      else newSet.add(unitId);
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
      navigate(`/module/${moduleId}`, { state: { moduleName, moduleId } });
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
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
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

  const isYouTube = (file) =>
    file?.FilePath?.includes("youtube.com") ||
    file?.FilePath?.includes("youtu.be");

  const removeFileExtension = (filename) => filename.replace(/\.[^/.]+$/, "");

  // ── Navigation ─────────────────────────────────────────────────────────────
  const currentNavIndex = selectedFile
    ? orderedFiles.findIndex((f) => f.FileID === selectedFile.FileID)
    : -1;

  const navigateToFile = (index) => {
    const target = orderedFiles[index];
    if (!target) return;
    if (currentFileIdRef.current) sendFileViewEndTime(currentFileIdRef.current);
    currentFileIdRef.current = target.FileID;
    setSelectedQuiz(null);
    setSelectedFile(target);
    recordFileView(target.FileID, target.UnitID);
    setExpandedUnits((prev) => {
      const next = new Set(prev);
      next.add(target.UnitID);
      return next;
    });
    if (isMobile) setIsSidebarCollapsed(true);
  };

  const handlePrev = () => navigateToFile(currentNavIndex - 1);
  const handleNext = () => {
    if (!selectedFile) return;
    handleVideoComplete(selectedFile.FileID);
  };
  const isFirst = currentNavIndex <= 0;
  const isLast =
    currentNavIndex === orderedFiles.length - 1 || currentNavIndex === -1;

  // Helpers for the current selected file
  const currentFileIsCompleted =
    selectedFile &&
    (selectedFile.videoCompleted || completedFiles.has(selectedFile.FileID));

  const currentFileIsYouTube = selectedFile && isYouTube(selectedFile);

  // ── Early returns ──────────────────────────────────────────────────────────
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
    if (isMobile) setIsSidebarCollapsed(true);
    navigate(`/quiz/${quiz.QuizID}`, {
      state: { quiz: { ...quiz, group_id: 2, QuizID: quiz.QuizID } },
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

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 text-foreground">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
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

      {/* Sidebar */}
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
        isFileLocked={isFileLocked}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-0 overflow-hidden p-4 md:p-6 ${
          isMobile && !isSidebarCollapsed ? "hidden" : "flex"
        }`}
      >
        {/* Content Header */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <button
                onClick={handleBackToSubmodules}
                className="hidden md:inline-flex items-center space-x-1 px-2 py-1 text-sm rounded-md border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 group"
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
                <FiFolder className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                <span className="text-sm md:text-base truncate">
                  Unit: {selectedFile.unitName || "Current Unit"}
                </span>
              </div>
            )}
          </div>
        </div>

        <hr className="my-2 border-gray-200 flex-shrink-0" />

        {/* ── Quiz view ── */}
        {selectedQuiz ? (
          <div className="flex-1 min-h-0 overflow-auto">
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
          /* ── File view ── */
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            {/* File name bar with Prev / Next */}
            <div className="mb-2 flex-shrink-0">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between gap-3">
                  {/* File name + completion indicator */}
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {currentFileIsCompleted && (
                      <FiCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    )}
                    <h2 className="text-base md:text-lg font-semibold text-gray-800 truncate">
                      {removeFileExtension(selectedFile.FilesName)}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* ── Mark as Complete button (PDF / non-YouTube only) ── */}
                    {!currentFileIsYouTube && !currentFileIsCompleted && (
                      <button
                        onClick={() =>
                          handleMarkAsComplete(selectedFile.FileID)
                        }
                        disabled={markingComplete}
                        title="Mark this file as completed"
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border transition-all duration-150 select-none
                          ${
                            markingComplete
                              ? "border-green-200 text-green-400 bg-green-50 cursor-wait opacity-70"
                              : "border-green-400 text-green-600 bg-green-50 hover:bg-green-100 hover:border-green-500 hover:text-green-700 active:scale-95 cursor-pointer"
                          }`}
                      >
                        <FiCheckCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">
                          {markingComplete ? "Saving..." : "Mark as Complete"}
                        </span>
                      </button>
                    )}

                    {/* Already completed badge for non-YouTube */}
                    {!currentFileIsYouTube && currentFileIsCompleted && (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg border border-green-200 text-green-600 bg-green-50 select-none">
                        <FiCheckCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Completed</span>
                      </span>
                    )}

                    {/* Prev button */}
                    <button
                      onClick={handlePrev}
                      disabled={isFirst}
                      title="Previous file"
                      aria-label="Go to previous file"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border transition-all duration-150 select-none
                        ${
                          isFirst
                            ? "border-gray-200 text-gray-300 bg-gray-50 opacity-40 cursor-not-allowed"
                            : "border-gray-300 text-gray-600 bg-white hover:bg-gray-100 hover:border-gray-400 hover:text-gray-800 active:scale-95 cursor-pointer"
                        }`}
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      <span className="hidden sm:inline">Prev</span>
                    </button>

                    {orderedFiles.length > 0 && (
                      <span className="text-xs text-gray-400 tabular-nums hidden sm:block whitespace-nowrap">
                        {currentNavIndex + 1} / {orderedFiles.length}
                      </span>
                    )}

                    {/* Next button */}
                    <button
                      onClick={handleNext}
                      disabled={isLast}
                      title="Next file"
                      aria-label="Go to next file"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border transition-all duration-150 select-none
                        ${
                          isLast
                            ? "border-gray-200 text-gray-300 bg-gray-50 opacity-40 cursor-not-allowed"
                            : "border-blue-300 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:border-blue-400 hover:text-blue-800 active:scale-95 cursor-pointer"
                        }`}
                    >
                      <span className="hidden sm:inline">Next</span>
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {selectedFile.Description && (
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {selectedFile.Description}
                  </p>
                )}
              </div>
            </div>

            {/* External link (non-YouTube) */}
            {isExternalLink(selectedFile) &&
            !selectedFile.FilePath.includes("youtube.com") &&
            !selectedFile.FilePath.includes("youtu.be") ? (
              <div className="flex-1 min-h-0 flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="max-w-md w-full text-center">
                  <div className="mb-4">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <FiExternalLink className="w-10 h-10 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 break-words">
                    {selectedFile.FilesName || "External Content Link"}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
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
              /* ── Viewer + Query panel ── */
              <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 overflow-hidden">
                <div className="relative flex flex-col w-full lg:flex-[3] min-h-[250px] lg:min-h-0 overflow-hidden">
                  <div
                    className={`relative flex-1 w-full h-full ${
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
                      className={`h-full flex-1 min-h-0 ${
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
                        <div className="flex flex-col h-full">
                          <FileViewer
                            fileUrl={`${import.meta.env.VITE_API_BASEURL.replace(
                              /\/$/,
                              "",
                            )}/${selectedFile?.FilePath.replace(/^\//, "")}`}
                          />
                        </div>
                      )}

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

                {/* Query Panel */}
                <div className="w-full lg:flex-[1] lg:min-w-[300px] lg:max-w-[400px] bg-white border border-gray-200 rounded-xl overflow-y-auto max-h-[300px] lg:max-h-full flex-shrink-0">
                  <UnitQueryPanel
                    moduleId={localStorage.getItem("moduleId")}
                    subModuleId={subModuleId}
                    unitId={selectedFile?.UnitID}
                    fileId={selectedFile?.FileID}
                    creatorId={selectedFile?.FileAuthAdd}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ── Empty state ── */
          <div className="flex-1 min-h-0 flex items-center justify-center">
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
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 md:hidden"
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
