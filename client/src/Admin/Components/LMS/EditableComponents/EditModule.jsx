import React, { useState, useRef, useEffect, useContext } from "react";
import Noimage from "../../../../../public/images";
import {
  FaEdit,
  FaTrash,
  FaFolder,
  FaAngleDown,
  FaAngleUp,
} from "react-icons/fa";
import { Tooltip as ReactTooltip } from "react-tooltip";
import ApiContext from "../../../../context/ApiContext";
import ModuleApprovalCard from "./ModuleApprovalCard";

const EditModule = ({
  module,
  onDelete,
  onEdit,
  batches = [],
  onViewSubmodules,
  onApprovalUpdated,
  isApprovalView = false,
  currentUserID,
}) => {
  // console.log("whos lms is it ", currentUserID);
  const [editedModule, setEditedModule] = useState(module);
  const [imagePreview, setImagePreview] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const descriptionRef = useRef(null);
  const [isDescriptionClamped, setIsDescriptionClamped] = useState(false);
  const { userToken, fetchData, user } = useContext(ApiContext);

  const baseUploadsUrl = import.meta.env.VITE_API_UPLOADSURL;

  useEffect(() => {
    setEditedModule(module);

    const baseUploadsUrl = import.meta.env.VITE_API_UPLOADSURL;

    // ✅ PRIORITY 1: Path (CORRECT SOURCE)
    if (module.ModuleImagePath && typeof module.ModuleImagePath === "string") {
      const cleanPath = module.ModuleImagePath.replace(/^\/+/, "");
      setImagePreview(`${baseUploadsUrl}/${cleanPath}`);
      return;
    }

    // ⚠️ PRIORITY 2: Base64
    if (
      module.ModuleImage?.data &&
      typeof module.ModuleImage.data === "string"
    ) {
      setImagePreview(
        `data:${module.ModuleImage.contentType || "image/jpeg"};base64,${
          module.ModuleImage.data
        }`,
      );
      return;
    }

    // ⚠️ PRIORITY 3: URL (ONLY fallback, and FIX it)
    if (module.ModuleImageUrl && typeof module.ModuleImageUrl === "string") {
      let fixedUrl = module.ModuleImageUrl;

      if (fixedUrl.includes("localhost")) {
        fixedUrl = fixedUrl.replace("http://localhost:6020", baseUploadsUrl);
      }

      setImagePreview(fixedUrl);
      return;
    }

    setImagePreview(null);
  }, [module]);

  useEffect(() => {
    if (descriptionRef.current) {
      const element = descriptionRef.current;
      setIsDescriptionClamped(element.scrollHeight > element.clientHeight);
    }
  }, [editedModule.ModuleDescription]);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700 border-green-300";

      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";

      case "Rejected":
        return "bg-red-100 text-red-700 border-red-300";

      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-[28px] overflow-hidden border border-gray-200 dark:border-gray-700 shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_40px_rgba(59,130,246,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {imagePreview ? (
        <div className="relative w-full h-60 overflow-hidden">
          <img
            src={imagePreview}
            alt={editedModule.ModuleName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      ) : (
        <div className="h-60 flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800">
          <img src={Noimage} alt="No Image" className="max-h-20 opacity-70" />
        </div>
      )}
      <div className="p-5 sm:p-6 flex-grow flex flex-col">
        {" "}
        <div className="flex-grow">
          <>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">
              {editedModule.ModuleName}
            </h3>

            <ModuleApprovalCard
              module={module}
              fetchData={fetchData}
              userToken={userToken}
              isApprovalView={isApprovalView}
              onViewSubmodules={onViewSubmodules}
              currentUserID={currentUserID}
              onApprovalUpdated={(updatedApproval) => {
                const updatedModule = {
                  ...editedModule,
                  ...updatedApproval,
                  ModuleID: editedModule.ModuleID,

                  ApprovalStatus:
                    updatedApproval.ApprovalStatus || updatedApproval.Status,
                  ApprovalRemark:
                    updatedApproval.ApprovalRemark || updatedApproval.Remark,
                  ApprovalUserName: updatedApproval.ApprovalUserName,
                  ApprovalUserID: updatedApproval.ApprovalUserID,
                  ApprovalDate: updatedApproval.ApprovalDate,
                  ApprovalUpdatedOn: updatedApproval.ApprovalUpdatedOn,
                };
                setEditedModule(updatedModule);

                onApprovalUpdated?.(updatedModule);
              }}
            />
            <div className="prose dark:prose-invert max-w-none mb-2">
              <div
                ref={descriptionRef}
                className={`text-gray-600 dark:text-gray-300 whitespace-pre-line text-sm sm:text-base ${
                  !showFullDescription ? "line-clamp-3" : ""
                }`}
              >
                {editedModule.ModuleDescription || "No description provided"}
              </div>
              {(isDescriptionClamped || showFullDescription) && (
                <button
                  onClick={toggleDescription}
                  className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm mt-1 flex items-center"
                >
                  {showFullDescription ? (
                    <>
                      <FaAngleUp className="mr-1" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <FaAngleDown className="mr-1" />
                      Read More
                    </>
                  )}
                </button>
              )}
            </div>
            {/* MODULE META INFO */}
            <div className="mt-4 space-y-4">
              {/* LEVEL + CATEGORY */}
              <div className="flex flex-wrap gap-2">
                {editedModule.LMSLevelName && (
                  <div className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-xs font-semibold shadow-sm">
                    🚀 {editedModule.LMSLevelName}
                  </div>
                )}

                {editedModule.LMSUserCategoryName && (
                  <div className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-semibold shadow-sm">
                    👥 {editedModule.LMSUserCategoryName}
                  </div>
                )}

                {editedModule.hasCertificate === 1 && (
                  <div className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-semibold shadow-sm">
                    🎓 Certificate
                  </div>
                )}

                {editedModule.quizAccessOnSubModuleCompletion === 1 && (
                  <div className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-semibold shadow-sm">
                    🧠 Quiz Enabled
                  </div>
                )}
              </div>

              {/* TAGS */}
              {editedModule.ModuleTags && (
                <div className="flex flex-wrap gap-2">
                  {editedModule.ModuleTags.split(",").map((tag, index) => (
                    <div
                      key={index}
                      className="px-3 py-1 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900 transition-all"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              )}

              {/* EXTRA INFO */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-blue-50 dark:bg-blue-900/20 p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Sort Order
                  </p>

                  <p className="text-sm font-bold text-blue-700 dark:text-blue-300">
                    #{editedModule.SortingOrder}
                  </p>
                </div>

                {/* <div className="rounded-2xl bg-purple-50 dark:bg-purple-900/20 p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Batch ID
                    </p>

                    <p className="text-sm font-bold text-purple-700 dark:text-purple-300">
                      {editedModule.BatchID || "N/A"}
                    </p>
                  </div> */}
              </div>
            </div>
          </>
        </div>
        {!isApprovalView && (
          <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => onEdit(module)}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center"
              data-tooltip-id="edit-tooltip"
              data-tooltip-content="Edit Module"
            >
              <FaEdit size={14} />
            </button>
            <button
              onClick={() => onDelete(editedModule.ModuleID)}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 flex items-center justify-center"
              data-tooltip-id="delete-tooltip"
              data-tooltip-content="Delete Module"
            >
              <FaTrash size={14} />
            </button>
            {onViewSubmodules && (
              <button
                onClick={() => onViewSubmodules(editedModule.ModuleID)}
                className="p-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors duration-200 flex items-center justify-center"
                data-tooltip-id="submodules-tooltip"
                data-tooltip-content="View Submodules"
              >
                <FaFolder size={14} />
              </button>
            )}
          </div>
        )}
      </div>
      <ReactTooltip id="edit-tooltip" place="top" effect="solid" />
      <ReactTooltip id="delete-tooltip" place="top" effect="solid" />
      <ReactTooltip id="submodules-tooltip" place="top" effect="solid" />
      <ReactTooltip id="edit-image-tooltip" place="top" effect="solid" />
    </div>
  );
};

export default EditModule;
