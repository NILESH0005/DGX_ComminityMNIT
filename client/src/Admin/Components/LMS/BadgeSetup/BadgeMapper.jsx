import React, { useState, useEffect, useContext } from "react";
import ApiContext from "../../../../context/ApiContext";
import AvailableBadges from "./AvailableBadges";
import AssignedBadges from "./AssignedBadges";
import BadgePreview from "./BadgePreview";

// Helper function to convert raw Base64 to data URI
const getBadgeImage = (badgeData) => {
  if (!badgeData) return null;
  if (badgeData.startsWith("data:image")) return badgeData;
  if (badgeData.length > 0) {
    let imageType = "png";
    const firstChars = badgeData.substring(0, 20);
    if (firstChars.includes("/9j/")) imageType = "jpeg";
    else if (firstChars.includes("iVBORw0KGgo")) imageType = "png";
    else if (firstChars.includes("R0lGOD")) imageType = "gif";
    else if (firstChars.includes("UklGR")) imageType = "webp";
    return `data:image/${imageType};base64,${badgeData}`;
  }
  return null;
};

// Transform master badge for AvailableBadges
const transformMasterBadge = (badge) => {
  return {
    BadgeID: badge.id || badge.BadgeID,
    BadgeName: badge.badge_name || badge.BadgeName,
    BadgeIcon: getBadgeImage(badge.badge || badge.BadgeIcon),
    BadgeDescription:
      badge.badge_description ||
      badge.BadgeDescription ||
      "AI achievement unlocked.",
    BadgeCategory: badge.badge_category || badge.BadgeCategory || "General",
    BadgeOrder: badge.badge_order || badge.BadgeOrder || 0,
    isActive: badge.isActive !== undefined ? badge.isActive : true,
    BadgeCode: badge.badge_code || badge.BadgeCode,
    isAssigned: false,
    _original: badge,
  };
};

// ✅ Transform assigned badge - INCLUDES ID
const transformAssignedBadge = (assignment) => {
  console.log("🔍 Transforming assignment:", assignment); // ✅ Debug
  return {
    id: assignment.id || null, // ✅ This MUST be set
    BadgeID: assignment.BadgeID,
    BadgeName: assignment.BadgeName,
    BadgeIcon: getBadgeImage(
      assignment.BadgeImage || assignment.badge || assignment.BadgeIcon,
    ),
    BadgeImage: assignment.BadgeImage || assignment.badge,
    BadgeImagePath: assignment.BadgeImagePath || null,
    BadgeDescription: assignment.BadgeDescription || "AI achievement unlocked.",
    BadgeCategory: assignment.BadgeCategory || "General",
    BadgeOrder: assignment.BadgeOrder || 0,
    isActive: assignment.isActive !== undefined ? assignment.isActive : true,
    BadgeCode: assignment.BadgeCode,
    isAssigned: true,
    isCustomImage: assignment.isCustomImage || false,
    assignedAt:
      assignment.assignedAt || assignment.AddOnDt || new Date().toISOString(),
    ModuleID: assignment.ModuleID,
  };
};

