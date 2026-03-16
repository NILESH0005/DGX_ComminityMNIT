import { createBlobAchievementService } from "../services/blobAchievementService.js";
import { logError } from "../helper/index.js";

export const createBlobAchievement = async (req, res) => {
  try {

    const { userId, eventName } = req.body;

    if (!userId || !eventName) {
      return res.status(400).json({
        success: false,
        message: "userId and eventName are required"
      });
    }

    const result = await createBlobAchievementService(userId, eventName);

    return res.status(200).json(result);

  } catch (error) {

    logError(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};