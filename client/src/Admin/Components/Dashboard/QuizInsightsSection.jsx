import React, { useContext, useEffect, useState } from "react";
import {
  FaClipboardQuestion,
  FaCertificate,
  FaGraduationCap,
  FaCheck,
  FaXmark,
  FaChartBar,
} from "react-icons/fa6";
import ApiContext from "../../../context/ApiContext";

const QuizInsightsSection = ({ selectedEvent }) => {
  const { fetchData, userToken } = useContext(ApiContext);

  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEventQuizzes = async () => {
    if (!selectedEvent?.EventID) {
      setQuizData([]);
      return;
    }

    try {
      setLoading(true);

      const result = await fetchData(
        `dashboard/getEventQuizzes?eventId=${selectedEvent.EventID}`,
        "GET",
        {},
        {
          "Content-Type": "application/json",
          "auth-token": userToken,
        },
      );

      if (result?.success) {
        setQuizData(result.data || []);
      } else {
        setQuizData([]);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      setQuizData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventQuizzes();
  }, [selectedEvent?.EventID]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-visible">
      {/* HEADER */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FaClipboardQuestion className="text-[#76B900] text-lg" />

              <h2 className="text-lg font-bold text-[#013D54]">
                Quiz Overview
              </h2>
            </div>

            <p className="text-sm text-gray-500 mt-1">Event Quizzes</p>

            <p className="text-xs text-gray-400 mt-1">
              {selectedEvent?.EventName || "Select an event"}
            </p>
          </div>

          {!loading && (
            <div className="text-right">
              <p className="text-3xl font-bold text-[#013D54]">
                {quizData.length}
              </p>

              <p className="text-xs text-gray-500">Total Quizzes</p>
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        {loading ? (
          <div className="py-16 text-center text-gray-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#76B900] mx-auto"></div>

            <p className="mt-4">Loading quizzes...</p>
          </div>
        ) : quizData.length === 0 ? (
          <div className="py-16 text-center">
            <FaClipboardQuestion className="text-4xl text-gray-300 mx-auto" />

            <p className="mt-3 text-gray-500">
              No quizzes found for this event.
            </p>
          </div>
        ) : (
          <div className="border border-gray-100 rounded-xl p-6 overflow-visible">
            {/* GRAPH HEADER */}
            <div className="mb-6">
              <h3 className="font-bold text-[#013D54] flex items-center gap-2">
                <FaChartBar className="text-[#76B900]" />
                Quiz Overview
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Hover over a quiz bar to view configuration details
              </p>
            </div>

            {/* GRAPH AREA */}
            <div className="relative overflow-visible">
              {/* BARS CONTAINER */}
              <div className="flex items-end justify-around gap-4 overflow-x-auto overflow-y-visible pb-4 min-h-[280px]">
                {quizData.map((quiz, index) => {
                  const hasCertificate = Number(quiz.hasCertificate) === 1;

                  const hasGradeScale = Number(quiz.HasGradeScale) === 1;

                  const completionScore =
                    (hasCertificate ? 50 : 0) + (hasGradeScale ? 50 : 0);

                  // Minimum 60px, maximum 180px
                  const barHeight = 60 + (completionScore / 100) * 120;

                  return (
                    <div
                      key={quiz.QuizID}
                      className="flex flex-col items-center min-w-[100px]"
                    >
                      {/* QUIZ NUMBER */}
                      <span className="text-xs font-bold text-[#013D54] mb-2">
                        Q{index + 1}
                      </span>

                      {/* BAR WRAPPER */}
                      <div
                        className="relative w-16 rounded-t-xl transition-all duration-500 cursor-pointer group"
                        style={{
                          height: `${barHeight}px`,
                        }}
                      >
                        {/* ACTUAL BAR */}
                        <div
                          className={`absolute inset-0 rounded-t-xl transition-all duration-300 ${
                            completionScore === 100
                              ? "bg-gradient-to-t from-[#76B900] to-[#8CC63F]"
                              : "bg-gradient-to-t from-[#013D54] to-[#01516e]"
                          } group-hover:scale-105 group-hover:shadow-lg`}
                        >
                          
                        </div>

                        {/* ============================= */}
                        {/* HOVER TOOLTIP */}
                        {/* ============================= */}
                        {/* HOVER TOOLTIP */}
                        <div
                          className={`
    absolute
    bottom-full
    mb-3
    w-44
    bg-white
    rounded-xl
    shadow-xl
    border
    border-gray-200
    p-3
    opacity-0
    invisible
    group-hover:opacity-100
    group-hover:visible
    transition-all
    duration-200
    z-[100]
    pointer-events-none

    ${
      index === 0
        ? "left-0"
        : index === quizData.length - 1
          ? "right-0"
          : "left-1/2 -translate-x-1/2"
    }
  `}
                        >
                          {/* TOOLTIP ARROW */}
                          <div
                            className={`
      absolute
      top-full
      w-0
      h-0
      border-l-8
      border-r-8
      border-t-8
      border-l-transparent
      border-r-transparent
      border-t-white

      ${
        index === 0
          ? "left-6"
          : index === quizData.length - 1
            ? "right-6"
            : "left-1/2 -translate-x-1/2"
      }
    `}
                          />

                          <div className="border-t border-gray-100 pt-2">
                            {/* CERTIFICATE */}
                            <div className="flex items-center justify-between py-1.5">
                              <div className="flex items-center gap-2">
                                <FaCertificate
                                  className={`text-xs ${
                                    hasCertificate
                                      ? "text-[#76B900]"
                                      : "text-gray-400"
                                  }`}
                                />

                                <span className="text-xs text-gray-600">
                                  Certificate
                                </span>
                              </div>

                              {hasCertificate ? (
                                <FaCheck className="text-xs text-green-600" />
                              ) : (
                                <FaXmark className="text-xs text-red-500" />
                              )}
                            </div>

                            {/* GRADE SCALE */}
                            <div className="flex items-center justify-between py-1.5">
                              <div className="flex items-center gap-2">
                                <FaGraduationCap
                                  className={`text-xs ${
                                    hasGradeScale
                                      ? "text-[#76B900]"
                                      : "text-gray-400"
                                  }`}
                                />

                                <span className="text-xs text-gray-600">
                                  Grade Scale
                                </span>
                              </div>

                              {hasGradeScale ? (
                                <FaCheck className="text-xs text-green-600" />
                              ) : (
                                <FaXmark className="text-xs text-red-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* QUIZ NAME */}
                      <div className="w-[100px] mt-3 text-center">
                        <p
                          className="text-xs font-semibold text-gray-700 line-clamp-2"
                          title={quiz.QuizName}
                        >
                          {quiz.QuizName}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizInsightsSection;