const BadgeMapper = ({ selectedLMS }) => {
  const [allBadges, setAllBadges] = useState([]);
  const [assignedBadges, setAssignedBadges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const { fetchData, userToken } = useContext(ApiContext);

  // ✅ Generate JSON with ID
  const generateAssignedBadgesJSON = () => {
    if (!selectedLMS) return [];

    const result = assignedBadges.map((badge) => ({
      id: badge.id || null,
      ModuleID: Number(selectedLMS.ModuleID),
      BadgeID: Number(badge.BadgeID),

      // ✅ ADD THIS
      BadgeName: badge.BadgeName || null,

      BadgeImage: badge.BadgeImage || badge.BadgeIcon || null,
      BadgeImagePath: badge.BadgeImagePath || null,
      isCustomImage: badge.isCustomImage ? 1 : 0,
    }));

    console.log("📤 Generated JSON with IDs:", JSON.stringify(result, null, 2));

    return result;
  };

  // Log JSON whenever assigned badges change
  useEffect(() => {
    console.log("🔄 assignedBadges changed:", assignedBadges.length);
    if (assignedBadges.length > 0 && selectedLMS) {
      const jsonData = generateAssignedBadgesJSON();
      console.log("📦 LMSBadgeMap JSON:", JSON.stringify(jsonData, null, 2));
      localStorage.setItem("lmsBadgeMapData", JSON.stringify(jsonData));
    } else {
      localStorage.removeItem("lmsBadgeMapData");
    }
  }, [assignedBadges, selectedLMS]);

  // Fetch all master badges
  useEffect(() => {
    const fetchBadges = async () => {
      setLoading(true);
      try {
        const result = await fetchData(
          "badgesapi/badges",
          "GET",
          {},
          { "auth-token": userToken },
        );

        if (result?.success) {
          const transformedBadges = (result.data || []).map(
            transformMasterBadge,
          );
          setAllBadges(transformedBadges);
        }
      } catch (error) {
        console.error("Error fetching badges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, [fetchData, userToken]);

  // Fetch assigned badges for the selected LMS
  // Fetch assigned badges for the selected LMS
  useEffect(() => {
    const fetchAssignedBadges = async () => {
      if (!selectedLMS?.ModuleID) {
        setAssignedBadges([]);
        return;
      }

      const moduleId = Number(selectedLMS.ModuleID);

      setLoading(true);

      try {
        console.log("🔄 Fetching badges for Module:", moduleId);

        const result = await fetchData(
          `badgesapi/get-assigned-badges?moduleId=${moduleId}`,
          "GET",
          {},
          { "auth-token": userToken },
        );

        console.log(
          "📥 Assigned badges response:",
          JSON.stringify(result, null, 2),
        );

        if (result?.success) {
          const transformedBadges = (result.data || []).map(
            transformAssignedBadge,
          );

          setAssignedBadges(transformedBadges);
        } else {
          setAssignedBadges([]);
        }
      } catch (error) {
        console.error("❌ Error fetching assigned badges:", error);
        setAssignedBadges([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedBadges();
  }, [selectedLMS?.ModuleID, fetchData, userToken]);

  // Assign a badge - moves from Available to Assigned (local only)
  const handleAssignBadge = async (badge) => {
    if (!selectedLMS) return;

    const isAlreadyAssigned = assignedBadges.some(
      (b) => b.BadgeID === badge.BadgeID,
    );
    if (isAlreadyAssigned) {
      console.log(`⚠️ "${badge.BadgeName}" is already assigned`);
      return;
    }

    setAllBadges((prev) => prev.filter((b) => b.BadgeID !== badge.BadgeID));

    // ✅ New assignment has id = null
    const newAssignment = {
      id: null,
      BadgeID: badge.BadgeID,
      BadgeName: badge.BadgeName,
      BadgeIcon: badge.BadgeIcon,
      BadgeImage: badge.BadgeIcon,
      BadgeImagePath: null,
      BadgeDescription: badge.BadgeDescription || "AI achievement unlocked.",
      BadgeCategory: badge.BadgeCategory || "General",
      BadgeCode: badge.BadgeCode || null,
      isAssigned: true,
      isCustomImage: false,
      assignedAt: new Date().toISOString(),
      ModuleID: selectedLMS.ModuleID,
    };

    setAssignedBadges((prev) => [...prev, newAssignment]);
    console.log(`✅ Assigned: ${badge.BadgeName}`);
  };

  // Remove a badge - moves from Assigned to Available (local only)
  const handleRemoveBadge = async (badge) => {
    const exists = assignedBadges.some((b) => b.BadgeID === badge.BadgeID);
    if (!exists) {
      console.log(`⚠️ "${badge.BadgeName}" not found in assigned list`);
      return;
    }

    setAssignedBadges((prev) =>
      prev.filter((b) => b.BadgeID !== badge.BadgeID),
    );

    const masterBadge = {
      BadgeID: badge.BadgeID,
      BadgeName: badge.BadgeName,
      BadgeIcon: badge.BadgeIcon,
      BadgeDescription: badge.BadgeDescription || "AI achievement unlocked.",
      BadgeCategory: badge.BadgeCategory || "General",
      BadgeOrder: badge.BadgeOrder || 0,
      isActive: badge.isActive !== undefined ? badge.isActive : true,
      BadgeCode: badge.BadgeCode || null,
      isAssigned: false,
      isCustomImage: false,
    };
    setAllBadges((prev) => {
      const alreadyExists = prev.some((b) => b.BadgeID === masterBadge.BadgeID);
      if (alreadyExists) return prev;
      return [...prev, masterBadge];
    });

    if (selectedBadge?.BadgeID === badge.BadgeID) {
      setSelectedBadge(null);
    }
  };

  // Update badge image (only for assigned badges)
  const handleBadgeUpdate = (updatedBadge) => {
    setAssignedBadges((prev) =>
      prev.map((b) =>
        b.BadgeID === updatedBadge.BadgeID
          ? {
              ...updatedBadge,
              isCustomImage: true,
              BadgeImage: updatedBadge.BadgeIcon,
            }
          : b,
      ),
    );
    setSelectedBadge(updatedBadge);
    console.log(`🖼️ Updated image: ${updatedBadge.BadgeName}`);
  };

  // SUBMIT ALL ASSIGNED BADGES TO DATABASE
  const handleSubmitAll = async () => {
    if (!selectedLMS) return;
    if (assignedBadges.length === 0) return;

    setSubmitting(true);
    try {
      const jsonData = generateAssignedBadgesJSON();
      console.log("📤 Sending data:", JSON.stringify(jsonData, null, 2));

      const result = await fetchData(
        "badgesapi/save-assigned-badges",
        "POST",
        {
          moduleId: Number(selectedLMS.ModuleID),
          badges: jsonData,
        },
        {
          "auth-token": userToken,
          "Content-Type": "application/json",
        },
      );

      if (result?.success) {
        console.log(`✅ Saved ${assignedBadges.length} badges to database`);
        localStorage.removeItem("lmsBadgeMapData");
        // Refresh the list after save
        window.location.reload();
      } else {
        console.error("Save failed:", result?.message);
      }
    } catch (error) {
      console.error("Error saving badges:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBadgeClick = (badge) => {
    setSelectedBadge(badge);
  };

  const availableBadges = allBadges.filter(
    (badge) =>
      !assignedBadges.some(
        (assigned) => Number(assigned.BadgeID) === Number(badge.BadgeID),
      ),
  );

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-2">
          <AvailableBadges
            badges={availableBadges}
            loading={loading}
            onAssign={handleAssignBadge}
            onBadgeClick={handleBadgeClick}
            saving={saving}
            assignedBadgeIds={assignedBadges.map((b) => b.BadgeID)}
          />
        </div>

        <div className="md:col-span-3">
          <AssignedBadges
            badges={assignedBadges}
            loading={loading}
            onRemove={handleRemoveBadge}
            onBadgeClick={handleBadgeClick}
            saving={saving}
            moduleName={selectedLMS?.ModuleName}
          />
        </div>

        {selectedBadge && (
          <BadgePreview
            badge={selectedBadge}
            onClose={() => setSelectedBadge(null)}
            onBadgeUpdate={handleBadgeUpdate}
          />
        )}
      </div>

      {/* SUBMIT ALL BUTTON */}
      {assignedBadges.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-600">
                <strong>{assignedBadges.length}</strong> badge(s) ready to save
                {assignedBadges.some((b) => b.isCustomImage) && (
                  <span className="ml-2 text-blue-600">
                    ✨ {assignedBadges.filter((b) => b.isCustomImage).length}{" "}
                    with custom images
                  </span>
                )}
              </span>
              <button
                onClick={() => {
                  const json = generateAssignedBadgesJSON();
                  console.log(
                    "📋 Current JSON:",
                    JSON.stringify(json, null, 2),
                  );
                }}
                className="ml-4 text-xs text-blue-600 hover:text-blue-800 underline"
              >
                View JSON (console)
              </button>
            </div>
            <button
              onClick={handleSubmitAll}
              disabled={submitting}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
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
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  Save All Badges to Database
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgeMapper;
