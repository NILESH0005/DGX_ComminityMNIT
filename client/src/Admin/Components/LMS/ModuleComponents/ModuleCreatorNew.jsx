import React, { useState, useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";
import ApiContext from "../../../../context/ApiContext"; // Adjust path as needed
import FileUploader from "../../../../container/FileUploader"; // Adjust path as needed
import Swal from "sweetalert2";

const ModuleCreatorNew = ({ onCreate, onCancel, existingModules = [] }) => {
  const [isCreated, setIsCreated] = useState(false);
  const [newModule, setNewModule] = useState({
    id: uuidv4(),
    name: "",
    description: "",
    banner: null,
    bannerPath: null,
    bannerUrl: null,
    batchId: "",
    uiTypeId: "",
    eventId: "",
    hasCertificate: false,
    quizAccessOnSubModuleCompletion: true,
    tags: [],
    tagInput: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const { userToken, fetchData } = useContext(ApiContext);
  const [batchOptions, setBatchOptions] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [uiTypeOptions, setUiTypeOptions] = useState([]);
  const [loadingUiTypes, setLoadingUiTypes] = useState(false);
  const [eventOptions, setEventOptions] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [lmsLevels, setLmsLevels] = useState([]);
  const [loadingLmsLevels, setLoadingLmsLevels] = useState(false);
  const [lmsUserCategories, setLmsUserCategories] = useState([]);
  const [loadingLmsUserCategories, setLoadingLmsUserCategories] =
    useState(false);

  const validationRules = {
    name: {
      required: true,
      minLength: 3,
      maxLength: 100,
      pattern: /^[a-zA-Z0-9\s\-_&@.,!?()]+$/,
      message: {
        required: "Module name is required",
        minLength: "Module name must be at least 3 characters",
        maxLength: "Module name cannot exceed 100 characters",
        pattern: "Module name contains invalid characters",
      },
    },
    description: {
      required: true,
      minLength: 10,
      maxLength: 500,
      message: {
        required: "Description is required",
        minLength: "Description must be at least 10 characters",
        maxLength: "Description cannot exceed 500 characters",
      },
    },
    banner: {
      required: true,
      message: {
        required: "Banner image is required",
      },
    },
    batchId: {
      required: true,
      message: {
        required: "Please select a batch",
      },
    },
  };
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);

        const data = await fetchData("dropdown/geteventmaster", "GET");

        if (data.success) {
          setEventOptions(data.data);
        } else {
          Swal.fire("Error", "Failed to fetch events", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Error fetching events", "error");
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchLmsLevels = async () => {
      try {
        setLoadingLmsLevels(true);

        const data = await fetchData("dropdown/get-lms-level", "GET");

        if (data.success) {
          setLmsLevels(data.data);
        } else {
          Swal.fire("Error", "Failed to fetch LMS Levels", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Error fetching LMS Levels", "error");
      } finally {
        setLoadingLmsLevels(false);
      }
    };

    fetchLmsLevels();
  }, []);

  useEffect(() => {
    const fetchLmsUserCategories = async () => {
      try {
        setLoadingLmsUserCategories(true);

        const data = await fetchData("dropdown/get-lms-user-categories", "GET");

        if (data.success) {
          setLmsUserCategories(data.data);
        } else {
          Swal.fire("Error", "Failed to fetch LMS User Categories", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Error fetching LMS User Categories", "error");
      } finally {
        setLoadingLmsUserCategories(false);
      }
    };

    fetchLmsUserCategories();
  }, []);

  useEffect(() => {
    const fetchUiTypes = async () => {
      try {
        setLoadingUiTypes(true);

        const data = await fetchData("dropdown/ui-type", "GET");

        if (data.success) {
          setUiTypeOptions(data.data);
        } else {
          Swal.fire("Error", "Failed to fetch UI Types", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Error fetching UI Types", "error");
      } finally {
        setLoadingUiTypes(false);
      }
    };
    fetchUiTypes();
  }, []);

  useEffect(() => {
    const fetchCourseBatches = async () => {
      const endpoint = `dropdown/course-batches`;
      const method = "GET";
      const headers = {
        "Content-Type": "application/json",
        "auth-token": userToken,
      };

      try {
        setLoadingBatches(true);

        const data = await fetchData(endpoint, method, headers);

        if (data.success) {
          // OPTIONAL: sort nicely (very important for UX)
          const sortedBatches = data.data.sort((a, b) =>
            a.batch_Name.localeCompare(b.batch_Name),
          );

          setBatchOptions(sortedBatches);
        } else {
          Swal.fire("Error", "Failed to fetch batches.", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Error fetching batches.", "error");
      } finally {
        setLoadingBatches(false);
      }
    };

    fetchCourseBatches();
  }, [userToken]);

  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return "";

    const errors = [];

    if (rules.required) {
      if (name === "banner") {
        // For banner, check if bannerUrl exists
        if (!newModule.bannerUrl && !newModule.banner) {
          errors.push(rules.message.required);
        }
      } else if (!value || value.trim() === "") {
        errors.push(rules.message.required);
      }
    }

    if (rules.minLength && value && value.trim().length < rules.minLength) {
      errors.push(rules.message.minLength);
    }

    if (rules.maxLength && value && value.trim().length > rules.maxLength) {
      errors.push(rules.message.maxLength);
    }

    if (rules.pattern && value && !rules.pattern.test(value)) {
      errors.push(rules.message.pattern);
    }

    return errors.length > 0 ? errors[0] : "";
  };

  const validateForm = () => {
    const newErrors = {};
    const nameError = validateField("name", newModule.name);
    if (nameError) newErrors.name = nameError;
    const descError = validateField("description", newModule.description);
    if (descError) newErrors.description = descError;
    const batchError = validateField("batchId", newModule.batchId);
    if (batchError) newErrors.batchId = batchError;
    const bannerError = validateField(
      "banner",
      newModule.bannerUrl || newModule.banner,
    );
    if (bannerError) newErrors.banner = bannerError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    return (
      newModule.name.trim().length >= 3 &&
      newModule.description.trim().length >= 10 &&
      newModule.tags.length >= 1 &&
      (newModule.bannerUrl || newModule.banner) &&
      newModule.batchId !== ""
    );
  };

  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validateForm();
    }
  }, [newModule, touched]);

  const handleCreate = () => {
    // Mark all fields as touched
    const allTouched = {
      name: true,
      description: true,
      banner: true,
    };
    setTouched(allTouched);

    // Validate form
    const isValid = validateForm();

    if (!isValid) {
      // Show first error in alert
      const firstErrorField = Object.keys(errors)[0];
      const firstError = errors[firstErrorField];

      // Create error message
      let errorMessage = "Please fix the following errors:";
      Object.entries(errors).forEach(([field, error]) => {
        if (error) {
          errorMessage += `\n• ${
            field.charAt(0).toUpperCase() + field.slice(1)
          }: ${error}`;
        }
      });

      // Show alert
      alert(errorMessage);
      return;
    }

    try {
      const module = {
        ModuleName: newModule.name.trim(),
        ModuleDescription: newModule.description.trim(),
        ModuleImage: newModule.banner || null,
        ModuleImagePath: newModule.bannerPath || null,
        ModuleImageUrl: newModule.bannerUrl || null,
        BatchID: parseInt(newModule.batchId),
        onBackShowSubModule: newModule.onBackShowSubModule,
        subModules: [],
        createdAt: new Date().toISOString(),
        UITypeID: parseInt(newModule.uiTypeId),
        EventID: parseInt(newModule.eventId),
        hasCertificate: newModule.hasCertificate ? 1 : 0,
        quizAccessOnSubModuleCompletion:
          newModule.quizAccessOnSubModuleCompletion ? 1 : 0,
        LMSLevel: newModule.lmsLevel ? parseInt(newModule.lmsLevel) : null,

        LMSUserCategory: newModule.lmsUserCategory
          ? parseInt(newModule.lmsUserCategory)
          : null,

        ModuleTags: newModule.tags.join(","),
      };

      onCreate(module);
      setIsCreated(true);
    } catch (error) {
      console.error("Error creating module:", error);
      setErrors({ submit: "Failed to create module" });
    }
  };

  const handleImageUpload = (uploadResult) => {
    if (!uploadResult || !uploadResult.success) {
      setErrors({
        ...errors,
        banner: uploadResult?.message || "Image upload failed",
      });
      setIsUploading(false);
      return;
    }

    const { filePath } = uploadResult;

    if (!filePath) {
      setErrors({ ...errors, banner: "No file path received from server" });
      setIsUploading(false);
      return;
    }

    // Clean and construct URL
    const baseUploadsUrl = import.meta.env.VITE_API_UPLOADSURL;
    const cleanFilePath = filePath.replace(/^\/+/, "");
    const imageUrl = `${baseUploadsUrl}/${cleanFilePath}`;

    // Store ONLY the file path string, not the entire object
    setNewModule((prev) => ({
      ...prev,
      bannerPath: cleanFilePath,
      bannerUrl: imageUrl,
      banner: {
        success: uploadResult.success,
        filePath: cleanFilePath,
        fileName: uploadResult.fileName,
        fileSize: uploadResult.fileSize,
      },
    }));

    // Mark banner as touched and clear error
    setTouched((prev) => ({ ...prev, banner: true }));
    setErrors((prev) => ({ ...prev, banner: null }));

    setIsUploading(false);
  };

  const handleRemoveImage = () => {
    setNewModule((prev) => ({
      ...prev,
      banner: null,
      bannerPath: null,
      bannerUrl: null,
    }));

    // Set error if banner was required
    setErrors((prev) => ({ ...prev, banner: "Banner image is required" }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();

      let value = newModule.tagInput.trim();

      if (!value) return;

      // Auto add #
      if (!value.startsWith("#")) {
        value = `#${value}`;
      }

      // Remove spaces
      value = value.replace(/\s+/g, "");

      // Prevent duplicates
      if (newModule.tags.includes(value)) return;

      setNewModule((prev) => ({
        ...prev,
        tags: [...prev.tags, value],
        tagInput: "",
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setNewModule((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewModule((prev) => ({ ...prev, [name]: value }));

    // Mark field as touched
    if (!touched[name]) {
      setTouched((prev) => ({ ...prev, [name]: true }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    if (!touched[name]) {
      setTouched((prev) => ({ ...prev, [name]: true }));
    }
  };

  // Character counter component
  const CharacterCounter = ({ value, maxLength, fieldName }) => {
    if (!maxLength) return null;

    const currentLength = value?.trim().length || 0;
    const isNearLimit = currentLength > maxLength * 0.8;
    const isExceeding = currentLength > maxLength;

    return (
      <div
        className={`text-xs mt-1 ${
          isExceeding
            ? "text-red-500 font-semibold"
            : isNearLimit
              ? "text-yellow-500"
              : "text-gray-500"
        }`}
      >
        {currentLength}/{maxLength} characters
        {isExceeding && <span className="ml-2">(Exceeds limit!)</span>}
      </div>
    );
  };

  // Render validation error
  const renderError = (fieldName) => {
    if (errors[fieldName] && touched[fieldName]) {
      return (
        <div className="flex items-center mt-1 text-red-500 text-sm">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {errors[fieldName]}
        </div>
      );
    }
    return null;
  };

  if (isCreated) {
    const allModules = [
      ...existingModules,
      {
        ...newModule,
        banner:
          newModule.bannerUrl ||
          (newModule.banner ? URL.createObjectURL(newModule.banner) : null),
        subModules: [],
        createdAt: new Date().toISOString(),
      },
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-4xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-green-50 p-6 rounded-xl border border-green-200">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Module Created Successfully!
              </h3>
              <p className="text-gray-600">
                Your new learning module is ready for content
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setIsCreated(false);
                  setNewModule({
                    id: uuidv4(),
                    name: "",
                    description: "",
                    banner: null,
                    bannerPath: null,
                    bannerUrl: null,
                    batchId: "",
                  });
                }}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-200 font-medium"
              >
                Create Another
              </button>
              <button
                onClick={onCancel}
                className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 active:scale-95 transition-all duration-200 font-medium"
              >
                Back to Modules
              </button>
            </div>
          </div>
        </motion.div>

        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          Your Modules
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allModules.map((module) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                {(module.bannerUrl || module.banner) && (
                  <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-lg border">
                    <img
                      src={
                        module.bannerUrl ||
                        (module.banner && typeof module.banner !== "string"
                          ? URL.createObjectURL(module.banner)
                          : module.banner)
                      }
                      alt={module.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-image.png"; // Add a fallback
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {module.name}
                  </h3>
                  {module.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {module.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {module.subModules?.length || 0} submodules
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(module.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  const groupedBatches = batchOptions.reduce((acc, batch) => {
    const group = batch.batch_Group || "Others";

    if (!acc[group]) {
      acc[group] = [];
    }

    acc[group].push(batch);
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto bg-white rounded-[32px] border border-gray-200 shadow-[0_10px_50px_rgba(0,0,0,0.08)] overflow-hidden"
    >
      {/* HEADER */}
      <div className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50 px-8 py-7">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-100 blur-3xl opacity-40" />

        <div className="relative flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Create New Module
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Configure your LMS module, assign batches, UI type, access
              permissions, and learning settings.
            </p>
          </div>

          <div className="hidden md:flex h-16 w-16 rounded-2xl bg-white shadow-md items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* BASIC INFO */}
        <div className="bg-gray-50/70 border border-gray-100 rounded-3xl p-7 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Basic Information
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Define the module title and description.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* MODULE NAME */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Module Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="name"
                placeholder="e.g. Introduction to Artificial Intelligence"
                value={newModule.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full rounded-2xl border px-4 py-3.5 text-sm transition-all duration-200 focus:outline-none ${
                  errors.name && touched.name
                    ? "border-red-300 bg-red-50 focus:ring-4 focus:ring-red-100"
                    : "border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                }`}
              />

              {renderError("name")}
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Module Description <span className="text-red-500">*</span>
              </label>

              <textarea
                name="description"
                placeholder="Describe what learners will gain from this module..."
                value={newModule.description}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full rounded-2xl border px-4 py-3.5 h-32 text-sm transition-all duration-200 focus:outline-none ${
                  errors.description && touched.description
                    ? "border-red-300 bg-red-50 focus:ring-4 focus:ring-red-100"
                    : "border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                }`}
              />

              {renderError("description")}
            </div>
          </div>
          {/* TAGS SECTION */}
          <div className="bg-gray-50/70 border border-gray-100 rounded-3xl p-7 space-y-5">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Module Tags
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Add tags related to this module for AI recommendations, smart
                  search, filtering, and discoverability.
                </p>
              </div>

              <div
                className={`px-4 py-2 rounded-2xl text-sm font-semibold ${
                  newModule.tags.length >= 3
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {newModule.tags.length}/3 Minimum Tags
              </div>
            </div>

            {/* TAG INPUT CONTAINER */}
            <div
              className={`rounded-3xl border-2 bg-white p-4 transition-all duration-300 ${
                newModule.tags.length < 3
                  ? "border-yellow-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100"
                  : "border-green-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100"
              }`}
            >
              {/* TAGS */}
              <div className="flex flex-wrap gap-3 mb-3">
                {newModule.tags.map((tag, index) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-2xl shadow-md hover:shadow-lg transition-all"
                  >
                    <span className="text-sm font-medium">{tag}</span>

                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="h-5 w-5 rounded-full bg-white/20 hover:bg-red-500 flex items-center justify-center transition-all"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* INPUT */}
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  #
                </div>

                <input
                  type="text"
                  value={newModule.tagInput}
                  placeholder="Type a tag and press Enter (e.g. AI, React, MachineLearning)"
                  onChange={(e) =>
                    setNewModule((prev) => ({
                      ...prev,
                      tagInput: e.target.value,
                    }))
                  }
                  onKeyDown={handleTagKeyDown}
                  className="flex-1 border-none bg-transparent outline-none text-sm placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* QUICK SUGGESTIONS */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-3">
                Suggested Tags
              </p>

              <div className="flex flex-wrap gap-2">
                {[
                  "#AI",
                  "#MachineLearning",
                  "#DeepLearning",
                  "#React",
                  "#Python",
                  "#NVIDIA",
                  "#DataScience",
                  "#ComputerVision",
                  "#Cloud",
                  "#LMS",
                ].map((suggestedTag) => (
                  <button
                    key={suggestedTag}
                    type="button"
                    onClick={() => {
                      if (!newModule.tags.includes(suggestedTag)) {
                        setNewModule((prev) => ({
                          ...prev,
                          tags: [...prev.tags, suggestedTag],
                        }));
                      }
                    }}
                    className="px-4 py-2 rounded-2xl border border-gray-200 bg-white text-sm text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
                  >
                    {suggestedTag}
                  </button>
                ))}
              </div>
            </div>

            {/* HELP TEXT */}
            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  ℹ
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-blue-800">
                    Why tags matter?
                  </h4>

                  <p className="text-sm text-blue-700 mt-1 leading-relaxed">
                    Tags improve module discoverability, AI recommendations,
                    semantic search, trending systems, and personalized learning
                    experiences inside the LMS.
                  </p>
                </div>
              </div>
            </div>

            {/* ERROR */}
            {newModule.tags.length < 1 && (
              <div className="flex items-center gap-2 text-sm text-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Please add at least 1 tags to continue
              </div>
            )}
          </div>
        </div>

        {/* MEDIA */}
        <div className="bg-gray-50/70 border border-gray-100 rounded-3xl p-7 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Banner & Media
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Upload a visually appealing banner for the module.
            </p>
          </div>

          <div className="rounded-3xl border-2 border-dashed border-blue-200 bg-blue-50/40 p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Banner Image <span className="text-red-500">*</span>
            </label>

            <p className="text-xs text-blue-500 mb-4">
              Recommended: 800×400px • Max Size: 200KB
            </p>

            {newModule.bannerUrl || newModule.banner ? (
              <div className="relative">
                <img
                  src={
                    newModule.bannerUrl ||
                    (newModule.banner && typeof newModule.banner !== "string"
                      ? URL.createObjectURL(newModule.banner)
                      : newModule.banner)
                  }
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-2xl border border-gray-200"
                />

                <button
                  onClick={handleRemoveImage}
                  type="button"
                  className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all"
                >
                  ✕
                </button>
              </div>
            ) : (
              <FileUploader
                moduleName="LMS"
                folderName="module-banners"
                onUploadComplete={handleImageUpload}
                accept="image/*"
                maxSize={200 * 1024}
                label="Upload Banner Image"
                previewType="image"
              />
            )}

            {renderError("banner")}
          </div>
        </div>

        {/* CONFIGURATION */}
        <div className="bg-gray-50/70 border border-gray-100 rounded-3xl p-7 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Learning Configuration
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Configure batches, UI types, levels, and accessibility.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* BATCH */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Batch
              </label>

              <select
                name="batchId"
                value={newModule.batchId}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
              >
                <option value="">
                  {loadingBatches ? "Loading batches..." : "-- Select Batch --"}
                </option>

                {Object.entries(groupedBatches).map(([group, batches]) => (
                  <optgroup key={group} label={group}>
                    {batches.map((batch) => (
                      <option key={batch.batch_ID} value={batch.batch_ID}>
                        {batch.batch_Name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* EVENT */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Event
              </label>

              <select
                name="eventId"
                value={newModule.eventId}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
              >
                <option value="">
                  {loadingEvents ? "Loading Events..." : "-- Select Event --"}
                </option>

                {eventOptions.map((event) => (
                  <option key={event.EventID} value={event.EventID}>
                    {event.EventName}
                  </option>
                ))}
              </select>
            </div>

            {/* UI TYPE */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select UI Type
              </label>

              <select
                name="uiTypeId"
                value={newModule.uiTypeId}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
              >
                <option value="">
                  {loadingUiTypes
                    ? "Loading UI Types..."
                    : "-- Select UI Type --"}
                </option>

                {uiTypeOptions.map((ui) => (
                  <option key={ui.UITypeID} value={ui.UITypeID}>
                    {ui.UIName}
                  </option>
                ))}
              </select>
            </div>

            {/* LMS LEVEL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select LMS Level
              </label>

              <select
                name="lmsLevel"
                value={newModule.lmsLevel}
                onChange={handleInputChange}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
              >
                <option value="">
                  {loadingLmsLevels
                    ? "Loading LMS Levels..."
                    : "-- Select LMS Level --"}
                </option>

                {lmsLevels.map((level) => (
                  <option key={level.idCode} value={level.idCode}>
                    {level.ddValue}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* USER CATEGORY */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select LMS User Category
            </label>

            <select
              name="lmsUserCategory"
              value={newModule.lmsUserCategory}
              onChange={handleInputChange}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
            >
              <option value="">
                {loadingLmsUserCategories
                  ? "Loading Categories..."
                  : "-- Select User Category --"}
              </option>

              {lmsUserCategories.map((category) => (
                <option key={category.idCode} value={category.idCode}>
                  {category.ddValue}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-gray-50/70 border border-gray-100 rounded-3xl p-6 space-y-5">
          {/* HEADER */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Access & Controls
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Configure module accessibility and learning behavior.
              </p>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* CERTIFICATE */}
            <label className="group flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-4 cursor-pointer hover:border-green-300 hover:shadow-sm transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-green-600 group-hover:scale-105 transition-all">
                🎓
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-semibold text-gray-800 text-sm">
                    Certificate
                  </h4>

                  <input
                    type="checkbox"
                    checked={newModule.hasCertificate}
                    onChange={(e) =>
                      setNewModule((prev) => ({
                        ...prev,
                        hasCertificate: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-green-600"
                  />
                </div>

                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Generate certificates after completion.
                </p>
              </div>
            </label>

            {/* QUIZ */}
            <label className="group flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-4 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 group-hover:scale-105 transition-all">
                🧠
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-semibold text-gray-800 text-sm">
                    Quiz Unlock
                  </h4>

                  <input
                    type="checkbox"
                    checked={newModule.quizAccessOnSubModuleCompletion}
                    onChange={(e) =>
                      setNewModule((prev) => ({
                        ...prev,
                        quizAccessOnSubModuleCompletion: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-blue-600"
                  />
                </div>

                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Unlock quiz after submodule completion.
                </p>
              </div>
            </label>

            {/* BACK */}
            <label className="group flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-4 cursor-pointer hover:border-indigo-300 hover:shadow-sm transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-105 transition-all">
                ↩
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-semibold text-gray-800 text-sm">
                    Smart Back
                  </h4>

                  <input
                    type="checkbox"
                    checked={newModule.onBackShowSubModule === 1}
                    onChange={(e) =>
                      setNewModule((prev) => ({
                        ...prev,
                        onBackShowSubModule: e.target.checked ? 1 : 0,
                      }))
                    }
                    className="h-4 w-4 accent-indigo-600"
                  />
                </div>

                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Show submodules while navigating back.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* FOOTER */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 pt-6 flex justify-end gap-4">
          <button
            onClick={onCancel}
            type="button"
            className="px-6 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={!isFormValid() || isUploading}
            className={`px-7 py-3 rounded-2xl text-white font-semibold shadow-lg transition-all duration-300 ${
              !isFormValid() || isUploading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] hover:shadow-blue-200"
            }`}
          >
            {isUploading ? "Uploading..." : "Create Module"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ModuleCreatorNew;
