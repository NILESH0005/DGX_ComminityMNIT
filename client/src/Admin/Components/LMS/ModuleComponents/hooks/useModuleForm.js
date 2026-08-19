import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export const useModuleForm = (
  existingModules = [],
  module = null,
  mode = "create",
) => {
  const [isCreated, setIsCreated] = useState(false);
  // const [newModule, setNewModule] = useState(defaultModule);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  const defaultModule = {
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
    onBackShowSubModule: 0,
    isBadgeEnabled: false,
    tags: [],
    tagInput: "",
    lmsLevel: "",
    lmsUserCategory: "",
  };
  const [newModule, setNewModule] = useState(defaultModule);

  useEffect(() => {
    if (mode === "edit" && module) {
      console.log("Module received for edit:", module);

      setNewModule({
        id: module.ModuleID,

        name: module.ModuleName || "",

        description: module.ModuleDescription || "",

        banner: module.ModuleImage || null,

        bannerPath: module.ModuleImagePath || null,

        bannerUrl: module.ModuleImageUrl || null,

        batchId: module.BatchID?.toString() || "",

        uiTypeId: module.UITypeID?.toString() || "",

         eventId: module.EventType?.toString() || "",

        hasCertificate: module.hasCertificate === 1,

        quizAccessOnSubModuleCompletion:
          module.quizAccessOnSubModuleCompletion === 1,

        onBackShowSubModule: module.onBackShowSubModule === 1,

        isBadgeEnabled: module.isBadgeEnabled === 1,

        tags: module.ModuleTags ? module.ModuleTags.split(",") : [],

        tagInput: "",

        lmsLevel: module.LMSLevel?.toString() || "",

        lmsUserCategory: module.LMSUserCategory?.toString() || "",
      });
    }
  }, [module, mode]);

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

  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return "";

    const errors = [];

    if (rules.required) {
      if (name === "banner") {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewModule((prev) => ({ ...prev, [name]: value }));
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

    const baseUploadsUrl = import.meta.env.VITE_API_UPLOADSURL;
    const cleanFilePath = filePath.replace(/^\/+/, "");
    const imageUrl = `${baseUploadsUrl}/${cleanFilePath}`;

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
    setErrors((prev) => ({ ...prev, banner: "Banner image is required" }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      let value = newModule.tagInput.trim();
      if (!value) return;
      if (!value.startsWith("#")) value = `#${value}`;
      value = value.replace(/\s+/g, "");
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

  const handleCreate = (onCreate) => {
    const allTouched = { name: true, description: true, banner: true };
    setTouched(allTouched);

    if (!validateForm()) {
      const errorMessage = Object.entries(errors)
        .filter(([_, error]) => error)
        .map(
          ([field, error]) =>
            `• ${field.charAt(0).toUpperCase() + field.slice(1)}: ${error}`,
        )
        .join("\n");

      alert(`Please fix the following errors:\n${errorMessage}`);
      return;
    }

    const module = {
      ModuleName: newModule.name.trim(),
      ModuleDescription: newModule.description.trim(),
      ModuleImage: newModule.banner || null,
      ModuleImagePath: newModule.bannerPath || null,
      ModuleImageUrl: newModule.bannerUrl || null,
      BatchID: parseInt(newModule.batchId),
      onBackShowSubModule: newModule.onBackShowSubModule,
      isBadgeEnabled: newModule.isBadgeEnabled ? 1 : 0, // Added: Badge flag
      subModules: [],
      createdAt: new Date().toISOString(),
      UITypeID: parseInt(newModule.uiTypeId),
      EventID: parseInt(newModule.eventId),
      hasCertificate: newModule.hasCertificate ? 1 : 0,
      quizAccessOnSubModuleCompletion: newModule.quizAccessOnSubModuleCompletion
        ? 1
        : 0,
      LMSLevel: newModule.lmsLevel ? parseInt(newModule.lmsLevel) : null,
      LMSUserCategory: newModule.lmsUserCategory
        ? parseInt(newModule.lmsUserCategory)
        : null,
      ModuleTags: newModule.tags.join(","),
    };

    onCreate(module);
    setIsCreated(true);
  };

  const handleUpdate = (onUpdate) => {
    const allTouched = {
      name: true,
      description: true,
      banner: true,
      batchId: true,
    };

    setTouched(allTouched);

    if (!validateForm()) {
      return;
    }
    const updatedModule = {
      ModuleID: newModule.id,

      ModuleName: newModule.name.trim(),

      ModuleDescription: newModule.description.trim(),

      ModuleImage: newModule.banner,

      ModuleImagePath: newModule.bannerPath,

      ModuleImageUrl: newModule.bannerUrl,

      BatchID: parseInt(newModule.batchId),

      UITypeID: parseInt(newModule.uiTypeId),

      EventID: parseInt(newModule.eventId),

      hasCertificate: newModule.hasCertificate ? 1 : 0,

      quizAccessOnSubModuleCompletion: newModule.quizAccessOnSubModuleCompletion
        ? 1
        : 0,

      onBackShowSubModule: newModule.onBackShowSubModule ? 1 : 0,

      isBadgeEnabled: newModule.isBadgeEnabled ? 1 : 0,

      LMSLevel: newModule.lmsLevel ? parseInt(newModule.lmsLevel) : null,

      LMSUserCategory: newModule.lmsUserCategory
        ? parseInt(newModule.lmsUserCategory)
        : null,

      ModuleTags: newModule.tags.join(","),
    };

    onUpdate(updatedModule);
  };

  const resetForm = () => {
    setNewModule(defaultModule);
    setErrors({});
    setTouched({});
  };

  return {
    newModule,
    setNewModule,
    errors,
    touched,
    isUploading,
    setIsUploading,
    isCreated,
    setIsCreated,
    isFormValid,
    handleInputChange,
    handleBlur,
    handleImageUpload,
    handleRemoveImage,
    handleTagKeyDown,
    removeTag,
    handleCreate,
    handleUpdate,
    resetForm,
    renderError: (fieldName) => {
      if (errors[fieldName] && touched[fieldName]) {
        return errors[fieldName];
      }
      return null;
    },
  };
};
