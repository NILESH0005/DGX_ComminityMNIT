import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ApiContext from "../../context/ApiContext";
import QuizLeaderboard from "./QuizLeaderboard";
import images from "../../../public/images";

import {
  FaAngleRight,
  FaBookOpen,
  FaClock,
  FaQuestionCircle,
  FaTrophy,
  FaRedo,
  FaPlay,
  FaCalendarAlt,
  FaBolt,
} from "react-icons/fa";

const QuizList = () => {
  const navigate = useNavigate();
  const quizCategoriesRef = useRef(null);
  const groupRefs = useRef({});

  const { userToken, fetchData } = useContext(ApiContext);

  const [leaderboard, setLeaderboard] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [now, setNow] = useState(new Date());
  const [activeGroup, setActiveGroup] = useState(null);

  /* =========================================================
     IMAGE URL
  ========================================================= */

  const getQuizImageUrl = (imagePath) => {
    if (!imagePath) {
      return images.Noimage;
    }

    if (imagePath.startsWith("data:image/")) {
      return imagePath;
    }

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    const baseUploadsUrl = import.meta.env.VITE_API_UPLOADSURL;

    if (!baseUploadsUrl) {
      console.error("VITE_API_UPLOADSURL is not configured!");
      return images.Noimage;
    }

    const cleanPath = imagePath.replace(/^\/+/, "");

    return `${baseUploadsUrl}/${cleanPath}`;
  };

  /* =========================================================
     QUIZ STATUS
  ========================================================= */

  const getQuizStatus = (quiz) => {
    if (now < quiz.startDate) {
      return "upcoming";
    }

    if (now >= quiz.startDate && now <= quiz.endDate) {
      return "active";
    }

    return "expired";
  };

  /* =========================================================
     LIVE CLOCK
  ========================================================= */

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  /* =========================================================
     FETCH QUIZZES
  ========================================================= */

  const fetchQuizzes = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!userToken) {
        throw new Error("Authentication token is missing");
      }

      const headers = {
        "Content-Type": "application/json",
        "auth-token": userToken,
      };

      const data = await fetchData(
        "quiz/getUserQuizCategory",
        "GET",
        {},
        headers,
      );

      const leaderboardData = await fetchData(
        "quiz/getLeaderboardRanking",
        "GET",
        {},
        headers,
      );

      if (!data || !leaderboardData) {
        throw new Error("No data received from server");
      }

      /* =====================================================
         QUIZ PROCESSING
      ===================================================== */

      if (data.success) {
        const quizMap = new Map();

        const groupedQuizzes = data.data.quizzes.reduce((acc, quiz) => {
          if (quizMap.has(quiz.QuizID)) {
            return acc;
          }

          quizMap.set(quiz.QuizID, true);

          const existingGroup = acc.find(
            (group) => group.group_name === quiz.group_name,
          );

          const quizObj = {
            id: quiz.QuizName,
            title: quiz.QuizName,
            questions: quiz.Total_Question_No,
            points: quiz.MaxScore,
            QuizID: quiz.QuizID,
            group_id: quiz.group_id,
            image: quiz.QuizImage,
            startDate: new Date(quiz.StartDateAndTime),
            endDate: new Date(quiz.EndDateTime),
            attempts: quiz.userAttempts || 0,
          };

          if (existingGroup) {
            existingGroup.quizzes.push(quizObj);
          } else {
            acc.push({
              id: quiz.group_name,
              group_name: quiz.group_name,
              group_id: quiz.group_id,
              quizzes: [quizObj],
            });
          }

          return acc;
        }, []);

        const filteredGroups = groupedQuizzes.filter((group) =>
          group.quizzes.some((quiz) => getQuizStatus(quiz) !== "expired"),
        );

        setQuizzes(filteredGroups);

        if (filteredGroups.length > 0) {
          setActiveGroup((current) => {
            if (current) {
              const stillExists = filteredGroups.some(
                (group) => group.id === current,
              );

              if (stillExists) {
                return current;
              }
            }

            return filteredGroups[0].id;
          });
        } else {
          setActiveGroup(null);
        }
      }

      /* =====================================================
         LEADERBOARD
      ===================================================== */

      if (leaderboardData.success) {
        const sortedLeaderboard = leaderboardData.data.quizzes
          .sort((a, b) => b.totalPoints - a.totalPoints)
          .map((user, index) => ({
            ...user,

            rank: index + 1,

            medal:
              index === 0
                ? "🥇"
                : index === 1
                  ? "🥈"
                  : index === 2
                    ? "🥉"
                    : `#${index + 1}`,

            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.Name,
            )}&background=random`,
          }));

        setLeaderboard(sortedLeaderboard);
      }
    } catch (err) {
      console.error("Error fetching quizzes:", err);

      setError(err.message || "Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     FETCH ON LOGIN
  ========================================================= */

  useEffect(() => {
    if (userToken) {
      fetchQuizzes();
    } else {
      setLoading(false);
      setError("Please login to access quizzes");
    }
  }, [userToken]);

  /* =========================================================
     NAVIGATE TO QUIZ
  ========================================================= */

  const navigateQuiz = (quiz, group) => {
    navigate(`/quiz/${quiz.QuizID}`, {
      state: {
        quiz: {
          ...quiz,
          group_id: group.group_id,
        },
      },
    });
  };

  /* =========================================================
     TIME REMAINING
  ========================================================= */

  const getTimeRemaining = (date) => {
    const diff = date - now;

    if (diff <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  /* =========================================================
     COUNTDOWN
  ========================================================= */

  const renderCountdown = (time, status) => {
    const countdownItems = [
      {
        value: time.days,
        label: "Days",
      },
      {
        value: time.hours,
        label: "Hours",
      },
      {
        value: time.minutes,
        label: "Min",
      },
      {
        value: time.seconds,
        label: "Sec",
      },
    ];

    return (
      <div className="mt-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={
                status === "active"
                  ? "w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"
                  : "w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"
              }
            >
              <FaClock className="text-xs" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {status === "upcoming" ? "Starts in" : "Ends in"}
            </span>
          </div>

          {status === "active" && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live
            </span>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {countdownItems.map((item) => (
            <div
              key={item.label}
              className="bg-gray-50 border border-gray-100 rounded-xl py-2.5 text-center"
            >
              <div className="text-lg font-bold text-gray-900 leading-none">
                {formatTime(item.value)}
              </div>

              <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mt-1">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* =========================================================
     CATEGORY SCROLL
  ========================================================= */

  const handleGroupSelect = (groupId) => {
    setActiveGroup(groupId);

    const element = groupRefs.current[groupId];

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-sm font-medium text-gray-600">
            Loading quizzes...
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Preparing your learning assessment
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-8 md:px-8 lg:px-10">
      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="max-w-7xl mx-auto mb-8 bg-white border border-red-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
              ⚠️
            </div>

            <div>
              <h3 className="font-semibold text-red-800">
                Error Loading Quizzes
              </h3>

              <p className="text-sm text-red-600 mt-0.5">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
                <FaBolt className="text-xs" />
                Knowledge Assessment
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Quiz Challenge
            </h1>

            <p className="mt-2 text-sm md:text-base text-gray-500 max-w-2xl">
              Test your knowledge, track your progress, and challenge yourself
              across different learning categories.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FaBookOpen />
            </div>

            <div>
              <p className="text-xs text-gray-400 font-medium">Available</p>

              <p className="text-sm font-bold text-gray-900">
                {quizzes.reduce(
                  (total, group) => total + group.quizzes.length,
                  0,
                )}{" "}
                Quizzes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN LAYOUT
      ===================================================== */}

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* ===================================================
            QUIZ CONTENT
        =================================================== */}

        <div className="w-full lg:w-8/12" ref={quizCategoriesRef}>
          {/* =================================================
              CATEGORY NAVIGATION
          ================================================= */}

          <div className="sticky top-4 z-30 bg-white rounded-2xl border border-gray-200 shadow-sm mb-8 overflow-hidden">
            {/* Header */}

            <div className="px-5 md:px-6 pt-5 pb-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <FaBookOpen className="text-sm" />
                    </div>

                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                      Quiz Library
                    </span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    Quiz Categories
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Choose a category to explore its available quizzes.
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 text-xs text-gray-500">
                  <FaBookOpen className="text-indigo-500" />

                  <span>
                    {quizzes.length}{" "}
                    {quizzes.length === 1 ? "Category" : "Categories"}
                  </span>
                </div>
              </div>
            </div>

            {/* Category Buttons */}

            <div className="px-5 md:px-6 pb-5 border-t border-gray-100 pt-4">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {quizzes.map((group) => {
                  const isActive = activeGroup === group.id;

                  return (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => handleGroupSelect(group.id)}
                      className={
                        isActive
                          ? "flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
                          : "flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 bg-white text-gray-600 border-gray-200 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50/50"
                      }
                    >
                      <FaBookOpen
                        className={
                          isActive
                            ? "text-xs text-indigo-100"
                            : "text-xs text-indigo-500"
                        }
                      />

                      <span>{group.group_name}</span>

                      <span
                        className={
                          isActive
                            ? "min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center text-[10px] font-bold bg-white/20 text-white"
                            : "min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center text-[10px] font-bold bg-gray-100 text-gray-500"
                        }
                      >
                        {group.quizzes.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* =================================================
              QUIZ GROUPS
          ================================================= */}

          {quizzes.length > 0 ? (
            <div className="space-y-12">
              {quizzes.map((group) => (
                <div
                  key={group.id}
                  ref={(element) => {
                    groupRefs.current[group.id] = element;
                  }}
                  className="relative scroll-mt-24"
                >
                  {/* Group Heading */}

                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                        <FaBookOpen className="text-sm" />
                      </div>

                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900">
                          {group.group_name}
                        </h3>

                        <p className="text-xs text-gray-500 mt-0.5">
                          {group.quizzes.length}{" "}
                          {group.quizzes.length === 1 ? "quiz" : "quizzes"}{" "}
                          available
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleGroupSelect(group.id)}
                      className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <span>View category</span>
                      <FaAngleRight className="text-[10px]" />
                    </button>
                  </div>

                  {/* Quiz Cards */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {group.quizzes.map((quiz) => {
                      const status = getQuizStatus(quiz);

                      if (status === "expired") {
                        return null;
                      }

                      const time =
                        status === "upcoming"
                          ? getTimeRemaining(quiz.startDate)
                          : getTimeRemaining(quiz.endDate);

                      const imageUrl = getQuizImageUrl(quiz.image);

                      return (
                        <article
                          key={quiz.id}
                          className="group/card bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col h-full"
                        >
                          {/* Image */}

                          <div className="relative h-52 overflow-hidden bg-gray-100">
                            <img
                              src={imageUrl}
                              alt={quiz.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = images.Noimage;
                                e.currentTarget.className =
                                  "w-full h-full object-contain bg-gray-100 p-10";
                              }}
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10 pointer-events-none" />

                            {/* Status */}

                            <div className="absolute top-4 left-4">
                              {status === "active" ? (
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-semibold shadow-lg">
                                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                  Live Now
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 text-gray-700 text-xs font-semibold shadow-lg backdrop-blur-sm">
                                  <FaCalendarAlt className="text-amber-500" />
                                  Upcoming
                                </span>
                              )}
                            </div>

                            {/* Category on image */}

                            <div className="absolute bottom-4 left-4 right-4">
                              <div className="flex items-center gap-2 text-white">
                                <FaBookOpen className="text-sm opacity-90" />

                                <span className="text-xs font-medium opacity-90">
                                  {group.group_name}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Card Content */}

                          <div className="p-6 flex flex-col flex-grow">
                            {/* Title */}

                            <div className="mb-5">
                              <h4 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2 group-hover/card:text-indigo-600 transition-colors">
                                {quiz.title}
                              </h4>

                              <div className="mt-3 w-10 h-1 rounded-full bg-indigo-600 group-hover/card:w-16 transition-all duration-300" />
                            </div>

                            {/* Metadata */}

                            <div className="grid grid-cols-2 gap-3 mb-5">
                              {/* Questions */}

                              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                  <FaQuestionCircle className="text-sm" />
                                </div>

                                <div>
                                  <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">
                                    Questions
                                  </p>

                                  <p className="text-sm font-bold text-gray-800">
                                    {quiz.questions}
                                  </p>
                                </div>
                              </div>

                              {/* Score */}

                              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                                  <FaTrophy className="text-sm" />
                                </div>

                                <div>
                                  <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">
                                    Max Score
                                  </p>

                                  <p className="text-sm font-bold text-gray-800">
                                    {quiz.points}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Attempts */}

                            {quiz.attempts > 0 && (
                              <div className="flex items-center justify-between px-3.5 py-2.5 mb-5 rounded-xl bg-indigo-50/70 border border-indigo-100">
                                <div className="flex items-center gap-2">
                                  <FaRedo className="text-indigo-500 text-xs" />

                                  <span className="text-xs font-medium text-indigo-700">
                                    Previous attempts
                                  </span>
                                </div>

                                <span className="min-w-6 h-6 px-2 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                                  {quiz.attempts}
                                </span>
                              </div>
                            )}

                            {/* Countdown */}

                            {(status === "upcoming" || status === "active") &&
                              renderCountdown(time, status)}

                            {/* Button */}

                            <div className="mt-auto pt-6">
                              {status === "active" ? (
                                <button
                                  onClick={() => navigateQuiz(quiz, group)}
                                  className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-lg transition-all duration-200"
                                >
                                  {quiz.attempts > 0 ? (
                                    <>
                                      <FaRedo className="text-xs" />
                                      Retake Quiz
                                    </>
                                  ) : (
                                    <>
                                      <FaPlay className="text-xs" />
                                      Start Quiz
                                    </>
                                  )}

                                  <FaAngleRight className="ml-1 text-xs" />
                                </button>
                              ) : (
                                <button
                                  disabled
                                  className="w-full h-12 rounded-xl bg-gray-100 border border-gray-200 text-gray-400 font-semibold text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                                >
                                  <FaClock className="text-xs" />
                                  Starts Soon
                                </button>
                              )}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* No quizzes */

            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                <FaBookOpen className="text-2xl" />
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No Quizzes Available
              </h3>

              <p className="text-sm text-gray-500 max-w-md mx-auto">
                There are currently no active or upcoming quizzes. Please check
                back later.
              </p>
            </div>
          )}
        </div>

        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <div className="w-full lg:w-4/12">
          <div className="sticky top-24">
            <QuizLeaderboard leaderboard={leaderboard} />

            {/* How It Works */}

            <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FaBolt className="text-sm" />
                </div>

                <div>
                  <h4 className="text-base font-bold text-gray-900">
                    How It Works
                  </h4>

                  <p className="text-xs text-gray-400 mt-0.5">
                    Complete quizzes and earn points
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Step 1 */}

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    1
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Choose a quiz
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Select any available quiz from a category.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    2
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Complete the assessment
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Answer all questions within the available time.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    3
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Earn points
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Improve your score and climb the leaderboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizList;
