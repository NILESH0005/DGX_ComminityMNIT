import db from "../models/index.js";

const { BadgesMaster, BlobAchievement } = db;

export const createBlobAchievementService = async (userId, eventName) => {
  try {

    // find badge using badge_name (eventName)
    const blob = await BadgesMaster.findOne({
      where: {
        badge_name: eventName,
        isActive: 1,
        delStatus: 0
      },
      attributes: ["id", "badge_name", "badge"]
    });

    if (!blob) {
      return {
        success: false,
        message: "Blob not found for this event"
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
        success: true,
        message: "Blob already achieved",
        data: blob
      };
    }

    // save achievement
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
      message: "Blob awarded successfully",
      data: blob
    };

  } catch (error) {

    console.error("Blob achievement error:", error);

    return {
      success: false,
      message: "Failed to save achievement"
    };
  }
};