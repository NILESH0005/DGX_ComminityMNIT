import { createBlobAchievementService } from "../services/blobAchievementService.js";
import { logError } from "../helper/index.js";

export const createBlobAchievement = async (req, res) => {
  try {
    const { userId, blob_name } = req.body;

    if (!userId || !blob_name) {
      return res.status(400).json({
        success: false,
        message: "userId and blob_name are required"
      });
    }

    const result = await createBlobAchievementService(userId, blob_name);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);

  } catch (error) {
    logError(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};