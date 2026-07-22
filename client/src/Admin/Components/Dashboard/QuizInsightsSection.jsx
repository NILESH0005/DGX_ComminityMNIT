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
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#76B900] font-bold">
              Quiz Overview
            </p>
            <h2 className="text-xl font-bold text-[#013D54] mt-1">
              Event Quizzes
            </h2>
            <p className="text-sm text-gray-500 mt-1">
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
          <div className="border border-gray-100 rounded-xl p-6">
            <div className="mb-6">
              <h3 className="font-bold text-[#013D54] flex items-center gap-2">
                <FaChartBar className="text-[#76B900]" />
                Quiz Overview
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Bar height represents configuration completion
              </p>
            </div>

            {/* GRAPH AREA */}
            <div className="relative">
              {/* Bars Container */}
              <div className="flex items-end justify-around gap-4 overflow-x-auto pb-4 min-h-[280px]">
                {quizData.map((quiz, index) => {
                  const hasCertificate = Number(quiz.hasCertificate) === 1;
                  const hasGradeScale = Number(quiz.HasGradeScale) === 1;
                  const completionScore =
                    (hasCertificate ? 50 : 0) + (hasGradeScale ? 50 : 0);

                  // Bar height based on completion (min 60px, max 180px)
                  const barHeight = 60 + (completionScore / 100) * 120;

                  return (
                    <div
                      key={quiz.QuizID}
                      className="flex flex-col items-center min-w-[100px]"
                    >
                      {/* Quiz Number */}
                      <span className="text-xs font-bold text-[#013D54] mb-2">
                        Q{index + 1}
                      </span>

                      {/* Bar with gradient */}
                      <div
                        className="relative w-16 rounded-t-xl transition-all duration-500 cursor-pointer group"
                        style={{ height: `${barHeight}px` }}
                      >
                        <div
                          className={`absolute inset-0 rounded-t-xl transition-all duration-300 ${
                            completionScore === 100
                              ? "bg-gradient-to-t from-[#76B900] to-[#8CC63F]"
                              : completionScore >= 50
                                ? "bg-gradient-to-t from-[#013D54] to-[#01516e]"
                                : "bg-gradient-to-t from-[#013D54] to-[#01516e]"
                          } group-hover:scale-105 group-hover:shadow-lg`}
                        >
                          {/* Completion percentage on bar */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                              {completionScore}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quiz Name */}
                      <div className="w-[100px] mt-3 text-center">
                        <p
                          className="text-xs font-semibold text-gray-700 line-clamp-2"
                          title={quiz.QuizName}
                        >
                          {quiz.QuizName}
                        </p>
                      </div>

                      {/* Details below each bar - within graph area */}
                      <div className="w-full mt-3 space-y-1.5 bg-gray-50/80 rounded-lg p-2.5 border border-gray-100">
                        {/* Certificate */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <FaCertificate
                              className={`text-[10px] ${hasCertificate ? "text-[#76B900]" : "text-gray-400"}`}
                            />
                            <span className="text-[10px] text-gray-600">
                              Cert
                            </span>
                          </div>
                          {hasCertificate ? (
                            <FaCheck className="text-[10px] text-green-600" />
                          ) : (
                            <FaXmark className="text-[10px] text-red-500" />
                          )}
                        </div>

                        {/* Grade Scale */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <FaGraduationCap
                              className={`text-[10px] ${hasGradeScale ? "text-[#76B900]" : "text-gray-400"}`}
                            />
                            <span className="text-[10px] text-gray-600">
                              Grade
                            </span>
                          </div>
                          {hasGradeScale ? (
                            <FaCheck className="text-[10px] text-green-600" />
                          ) : (
                            <FaXmark className="text-[10px] text-red-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary Stats - Integrated at bottom of graph */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3 bg-green-50 rounded-lg px-4 py-2.5">
                  <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                    <FaCheck className="text-green-600 text-xs" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">Certificates</p>
                    <p className="text-sm font-bold text-green-700">
                      {
                        quizData.filter((q) => Number(q.hasCertificate) === 1)
                          .length
                      }{" "}
                      / {quizData.length}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-blue-50 rounded-lg px-4 py-2.5">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaGraduationCap className="text-blue-600 text-xs" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">Grade Scales</p>
                    <p className="text-sm font-bold text-blue-700">
                      {
                        quizData.filter((q) => Number(q.HasGradeScale) === 1)
                          .length
                      }{" "}
                      / {quizData.length}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#76B900]/10 rounded-lg px-4 py-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#76B900]/20 flex items-center justify-center">
                    <FaClipboardQuestion className="text-[#76B900] text-xs" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">
                      Fully Configured
                    </p>
                    <p className="text-sm font-bold text-[#76B900]">
                      {
                        quizData.filter(
                          (q) =>
                            Number(q.hasCertificate) === 1 &&
                            Number(q.HasGradeScale) === 1,
                        ).length
                      }{" "}
                      / {quizData.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizInsightsSection;
