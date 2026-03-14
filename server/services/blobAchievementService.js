import db from "../models/index.js";

const { BadgesMaster, BlobAchievement } = db;

export const createBlobAchievementService = async (userId, blob_name) => {
  try {

    // find badge using name
    const blob = await BadgesMaster.findOne({
      where: {
        badge_name: blob_name,
        delStatus: 0
      },
      attributes: ["id"]
    });

    if (!blob) {
      return {
        success: false,
        message: "Blob not found"
      };
    }

    const blobId = blob.id;

    // check if already achieved
    const existing = await BlobAchievement.findOne({
      where: {
        userId,
        blobId,
        delStatus: 0
      }
    });

    if (existing) {
      return {
        success: false,
        message: "Blob already achieved"
      };
    }

    // create achievement
    const achievement = await BlobAchievement.create({
      userId,
      blobId,
      achievedOn: new Date(),
      AuthAdd: userId,
      AddOnDt: new Date(),
      delStatus: 0
    });

    return {
      success: true,
      message: "Blob achievement saved",
      data: achievement
    };

  } catch (error) {
    console.error("Blob achievement error:", error);

    return {
      success: false,
      message: "Failed to save achievement"
    };
  }
};