import React, { useState, useContext, useEffect } from "react";
import ApiContext from "../../../../context/ApiContext";

const BadgePreview = ({ badge, onClose, onBadgeUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editedBadgeName, setEditedBadgeName] = useState(
    badge?.BadgeName || "",
  );
  const [previewUrl, setPreviewUrl] = useState(badge.BadgeIcon || null);
  const [uploading, setUploading] = useState(false);
  const [validationError, setValidationError] = useState(null);

  // ✅ New state for image history
  const [imageHistory, setImageHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [masterImage, setMasterImage] = useState(null);

  const { fetchData, userToken } = useContext(ApiContext);

  if (!badge) return null;

  // ✅ Fetch image history when editing starts
  useEffect(() => {
    console.log(
      "🔍 useEffect triggered - isEditing:",
      isEditing,
      "badge.isAssigned:",
      badge?.isAssigned,
    );
    if (isEditing && badge?.isAssigned) {
      console.log("📸 Fetching image history...");
      fetchImageHistory();
    }
  }, [isEditing, badge?.isAssigned, badge?.BadgeID, badge?.ModuleID]);

  // ✅ Fetch image history function with debug logs
  const fetchImageHistory = async () => {
    if (!badge.isAssigned || !badge.BadgeID || !badge.ModuleID) {
      console.log("⚠️ Cannot fetch history - missing data:", {
        isAssigned: badge.isAssigned,
        BadgeID: badge.BadgeID,
        ModuleID: badge.ModuleID,
      });
      return;
    }

    // console.log("📤 Fetching image history for:", {
    //   badgeId: badge.BadgeID,
    //   moduleId: badge.ModuleID,
    //   userToken: userToken ? "Present" : "Missing",
    // });

    setLoadingHistory(true);
    try {
      const endpoint = `badgesapi/badge-image-history?badgeId=${badge.BadgeID}&moduleId=${badge.ModuleID}`;
      console.log("🌐 Calling endpoint:", endpoint);

      const result = await fetchData(
        endpoint,
        "GET",
        {},
        { "auth-token": userToken },
      );

      console.log("📸 Image history response:", result);

      if (result?.success) {
        console.log("✅ History data:", result.data);
        const images = [];

        // Master Image
        if (result.data?.master) {
          images.push({
            id: "master",
            BadgeImage: result.data.master.BadgeImage.startsWith("data:")
              ? result.data.master.BadgeImage
              : `data:image/png;base64,${result.data.master.BadgeImage}`,
            BadgeName: result.data.master.BadgeName,
            type: "master",
            isActive: true,
          });
        }

        // History Images
        if (result.data?.history?.length) {
          result.data.history.forEach((item) => {
            images.push({
              ...item,
              BadgeImage: item.BadgeImage.startsWith("data:")
                ? item.BadgeImage
                : `data:image/png;base64,${item.BadgeImage}`,
              type: "history",
              isActive: item.isActive,
            });
          });
        }

        console.log(images);
        setImageHistory(images);
      } else {
        console.log("❌ Failed to fetch history:", result?.message);
        setImageHistory([]);
        setMasterImage(null);
      }
    } catch (error) {
      console.error("❌ Error fetching image history:", error);
      setImageHistory([]);
      setMasterImage(null);
    } finally {
      setLoadingHistory(false);
    }
  };

  // ✅ Validate file before upload
  const validateFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setValidationError("Only JPG, JPEG, and PNG files are allowed.");
      return false;
    }

    const maxSize = 200 * 1024;
    if (file.size > maxSize) {
      setValidationError("File size must be less than 200KB.");
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (validateFile(file)) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        e.target.value = "";
        setSelectedFile(null);
      }
    }
  };

  const handleSaveChanges = async () => {
    if (!editedBadgeName.trim()) {
      setValidationError("Badge name is required.");
      return;
    }

    setUploading(true);

    try {
      const updatedBadge = {
        ...badge,
        BadgeName: editedBadgeName.trim(),
        BadgeIcon: previewUrl,
        BadgeImage: previewUrl,
        isCustomImage: selectedFile ? true : badge.isCustomImage,
      };

      console.log("💾 Saving badge:", updatedBadge);

      if (onBadgeUpdate) {
        onBadgeUpdate(updatedBadge);
      }

      setIsEditing(false);
      setSelectedFile(null);
      setValidationError(null);
    } catch (error) {
      console.error("Error saving badge:", error);
    } finally {
      setUploading(false);
    }
  };

  // ✅ Handle selecting a historical image
  const handleSelectHistoryImage = async (historyItem) => {
    // Confirm with user
    const confirm = window.confirm(
      `Apply the image from ${new Date(historyItem.uploadedAt).toLocaleDateString()}?`,
    );

    if (!confirm) return;

    // Update preview
    setPreviewUrl(historyItem.BadgeImage);
    setSelectedFile(null);
    setShowHistory(false);

    // Create updated badge
    const updatedBadge = {
      ...badge,
      BadgeName: editedBadgeName.trim(),
      BadgeIcon: historyItem.BadgeImage,
      BadgeImage: historyItem.BadgeImage,
      isCustomImage: true,
    };

    // Update locally
    if (onBadgeUpdate) {
      onBadgeUpdate(updatedBadge);
    }

    // Optionally save to server
    try {
      // Convert base64 to blob for upload
      const response = await fetch(historyItem.BadgeImage);
      const blob = await response.blob();
      const file = new File([blob], `badge-${badge.BadgeID}-history.jpg`, {
        type: "image/jpeg",
      });

      const formData = new FormData();
      formData.append("badgeId", badge.BadgeID);
      formData.append("moduleId", badge.ModuleID);
      formData.append("badgeImage", file);
      formData.append("badgeName", editedBadgeName.trim());

      await fetchData(
        "badges/update-badge-image",
        "POST",
        formData,
        {
          "auth-token": userToken,
        },
        true,
      );
      console.log("✅ History image applied successfully");

      // Refresh history
      await fetchImageHistory();
    } catch (apiError) {
      console.error("Server upload failed, but local image updated:", apiError);
    }

    setIsEditing(false);
  };

  const handleImagePreview = () => {
    if (!selectedFile) return;

    if (!validateFile(selectedFile)) {
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedFile(null);
    setPreviewUrl(badge.BadgeIcon || null);
    setEditedBadgeName(badge.BadgeName || "");
    setValidationError(null);
    setShowHistory(false);
  };

  // ✅ Toggle history visibility
  const toggleHistory = () => {
    console.log("🔄 Toggle history clicked, current state:", showHistory);
    setShowHistory(!showHistory);
    if (!showHistory && imageHistory.length === 0) {
      console.log("📸 Fetching history on toggle...");
      fetchImageHistory();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h5 className="text-lg font-bold">Badge Preview</h5>
          <div className="flex items-center gap-2">
            {!isEditing && badge.isAssigned && (
              <button
                onClick={() => {
                  console.log("✏️ Edit button clicked");
                  setIsEditing(true);
                }}
                className="text-blue-600 hover:text-blue-800 transition-colors"
                title="Change Badge Image"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 text-center">
          {/* Badge Icon */}
          <div className="mb-4 relative">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={badge.BadgeName}
                className="w-32 h-32 object-contain rounded-full border-2 border-gray-200 p-2 mx-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML = `
                    <div class="w-32 h-32 mx-auto bg-gray-100 rounded-full border-2 border-gray-200 flex items-center justify-center">
                      <svg class="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  `;
                }}
              />
            ) : (
              <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full border-2 border-gray-200 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}

            {/* Edit button overlay */}
            {!isEditing && badge.isAssigned && (
              <button
                onClick={() => {
                  console.log("✏️ Edit button clicked (overlay)");
                  setIsEditing(true);
                }}
                className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 shadow-lg hover:bg-blue-700 transition-colors"
                title="Change Badge Image"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Custom Image Indicator */}
          {badge.isCustomImage && (
            <div className="mb-3">
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                Custom Image
              </span>
            </div>
          )}

          {/* Edit Mode */}
          {isEditing && badge.isAssigned && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Badge Name
                </label>

                <input
                  type="text"
                  value={editedBadgeName}
                  onChange={(e) => setEditedBadgeName(e.target.value)}
                  maxLength={150}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter badge name"
                />
              </div>
              <h6 className="text-sm font-semibold mb-2">Change Badge Image</h6>

              <div className="flex flex-col items-center gap-3">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />

                {validationError && (
                  <div className="w-full bg-red-50 border border-red-200 text-red-600 text-sm p-2 rounded-lg">
                    ⚠️ {validationError}
                  </div>
                )}

                {selectedFile && !validationError && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{selectedFile.name}</span>
                    <span className="text-gray-400">
                      ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                )}

                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!selectedFile) {
                        setValidationError("Please select an image first.");
                        return;
                      }

                      setValidationError(null);
                    }}
                    disabled={uploading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    Image Selected
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>

                {/* ✅ IMAGE HISTORY SECTION */}
                <div className="w-full mt-4 border-t border-gray-200 pt-4">
                  <button
                    onClick={toggleHistory}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {showHistory
                      ? "Hide Previous Images"
                      : "Show Previous Images"}
                    {imageHistory.length > 0 && (
                      <span className="text-xs text-gray-400 ml-1">
                        ({imageHistory.length})
                      </span>
                    )}
                  </button>

                  {showHistory && (
                    <div className="mt-3">
                      {loadingHistory ? (
                        <div className="flex justify-center py-4">
                          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : imageHistory.length === 0 ? (
                        <p className="text-sm text-gray-400 py-2">
                          No previous images found
                        </p>
                      ) : (
                        <>
                          {/* History Images Grid */}
                          <div className="grid grid-cols-4 gap-2">
                            {imageHistory.map((item, index) => (
                              <div
                                key={item.id || index}
                                className="relative group cursor-pointer"
                                onClick={() => handleSelectHistoryImage(item)}
                              >
                                <img
                                  src={item.BadgeImage}
                                  alt={`Previous ${index + 1}`}
                                  className="w-16 h-16 object-contain rounded-lg border-2 border-gray-200 hover:border-green-500 transition-all"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = "none";
                                  }}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-lg transition-all flex items-center justify-center">
                                  <span className="text-white text-[8px] font-bold opacity-0 group-hover:opacity-100">
                                    Use
                                  </span>
                                </div>
                                <div className="absolute -top-1 -right-1 bg-gray-500 text-white text-[8px] rounded-full w-5 h-5 flex items-center justify-center">
                                  {index + 1}
                                </div>
                                {item.isActive && (
                                  <div className="absolute -bottom-1 -left-1 bg-green-500 text-white text-[6px] rounded px-1">
                                    Active
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          <p className="text-xs text-gray-400 mt-2">
                            💡 Click on any previous image to apply it instantly
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* File Requirements Info */}
                <div className="w-full text-xs text-gray-400 text-left">
                  <p>📌 Requirements:</p>
                  <ul className="list-disc list-inside ml-2">
                    <li>Only JPG, JPEG, and PNG files</li>
                    <li>Maximum file size: 200KB</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Badge Details */}
          <h4 className="text-xl font-bold">{badge.BadgeName}</h4>
          <p className="text-gray-600 mt-1">
            {badge.BadgeDescription || "AI achievement unlocked."}
          </p>

          {badge.BadgeCategory && (
            <div className="mt-2">
              <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-600">
                {badge.BadgeCategory}
              </span>
            </div>
          )}

          {/* Assignment info */}
          {badge.isAssigned && (
            <div className="mt-3 text-xs text-gray-400 border-t border-gray-100 pt-3">
              <span>
                Assigned on:{" "}
                {new Date(badge.assignedAt || Date.now()).toLocaleString(
                  "en-US",
                  {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  },
                )}
              </span>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
          <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={uploading}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={uploading || !editedBadgeName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgePreview;
