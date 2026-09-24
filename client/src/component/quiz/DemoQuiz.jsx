 import React, { useState, useEffect, useContext } from "react";
 import { useParams, useLocation, useNavigate } from "react-router-dom";
 import QuizHeader from "./QuizHeader";
 import QuizPalette from "./QuizPalette";
 import ApiContext from "../../context/ApiContext";
 import Loader from "../LoadPage";
 import Swal from "sweetalert2";

 
const fetchQuizQuestions = async (
  quiz,
  fetchData,
  userToken,
  setQuestions,
  setSelectedAnswers,
  setTimer,
  setQuestionStatus,
  loadSavedAnswers,
  transformQuestions
) => {
  try {
    console.log("Fetching questions with:", quiz);

    const quizData = quiz?.quiz || quiz;

    if (!quizData?.QuizID) {
      throw new Error("Quiz ID is missing");
    }

    const requestBody = {
      QuizID: quizData.QuizID,
    };

    console.log("Request Body:", requestBody);

    const data = await fetchData(
      "quiz/getQuizQuestionsByQuizId",
      "POST",
      requestBody,
      {
        "Content-Type": "application/json",
        "auth-token": userToken,
      }
    );

    console.log("API Response:", data);

    if (!data) {
      throw new Error("No data received from server");
    }

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch questions");
    }

    const questions = data.data?.questions || [];

    if (questions.length === 0) {
      throw new Error("No questions available for this quiz");
    }

    const transformedQuestions = transformQuestions(questions);

    setQuestions(transformedQuestions);

    const saved = loadSavedAnswers();

    setSelectedAnswers(
      saved?.answers ||
        Array(transformedQuestions.length).fill(null)
    );

    if (transformedQuestions.length > 0) {
      const duration =
        transformedQuestions[0].duration ||
        quizData.QuizDuration ||
        30;

      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;

      setTimer({
        hours,
        minutes,
        seconds: 0,
      });
    }

    const initialQuestionStatus = transformedQuestions.reduce(
      (acc, _, index) => {
        acc[index + 1] = "not-visited";
        return acc;
      },
      {}
    );

    setQuestionStatus(initialQuestionStatus);

  } catch (err) {
    console.error("Error fetching questions:", err);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.message || "Failed to load questions",
    });
  }
};



  export default fetchQuizQuestions;