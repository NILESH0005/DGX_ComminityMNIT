import {
  saveVideoProgressService,
  getVideoProgressService,
  getSubmoduleCompletionStatusService,
} from "../services/videoProgressService.js";

export const saveVideoProgress = async (req, res) => {
  try {
    const { UserID, FileID, CurrentTime, Duration } = req.body;

    if (!UserID || !FileID) {
      return res.status(400).json({
        success: false,
        message: "UserID and FileID are required",
      });
    }

    const progress = await saveVideoProgressService({
      UserID,
      FileID,
      CurrentTime,
      Duration,
    });

    res.json({
      success: true,
      data: progress,
      message: "Video progress saved",
    });
  } catch (error) {
    console.error("Save progress error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getVideoProgress = async (req, res) => {
  try {
    const { userId, fileId } = req.params;

    const progress = await getVideoProgressService(userId, fileId);

    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error("Get progress error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getSubmoduleCompletionStatus = async (req, res) => {
  try {
    const { moduleID } = req.body;
    const userID = req.user?.uniqueId;

    if (!moduleID) {
      return res.status(400).json({
        success: false,
        message: "moduleID is required",
      });
    }

    if (!userID) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const data = await getSubmoduleCompletionStatusService(moduleID, userID);

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
