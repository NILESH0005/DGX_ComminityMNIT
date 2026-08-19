import React from "react";
import { motion } from "framer-motion";
import { useDropdownData } from "../hooks/useDropdownData";
import { useModuleForm } from "../hooks/useModuleForm";

import ModuleHeader from "./ModuleHeader";
import BasicInfoSection from "./BasicInfoSection";
import TagsSection from "./TagsSection";
import BannerSection from "./BannerSection";
import ConfigurationSection from "./ConfigurationSection";
import AccessControlsSection from "./AccessControlsSection";
import FooterActions from "./FooterActions";
import ModuleSuccessView from "./ModuleSuccessView";

const ModuleCreator = ({
  mode = "create",
  module = null,
  onCreate,
  onUpdate,
  onCancel,
  existingModules = [],
}) => {
  const {
    newModule,
    setNewModule,
    errors,
    touched,
    isUploading,
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
  } = useModuleForm(existingModules, module, mode);

  const {
    groupedBatches,
    loadingBatches,
    uiTypeOptions,
    loadingUiTypes,
    eventOptions,
    loadingEvents,
    lmsLevels,
    loadingLmsLevels,
    lmsUserCategories,
    loadingLmsUserCategories,
  } = useDropdownData();

  if (isCreated) {
    return (
      <ModuleSuccessView
        existingModules={existingModules}
        newModule={newModule}
        onCancel={onCancel}
        onCreateAnother={() => {
          setIsCreated(false);
          resetForm();
        }}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto bg-white rounded-[32px] border border-gray-200 shadow-[0_10px_50px_rgba(0,0,0,0.08)] overflow-hidden"
    >
      <ModuleHeader mode={mode} />

      <div className="p-8 space-y-8">
        <BasicInfoSection
          module={newModule}
          errors={errors}
          touched={touched}
          onChange={handleInputChange}
          onBlur={handleBlur}
        />

        <TagsSection
          module={newModule}
          setNewModule={setNewModule}
          onTagKeyDown={handleTagKeyDown}
          removeTag={removeTag}
        />

        <BannerSection
          module={newModule}
          errors={errors}
          touched={touched}
          onImageUpload={handleImageUpload}
          onRemoveImage={handleRemoveImage}
        />

        <ConfigurationSection
          groupedBatches={groupedBatches}
          loadingBatches={loadingBatches}
          uiTypeOptions={uiTypeOptions}
          loadingUiTypes={loadingUiTypes}
          eventOptions={eventOptions}
          loadingEvents={loadingEvents}
          lmsLevels={lmsLevels}
          loadingLmsLevels={loadingLmsLevels}
          lmsUserCategories={lmsUserCategories}
          loadingLmsUserCategories={loadingLmsUserCategories}
          module={newModule}
          onChange={handleInputChange}
        />

        <AccessControlsSection module={newModule} setNewModule={setNewModule} />

        <FooterActions
          onCancel={onCancel}
          onCreate={() =>
            mode === "edit" ? handleUpdate(onUpdate) : handleCreate(onCreate)
          }
          buttonText={mode === "edit" ? "Update Module" : "Create Module"}
          isFormValid={isFormValid()}
          isUploading={isUploading}
        />
      </div>
    </motion.div>
  );
};

export default ModuleCreator;
