import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { format } from "date-fns";
import ApiContext from "../../../context/ApiContext";
import { useContext } from "react";
import GradeScale from "./GradeScale";

const EditQuizModal = ({ quiz, onClose, categories, quizLevels }) => {
  const { fetchData, userToken, user } = useContext(ApiContext);
  const [formData, setFormData] = useState({
    QuizID: "",
    QuizCategory: "",
    QuizName: "",
    QuizLevel: "",
    QuizDuration: "",
    NegativeMarking: false,
    PassingPercentage: "",
    StartDateAndTime: "",
    EndDateTime: "",
    QuizVisibility: "Public",
    AuthLstEdt: "",
  });
  const [loading, setLoading] = useState(false);
  const [isGradeScaleEditable, setIsGradeScaleEditable] = useState(true);
  const [showGradeScale, setShowGradeScale] = useState(false);
  const [gradeScale, setGradeScale] = useState([]);
  const [errors, setErrors] = useState({
    StartDateAndTime: "",
    EndDateTime: "",
    QuizDuration: "",
  });

  useEffect(() => {
    if (quiz) {
      const formatDateForInput = (dateString) => {
        if (!dateString) return "";

        // Parse the ISO string directly as UTC
        const date = new Date(dateString);

        // Get UTC components
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const day = String(date.getUTCDate()).padStart(2, "0");
        const hours = String(date.getUTCHours()).padStart(2, "0");
        const minutes = String(date.getUTCMinutes()).padStart(2, "0");

        // Format as yyyy-MM-ddTHH:mm
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      setFormData({
        QuizID: quiz.quiz.QuizID,
        QuizCategory: quiz.quiz.QuizCategory,
        QuizName: quiz.quiz.QuizName,
        QuizLevel: quiz.quiz.QuizLevel,
        QuizDuration: quiz.quiz.QuizDuration,
        PassingPercentage: quiz.quiz.PassingPercentage,
        NegativeMarking: quiz.quiz.NegativeMarking || false,
        StartDateAndTime: formatDateForInput(quiz.quiz.StartDateAndTime),
        EndDateTime: formatDateForInput(quiz.quiz.EndDateTime),
        QuizVisibility: quiz.quiz.QuizVisibility || "Public",
        AuthLstEdt: user?.username || "",
      });

      setIsGradeScaleEditable(quiz.isGradeScaleEditable);

      if (quiz.gradeScale && quiz.gradeScale.length > 0) {
        setShowGradeScale(true);
        setGradeScale(
          quiz.gradeScale.map((item) => ({
            GradeScaleID: item.GradeScaleID,
            rangeFrom: item.RangeFrom,
            rangeTo: item.RangeTo,
            gradeValue: item.GradeValue,
            grade: item.Grade,
          })),
        );
      } else {
        setShowGradeScale(false);
        setGradeScale([]);
      }
    }
  }, [quiz, user]);

  const validateTimes = (startTime, endTime) => {
    const newErrors = { ...errors, StartDateAndTime: "", EndDateTime: "" };
    let isValid = true;
    const now = new Date();
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    // Validate start time
    if (startDate < now) {
      newErrors.StartDateAndTime = "Start time cannot be in the past";
      isValid = false;
    }

    // Validate end time
    if (endDate <= startDate) {
      newErrors.EndDateTime = "End time must be after start time";
      isValid = false;
    } else {
      const timeDiff = (endDate - startDate) / (1000 * 60); // difference in minutes
      if (timeDiff < 30) {
        newErrors.EndDateTime =
          "There must be at least 30 minutes between start and end times";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateDuration = (duration) => {
    const newErrors = { ...errors, QuizDuration: "" };
    let isValid = true;

    if (duration < 10) {
      newErrors.QuizDuration = "Duration must be at least 10 minutes";
      isValid = false;
    } else if (duration > 180) {
      newErrors.QuizDuration = "Duration cannot exceed 180 minutes";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePassingPercentage = (e) => {
    const value = Number(e.target.value);

    setFormData((prev) => ({
      ...prev,
      PassingPercentage: value,
    }));

    setGradeScale((prev) => {
      if (!prev.length) return prev;

      const updated = [...prev];

      updated[0] = {
        ...updated[0],
        rangeFrom: 0,
        rangeTo: Number((value - 0.01).toFixed(2)),
        grade: "F",
        gradeValue: 0,
      };

      for (let i = 1; i < updated.length; i++) {
        updated[i].rangeFrom = Number(
          (Number(updated[i - 1].rangeTo) + 0.01).toFixed(2),
        );
      }

      return updated;
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFormData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };

    setFormData(newFormData);

    // Validate times when either changes
    if (name === "StartDateAndTime" || name === "EndDateTime") {
      validateTimes(
        name === "StartDateAndTime" ? value : newFormData.StartDateAndTime,
        name === "EndDateTime" ? value : newFormData.EndDateTime,
      );
    }

    // Validate duration when it changes
    if (name === "QuizDuration") {
      validateDuration(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate all fields before submission
    const isTimesValid = validateTimes(
      formData.StartDateAndTime,
      formData.EndDateTime,
    );
    const isDurationValid = validateDuration(formData.QuizDuration);

    if (!isTimesValid || !isDurationValid) {
      Swal.fire({
        title: "Validation Error",
        text: "Please fix the validation errors before submitting",
        icon: "error",
        confirmButtonText: "OK",
      });
      setLoading(false);
      return;
    }

    try {
      const endpoint = "quiz/updateQuiz";
      const method = "POST";
      const headers = {
        "Content-Type": "application/json",
        "auth-token": userToken,
      };

      // Format dates for SQL Server and include username in AuthLstEdt
      const formattedData = {
        ...formData,

        showGradeScale,
        gradeScale: showGradeScale ? gradeScale : [],

        StartDateAndTime: convertToUTCIsoString(formData.StartDateAndTime),
        EndDateTime: convertToUTCIsoString(formData.EndDateTime),

        AuthLstEdt: user?.username || "Unknown",
      };

      function convertToUTCIsoString(dateString) {
        if (!dateString) return null;

        // Parse the date string as local time
        const date = new Date(dateString);

        // Convert to UTC ISO string without timezone conversion
        const pad = (num) => String(num).padStart(2, "0");
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
      }
      const response = await fetchData(
        endpoint,
        method,
        formattedData,
        headers,
      );

      if (response.success) {
        Swal.fire({
          title: "Success!",
          text: "Quiz updated successfully",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          // Pass the updated quiz data back to the parent
          onClose({
            ...quiz,
            ...formData,
            StartDateAndTime: formattedData.StartDateAndTime,
            EndDateTime: formattedData.EndDateTime,
          });
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: response.message || "Failed to update quiz",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      // console.error("Error updating quiz:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while updating the quiz",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Quiz</h2>
          <button
            onClick={() => onClose(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input type="hidden" name="QuizID" value={formData.QuizID} />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quiz Category*
              </label>
              <select
                name="QuizCategory"
                value={formData.QuizCategory}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.group_id} value={category.group_id}>
                    {category.group_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quiz Name*
              </label>
              <input
                type="text"
                name="QuizName"
                value={formData.QuizName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quiz Level*
              </label>
              <select
                name="QuizLevel"
                value={formData.QuizLevel}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Level</option>
                {quizLevels.map((level) => (
                  <option key={level.idCode} value={level.idCode}>
                    {level.ddValue}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)*
              </label>
              <input
                type="number"
                name="QuizDuration"
                value={formData.QuizDuration}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                min="10"
                max="180"
                required
              />
              {errors.QuizDuration && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.QuizDuration}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="NegativeMarking"
                checked={formData.NegativeMarking}
                onChange={handleChange}
                className="mr-2"
                id="negativeMarking"
              />
              <label
                htmlFor="negativeMarking"
                className="text-sm font-medium text-gray-700"
              >
                Negative Marking
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visibility*
              </label>
              <select
                name="QuizVisibility"
                value={formData.QuizVisibility}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date & Time*
              </label>
              <input
                type="datetime-local"
                name="StartDateAndTime"
                value={formData.StartDateAndTime}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.StartDateAndTime && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.StartDateAndTime}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date & Time*
              </label>
              <input
                type="datetime-local"
                name="EndDateTime"
                value={formData.EndDateTime}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.EndDateTime && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.EndDateTime}
                </p>
              )}
            </div>
          </div>
          <div className="mt-6">
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Passing Percentage</span>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {formData.PassingPercentage}%
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="100"
                name="PassingPercentage"
                value={formData.PassingPercentage}
                onChange={handlePassingPercentage}
                className="w-full"
              />
            </div>
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={showGradeScale}
                disabled={!isGradeScaleEditable}
                onChange={(e) => {
                  const checked = e.target.checked;

                  setShowGradeScale(checked);

                  if (!checked) {
                    setGradeScale([]);
                  } else if (gradeScale.length === 0) {
                    setGradeScale([
                      {
                        rangeFrom: 0,
                        rangeTo: 49.99,
                        gradeValue: 0,
                        grade: "F",
                      },
                    ]);
                  }
                }}
              />
              Enable Grade Scale
            </label>

            {showGradeScale && (
              <GradeScale
                gradeScale={gradeScale}
                setGradeScale={setGradeScale}
                isEditable={isGradeScaleEditable}
              />
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={() => onClose(null)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Quiz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuizModal;
