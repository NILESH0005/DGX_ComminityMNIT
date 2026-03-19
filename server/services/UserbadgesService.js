import db from "../models/index.js";
import { QueryTypes } from "sequelize";

const { BadgesMaster, UserBadges } = db;

/* =====================================================
   COMMON FUNCTION → Award badge (no duplicates)
===================================================== */
export const awardUserBadge = async (userId, eventName) => {
  try {
    const badge = await BadgesMaster.findOne({
      where: {
        badge_name: eventName,
        isActive: 1,
        delStatus: 0,
      },
      attributes: ["id", "badge_name", "badge"],
    });

    if (!badge) {
      return { success: false, message: "Badge not found" };
    }

    const blobId = badge.id;

    // Prevent duplicate badge
    const existing = await UserBadges.findOne({
      where: { userId, blobId, delStatus: 0 },
    });

    if (existing) {
      return {
        success: true,
        message: "Badge already achieved",
        data: badge,
      };
    }

    await UserBadges.create({
      userId,
      blobId,
      achievedOn: new Date(),
      AuthAdd: userId,
      AddOnDt: new Date(),
      delStatus: 0,
    });

    return {
      success: true,
      message: "Badge awarded successfully",
      data: badge,
    };
  } catch (error) {
    console.error("Badge award error:", error);
    return { success: false, message: "Failed to save achievement" };
  }
};

/* =====================================================
   LMS MODULE BADGES (FILES PROGRESS)
===================================================== */
export const awardModuleBadges = async (userId, moduleId) => {
  try {
    // Total files in module
    const totalResult = await db.sequelize.query(
      `SELECT COUNT(*) AS total
       FROM filesdetails f
       LEFT JOIN unitsdetails u ON f.UnitID = u.UnitID AND u.delStatus = 0
       LEFT JOIN submodulesdetails s ON s.SubModuleID = u.SubModuleID AND s.delStatus = 0
       LEFT JOIN moduledetails m ON m.ModuleID = s.ModuleID AND m.delStatus = 0
       WHERE f.delStatus = 0
       AND m.ModuleID = :moduleId`,
      {
        replacements: { moduleId },
        type: QueryTypes.SELECT,
      }
    );

    const totalFiles = Number(totalResult[0].total);

    if (!totalFiles) {
      return { success: false, message: "No files found in module" };
    }

    // Completed files by user
    const completedResult = await db.sequelize.query(
      `SELECT COUNT(*) AS completed
       FROM videoprogress p
       JOIN filesdetails f ON f.FileID = p.FileID
       JOIN unitsdetails u ON f.UnitID = u.UnitID AND (u.delStatus = 0 OR u.delStatus IS NULL)
       JOIN submodulesdetails s ON s.SubModuleID = u.SubModuleID AND (s.delStatus = 0 OR s.delStatus IS NULL)
       JOIN moduledetails m ON m.ModuleID = s.ModuleID AND (m.delStatus = 0 OR m.delStatus IS NULL)
       WHERE p.userId = :userId
       AND p.isCompleted = 1
       AND (p.delStatus = 0 OR p.delStatus IS NULL)
       AND m.ModuleID = :moduleId`,
      {
        replacements: { userId, moduleId },
        type: QueryTypes.SELECT,
      }
    );

    const completedFiles = Number(completedResult[0].completed);
    const percent = totalFiles ? (completedFiles / totalFiles) * 100 : 0;

    let badgeEvent = null;

    if (percent >= 20 && percent < 25) badgeEvent = "LMS_25";
    else if (percent >= 45 && percent < 55) badgeEvent = "LMS_50";
    else if (percent >= 70 && percent < 75) badgeEvent = "LMS_75";
    else if (percent >= 90 && percent <= 100) badgeEvent = "LMS_100";

    const badges = [];

    if (badgeEvent) {
      badges.push(await awardUserBadge(userId, badgeEvent));
    }

    return {
      success: true,
      moduleId,
      totalFiles,
      completedFiles,
      percent: percent.toFixed(0),
      badges,
    };
  } catch (error) {
    console.error("Module badge error:", error);
    return { success: false, message: "Failed to process module badges" };
  }
};