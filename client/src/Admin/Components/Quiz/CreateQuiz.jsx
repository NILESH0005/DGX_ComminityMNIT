import React, { useState, useEffect, useContext } from "react";
import { FaCalendarAlt, FaCheckCircle } from "react-icons/fa";
import ApiContext from "../../../context/ApiContext";
import Swal from "sweetalert2";
import { compressImage } from "../../../utils/compressImage.js";
import FileUploader from "../../../container/FileUploader.jsx";
import GradeScale from "./GradeScale";

const CreateQuiz = ({
  moduleId,
  moduleName,
  SubModuleId,
  SubModuleName,
  navigateToQuizTable,
  onBack,
}) => {
  const { userToken, fetchData } = useContext(ApiContext);
  const [categories, setCategories] = useState([]);
  const [quizLevels, setQuizLevels] = useState([]);
  const [quizData, setQuizData] = useState({
    category: "",
    name: "",
    level: "",
    duration: 30,
    negativeMarking: false,
    showWrongAnswerSummary: false,
    showGradeOnCertificate: true,
    passingPercentage: 50,
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    type: "",
    quizImage: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [isCategoryLocked, setIsCategoryLocked] = useState(false);
  const [showGradeScale, setShowGradeScale] = useState(false);
  const [gradeScale, setGradeScale] = useState([]);

  useEffect(() => {
    if (!showGradeScale || gradeScale.length === 0) return;

    setGradeScale((prev) => {
      const updated = [...prev];

      updated[0] = {
        ...updated[0],
        rangeTo: Number(quizData.passingPercentage) - 0.01,
      };

      return updated;
    });
  }, [quizData.passingPercentage]);

  useEffect(() => {
    const fetchQuizCategories = async () => {
      const endpoint = `dropdown/getQuizGroupDropdown`;
      const method = "GET";
      const headers = {
        "Content-Type": "application/json",
        "auth-token": userToken,
      };

      try {
        const data = await fetchData(endpoint, method, headers);

        if (data.success) {
          const sortedCategories = data.data.sort((a, b) =>
            a.group_name.localeCompare(b.group_name),
          );

          setCategories(sortedCategories);

          const matchedGroup = sortedCategories.find(
            (item) => Number(item.SubModuleID) === Number(moduleId),
          );

          if (matchedGroup) {
            setQuizData((prev) => ({
              ...prev,
              category: String(matchedGroup.group_id),
            }));

            setIsCategoryLocked(true);
          }
        } else {
          Swal.fire("Error", "Failed to fetch quiz categories.", "error");
        }
      } catch (error) {
        // console.error("Error fetching quiz categories:", error);
        Swal.fire("Error", "Error fetching quiz categories.", "error");
      }
    };

    const fetchQuizLevels = async () => {
      const endpoint = `dropdown/getDropdownValues?category=quizLevel`;
      const method = "GET";
      const headers = {
        "Content-Type": "application/json",
        "auth-token": userToken,
      };

      try {
        const data = await fetchData(endpoint, method, headers);
        if (data.success) {
          setQuizLevels(data.data);
        } else {
          Swal.fire("Error", "Failed to fetch quiz levels.", "error");
        }
      } catch (error) {
        // console.error("Error fetching quiz levels:", error);
        Swal.fire("Error", "Error fetching quiz levels.", "error");
      }
    };

    fetchQuizCategories();
    fetchQuizLevels();
  }, []);

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return {
      currentDate: `${year}-${month}-${day}`,
      currentTime: `${hours}:${minutes}`,
    };
  };

  const { currentDate, currentTime } = getCurrentDateTime();

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "category":
        if (!value) error = "Please select a quiz category";
        break;
      case "name":
        if (!value.trim()) error = "Quiz name is required";
        else if (value.trim().length > 100)
          error = "Quiz name must be less than 100 characters";
        break;
      case "level":
        if (!value) error = "Please select a quiz level";
        break;
      case "type":
        if (!value) error = "Please select a quiz type";
        break;
      case "duration":
        if (value < 5 || value > 180)
          error = "Duration must be between 5 and 180 minutes";
        break;
      case "startDate":
        if (!value) error = "Start date is required";
        break;
      case "passingPercentage":
        if (value < 1 || value > 100)
          error = "Passing percentage must be between 1 and 100";
        break;
      case "startTime":
        if (!value) error = "Start time is required";
        break;
      case "endDate":
        if (!value) error = "End date is required";
        break;
      case "endTime":
        if (!value) error = "End time is required";
        break;
      case "quizImage":
        if (!value) error = "Please upload a quiz banner image";
        break;
      default:
        break;
    }
    return error;
  };

  const validateDateTime = () => {
    const { startDate, startTime, endDate, endTime } = quizData;
    const newErrors = { ...errors };

    if (startDate && endDate && startTime && endTime) {
      const startDateTime = new Date(`${startDate}T${startTime}`);
      const endDateTime = new Date(`${endDate}T${endTime}`);
      const currentDateTime = new Date();

      // Check if start date/time is in the past
      if (startDateTime < currentDateTime) {
        newErrors.startDate = "Start date/time cannot be in the past";
        newErrors.startTime = "Start date/time cannot be in the past";
      } else {
        if (newErrors.startDate === "Start date/time cannot be in the past") {
          delete newErrors.startDate;
        }
        if (newErrors.startTime === "Start date/time cannot be in the past") {
          delete newErrors.startTime;
        }
      }

      // Check if end date/time is after start date/time
      if (endDateTime <= startDateTime) {
        newErrors.endDate = "End date/time must be after start date/time";
        newErrors.endTime = "End date/time must be after start date/time";
      } else {
        if (
          newErrors.endDate === "End date/time must be after start date/time"
        ) {
          delete newErrors.endDate;
        }
        if (
          newErrors.endTime === "End date/time must be after start date/time"
        ) {
          delete newErrors.endTime;
        }
      }

      // Check if duration is at least 30 minutes
      const timeDifference = (endDateTime - startDateTime) / (1000 * 60);
      if (timeDifference < 30) {
        newErrors.endTime = "Quiz duration must be at least 30 minutes";
      } else if (
        newErrors.endTime === "Quiz duration must be at least 30 minutes"
      ) {
        delete newErrors.endTime;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setQuizData((prev) => ({ ...prev, [name]: fieldValue }));

    // Validate field on change if form has been submitted or if clearing an error
    if (isSubmitted || errors[name]) {
      const error = validateField(name, fieldValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }

    // Validate date/time fields when they change
    if (name.includes("Date") || name.includes("Time")) {
      setTimeout(validateDateTime, 100);
    }
  };

  const getMinEndTime = () => {
    if (!quizData.startDate || !quizData.startTime) return "";

    const startDateTime = new Date(
      `${quizData.startDate}T${quizData.startTime}`,
    );
    const minEndDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000);

    const hours = String(minEndDateTime.getHours()).padStart(2, "0");
    const minutes = String(minEndDateTime.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate all fields
    Object.keys(quizData).forEach((field) => {
      if (field === "negativeMarking") return;

      const error = validateField(field, quizData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    // Validate date/time
    if (!validateDateTime()) {
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleImageUpload = (result) => {
    if (result && result.success) {
      // Assuming your API returns the file path or URL in result.data
      const imagePath = result.data || result.filePath;
      setQuizData((prev) => ({
        ...prev,
        quizImage: imagePath,
      }));
      setImageUploaded(true); // Mark image as uploaded
      setErrors((prev) => ({ ...prev, quizImage: "" })); // Clear any image errors
    } else {
      setImageUploaded(false); // Mark image as not uploaded
      setErrors((prev) => ({
        ...prev,
        quizImage: result?.message || "Failed to upload image",
      }));
    }
  };

  const handlecreateQuiz = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (showGradeScale) {
      const hasInvalidRow = gradeScale.some(
        (row) =>
          row.rangeTo === "" ||
          Number(row.rangeTo) <= Number(row.rangeFrom) ||
          Number(row.rangeTo) > 100,
      );

      if (hasInvalidRow) {
        Swal.fire(
          "Validation Error",
          "Please fix all Grade Scale ranges before creating the quiz.",
          "error",
        );
        return;
      }
    }

    // Re-validate the image field based on upload status
    if (!imageUploaded && !quizData.quizImage) {
      setErrors((prev) => ({
        ...prev,
        quizImage: "Please upload a quiz banner image",
      }));
    }

    Swal.fire({
      title: "Confirm Quiz Creation",
      text: "Are you sure you want to create this quiz?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);

        const payload = {
          category: quizData.category,
          name: quizData.name,
          level: quizData.level,
          duration: quizData.duration,
          negativeMarking: quizData.negativeMarking,
          showWrongAnswerSummary: quizData.showWrongAnswerSummary,
          showGradeOnCertificate: quizData.showGradeOnCertificate,
          passingPercentage: quizData.passingPercentage,
          startDate: quizData.startDate,
          startTime: quizData.startTime,
          endDate: quizData.endDate,
          endTime: quizData.endTime,
          type: quizData.type,
          quizVisibility: quizData.type,
          quizImage: quizData.quizImage,
          refId: moduleId || 0,
          refName: moduleName || "quiz",
          gradeScale: gradeScale,
        };

        try {
          const endpoint = "quiz/createQuiz";
          const method = "POST";
          const headers = {
            "Content-Type": "application/json",
            "auth-token": userToken,
          };

          const data = await fetchData(endpoint, method, payload, headers);
          setLoading(false);

          if (data && data.success) {
            Swal.fire({
              title: "Success!",
              text: "Quiz has been created successfully.",
              icon: "success",
            }).then(() => {
              navigateToQuizTable();
            });
          } else {
            Swal.fire(
              "Error",
              data?.message || "Failed to create quiz",
              "error",
            );
          }
        } catch (error) {
          setLoading(false);
          Swal.fire(
            "Error",
            "An error occurred while creating the quiz",
            "error",
          );
        }
      }
    });
  };

  const minEndTime = getMinEndTime();

  return (
    <div className="min-h-screen bg-slate-100 py-4 px-2">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-4 mb-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Create Quiz</h1>
              <p className="text-slate-500 mt-2">
                Configure quiz settings, scheduling and access permissions.
              </p>
            </div>

            <button
              onClick={onBack}
              className="px-2 py-2 rounded-xl border border-slate-300 hover:bg-slate-50"
            >
              ← Back
            </button>
          </div>
        </div>

        <form onSubmit={handlecreateQuiz}>
          {/* Quiz Information */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-4 mb-2">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Quiz Information
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Module Category
                </label>

                <select
                  name="category"
                  value={quizData.category}
                  onChange={handleChange}
                  disabled={isCategoryLocked}
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.group_id} value={cat.group_id}>
                      {cat.group_name}
                    </option>
                  ))}
                </select>

                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Quiz Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={quizData.name}
                  onChange={handleChange}
                  placeholder="Enter Quiz Name"
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:ring-4 focus:ring-blue-100"
                />

                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Level */}
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Quiz Level
                </label>

                <select
                  name="level"
                  value={quizData.level}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl border border-slate-300"
                >
                  <option value="">Select Level</option>

                  {quizLevels.map((level) => (
                    <option key={level.idCode} value={level.idCode}>
                      {level.ddValue}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Quiz Visibility
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() =>
                      setQuizData((prev) => ({
                        ...prev,
                        type: "Public",
                      }))
                    }
                    className={`cursor-pointer rounded-2xl border p-4 transition ${
                      quizData.type === "Public"
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-300"
                    }`}
                  >
                    🌍 Public
                  </div>

                  <div
                    onClick={() =>
                      setQuizData((prev) => ({
                        ...prev,
                        type: "Private",
                      }))
                    }
                    className={`cursor-pointer rounded-2xl border p-4 transition ${
                      quizData.type === "Private"
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-300"
                    }`}
                  >
                    🔒 Private
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Assessment Settings */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-4 mb-2">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Assessment Settings
            </h2>

            <div className="space-y-8">
              {/* Duration */}
              <div>
                <div className="flex justify-between mb-3">
                  <span>Duration</span>

                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {quizData.duration} mins
                  </span>
                </div>

                <input
                  type="range"
                  min="5"
                  max="180"
                  name="duration"
                  value={quizData.duration}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              {/* Passing */}
              <div>
                <div className="flex justify-between mb-3">
                  <span>Passing Percentage</span>

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {quizData.passingPercentage}%
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="100"
                  name="passingPercentage"
                  value={quizData.passingPercentage}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              {/*CHECK BOX*/}
              <div className="flex justify-between items-center mb-3">
                <label
                  htmlFor="gradeCheckbox"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={showGradeScale}
                    onChange={(e) => {
                      const checked = e.target.checked;

                      setShowGradeScale(checked);

                      if (checked) {
                        setGradeScale([
                          {
                            rangeFrom: 0,
                            rangeTo: Number(quizData.passingPercentage) - 0.01,
                            gradeValue: 0,
                            grade: "F",
                          },
                        ]);
                      } else {
                        setGradeScale([]);
                      }
                    }}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span>Enable Grade Scale</span>
                </label>
              </div>

              {showGradeScale && (
                <GradeScale
                  gradeScale={gradeScale}
                  setGradeScale={setGradeScale}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Negative Marking */}
                <div className="h-full flex items-center justify-between bg-slate-50 p-5 rounded-2xl border border-slate-200 hover:border-blue-300 transition">
                  <div>
                    <h4 className="font-medium">Negative Marking</h4>

                    <p className="text-sm text-slate-500">
                      Deduct marks for incorrect answers.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="negativeMarking"
                    checked={quizData.negativeMarking}
                    onChange={handleChange}
                    className="h-5 w-5"
                  />
                </div>

                {/* Wrong Answer Summary */}
                <div className="h-full flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-blue-300 transition">
                  <div>
                    <h4 className="font-medium text-slate-800">
                      Show Incorrect Answers
                    </h4>

                    <p className="text-sm text-slate-500">
                      Review incorrect answers after quiz submission.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="showWrongAnswerSummary"
                    checked={quizData.showWrongAnswerSummary}
                    onChange={handleChange}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>
                <div className="h-full flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-blue-300 transition">
                  <div>
                    <h4 className="font-medium text-slate-800">
                      Show Grade on Certificate
                    </h4>

                    <p className="text-sm text-slate-500">
                      Display user's grade on generated certificate.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="showGradeOnCertificate"
                    checked={quizData.showGradeOnCertificate}
                    onChange={handleChange}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-4 mb-2">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Schedule
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <input
                type="date"
                name="startDate"
                value={quizData.startDate}
                onChange={handleChange}
                className="h-12 px-4 rounded-xl border border-slate-300"
              />

              <input
                type="time"
                name="startTime"
                value={quizData.startTime}
                onChange={handleChange}
                className="h-12 px-4 rounded-xl border border-slate-300"
              />

              <input
                type="date"
                name="endDate"
                value={quizData.endDate}
                onChange={handleChange}
                className="h-12 px-4 rounded-xl border border-slate-300"
              />

              <input
                type="time"
                name="endTime"
                value={quizData.endTime}
                onChange={handleChange}
                className="h-12 px-4 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          {/* Banner */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-4 mb-2">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Quiz Banner
            </h2>

            <div className="border-2 border-dashed border-slate-300 rounded-3xl p-4 bg-slate-50">
              <FileUploader
                moduleName="quiz"
                folderName="quiz-banners"
                onUploadComplete={handleImageUpload}
                accept="image/*"
                maxSize={200 * 1024}
                label="Upload Quiz Banner"
                previewType="image"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border rounded-3xl shadow-lg p-5">
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onBack}
                className="px-2 py-3 rounded-xl border border-slate-300"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-xl bg-DGXblue text-white font-medium hover:opacity-90"
              >
                {loading ? "Creating..." : "Create Quiz"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;
