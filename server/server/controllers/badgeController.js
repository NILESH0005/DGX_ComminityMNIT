import e from "express";
import { logError, logInfo } from "../helper/index.js";
import {
  createBadgeService,
  GetBadgesImg,
  getBadgesService,
  GetBadgesUserCount,
  getBlockedUsers,
  getEventSubmoduleAnalytics,
  getNotVerifiedUsers,
  getSubmoduleUserDetails,
  getUserCountByDistrict,
  GetUserCountGenderwise,
  getUserCountQualificationWise,
  getUserGenderCountByDistrict,
  todaysUserLogin,
  TotalUserPassOrFailCount,
  saveAssignedBadgesService,
  getAssignedBadgesService,
  updateBadgeImageService,
  getBadgeImageHistoryService,
} from "../services/badgeService.js";

export const getBadges = async (req, res) => {
  try {
    const badges = await getBadgesService();

    return res.status(200).json({
      success: true,
      count: badges.length,
      data: badges,
      message:
        badges.length > 0 ? "Badges fetched successfully" : "No badges found",
    });
  } catch (error) {
    logError(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const createBadge = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const result = await createBadgeService(req);

    if (!result.success) {
      return res.status(400).json(result);
    }

    logInfo("Badge created successfully");

    return res.status(200).json(result);
  } catch (error) {
    logError(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getUserCountAgainestBadge = async (req, res) => {
  try {
    const result = await GetBadgesUserCount(req);
    return res.status(200).json({
      success: true,
      data: result,
      message: "User count against badges fetched successfully",
    });
  } catch (error) {
    logError(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getBadgeImgData = async (req, res) => {
  try {
    const badges = await GetBadgesImg();
    return res.status(200).json({
      success: true,
      data: badges,
      message: "Badge images fetched successfully",
    });
  } catch (error) {
    logError(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getGenderUserCount = async (req, res) => {
  try {
    const { eventId } = req.query;
    const result = await GetUserCountGenderwise(eventId);
    return res.status(200).json({
      success: true,
      data: result,
      message: "Gender-wise user count fetched successfully",
    });
  } catch (error) {
    logError(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const UserCountDistrictWise = async (req, res) => {
  try {
    const { eventId } = req.query;
    const result = await getUserCountByDistrict(eventId);
    return res.status(200).json({
      success: true,
      data: result,
      message: "District-wise user count fetched successfully",
    });
  } catch (error) {
    logError(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const UserGenderCountByDistrict = async (req, res) => {
  try {
    const { eventId } = req.query;
    const result = await getUserGenderCountByDistrict(eventId);
    return res.status(200).json({
      success: true,
      data: result,
      message: "Gender-wise user count by district fetched successfully",
    });
  } catch (error) {
    logError(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getTodayLiveUserCount = async (req, res) => {
  try {
    const { eventId } = req.query;
    const result = await todaysUserLogin(eventId);
    return res.status(200).json({
      success: true,
      data: result,
      message: "Today's live user count fetched successfully",
    });
  } catch (error) {
    logError(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const UserCountQualificationWise = async (req, res) => {
  try {
    const { eventId } = req.query;
    const result = await getUserCountQualificationWise(eventId);
    return res.status(200).json({
      success: true,
      data: result,
      message: "Qualification-wise user count fetched successfully",
    });
  } catch (error) {
    logError(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const UserBlockedUser = async (req, res) => {
  try {
    const { eventId } = req.query;

    const result = await getBlockedUsers(eventId);

    return res.status(200).json({
      success: true,
      data: result,
      message: "Blocked users fetched successfully",
    });
  } catch (error) {
    logError(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const UserNotVerifiedUser = async (req, res) => {
  try {
    const { eventId } = req.query;

    const result = await getNotVerifiedUsers(eventId);

    return res.status(200).json({
      success: true,
      data: result,
      message: "Not verified users fetched successfully",
    });
  } catch (error) {
    logError(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getPassFailUserCount = async (req, res) => {
  try {
    const { eventId } = req.query;
    const result = await TotalUserPassOrFailCount(eventId);
    return res.status(200).json({
      success: true,
      data: result,
      message: "Pass/fail user count fetched successfully",
    });
  } catch (error) {
    logError(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const GetEventSubmoduleAnalytics = async (req, res) => {
  try {
    const { eventId } = req.query;

    const result = await getEventSubmoduleAnalytics(eventId);

    return res.status(200).json({
      success: true,
      data: result.data,
      message: result.message,
    });
  } catch (error) {
    logError(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const GetSubmoduleUserDetails = async (req, res) => {
  try {
    const { eventId, subModuleId } = req.query;

    const result = await getSubmoduleUserDetails(eventId, subModuleId);

    return res.status(200).json({
      success: true,
      data: result.data,
      message: result.message,
    });
  } catch (error) {
    logError(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const saveAssignedBadges = async (req, res) => {
  try {
    console.log("📥 Received request body:", JSON.stringify(req.body, null, 2));

    const { moduleId, badges } = req.body;
    const userId = req.user?.id || req.user?.username || "system";

    // ✅ Validate moduleId
    if (!moduleId) {
      return res.status(400).json({
        success: false,
        message: "Module ID is required",
      });
    }

    // ✅ Ensure moduleId is a number
    const moduleIdNum = parseInt(moduleId);
    if (isNaN(moduleIdNum)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Module ID format",
      });
    }

    if (!badges || !Array.isArray(badges) || badges.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No badges to save",
      });
    }

    console.log(`✅ Module ID: ${moduleIdNum}, Badges count: ${badges.length}`);
    console.log("📦 Badges data:", JSON.stringify(badges, null, 2));

    // ✅ Call service with correct parameters
    const result = await saveAssignedBadgesService(
      moduleIdNum, // moduleId
      badges, // badges
      userId, // userId
    );

    return res.status(200).json({
      success: true,
      message: `${result.count} badge(s) saved successfully`,
      data: result,
    });
  } catch (err) {
    console.error("❌ Error in saveAssignedBadges:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to save badges",
    });
  }
};

// Get assigned badges for a module
export const getAssignedBadges = async (req, res) => {
  try {
    const { moduleId } = req.query;

    if (!moduleId) {
      return res.status(400).json({
        success: false,
        message: "Module ID is required",
      });
    }

    const result = await getAssignedBadgesService(parseInt(moduleId));

    return res.status(200).json({
      success: true,
      data: result,
      message: "Assigned badges fetched successfully",
    });
  } catch (error) {
    console.error("Error in getAssignedBadges:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch assigned badges",
    });
  }
};

export const updateBadgeImage = async (req, res) => {
  try {
    const { assignmentId, badgeName } = req.body;

    const userId = req.user?.id || req.user?.username || "system";

    let imageData = null;
    let imagePath = null;

    if (req.file) {
      imageData = req.file.buffer ? req.file.buffer.toString("base64") : null;

      imagePath = req.file.path || null;
    } else if (req.body.imageData) {
      imageData = req.body.imageData;
    }

    if (!assignmentId) {
      return res.status(400).json({
        success: false,
        message: "Assignment ID is required",
      });
    }

    // Name is optional if you still want image-only updates
    if (badgeName !== undefined && !badgeName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Badge name cannot be empty",
      });
    }

    if (!imageData) {
      return res.status(400).json({
        success: false,
        message: "Image data is required",
      });
    }

    const result = await updateBadgeImageService(
      parseInt(assignmentId),
      imageData,
      imagePath,
      badgeName,
      userId,
    );

    return res.status(200).json({
      success: true,
      data: result,
      message: "Badge updated successfully",
    });
  } catch (error) {
    console.error("Error in updateBadgeImage:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update badge",
    });
  }
};

export const getBadgeImageHistory = async (req, res) => {
  try {
    const { badgeId, moduleId } = req.query;
    const userId = req.user?.id || req.user?.username || "system";

    if (!badgeId || !moduleId) {
      return res.status(400).json({
        success: false,
        message: "Badge ID and Module ID are required",
      });
    }

    const result = await getBadgeImageHistoryService(
      parseInt(badgeId),
      parseInt(moduleId),
      userId,
    );

    return res.status(200).json({
      success: true,
      data: result,
      message: "Image history fetched successfully",
    });
  } catch (error) {
    console.error("Error in getBadgeImageHistory:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch image history",
    });
  }
};
