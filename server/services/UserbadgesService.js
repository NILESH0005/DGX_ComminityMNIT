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

    const badgesId = badge.id;
    console.log("🚀 badgesId:", badgesId);

    // Prevent duplicate badge
    const existing = await UserBadges.findOne({
      where: { userId, badgesId, delStatus: 0 },
    });

    if (existing) {
      return {
        success: true,
        message: "Badge already achieved",
        badgeId: badgesId,
        data: badge,
      };
    }

    // ✅ Correct: include isView default
    const created = await UserBadges.create({
      userId,
      badgesId,
      achievedOn: new Date(),
      AuthAdd: userId,
      AddOnDt: new Date(),
      delStatus: 0,
      isView: 1, // <--- must set this to avoid Sequelize notNull error
    });

    return {
      success: true,
      message: "Badge awarded successfully",
      badgeId: badgesId,
      achievementId: created.id,
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
    /* 🎯 Total files in module */
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
      },
    );

    const totalFiles = Number(totalResult?.[0]?.total || 0);

    if (!totalFiles) {
      return { success: false, message: "No files found in module" };
    }

    /* 🎯 Completed files */
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
      },
    );

    const completedFiles = Number(completedResult?.[0]?.completed || 0);
    const percent = totalFiles ? (completedFiles / totalFiles) * 100 : 0;

    /* 🎖 Progress Badges */
    const badgeEvents = [];

    if (percent >= 25) badgeEvents.push("LMS_25");
    if (percent >= 50) badgeEvents.push("LMS_50");
    if (percent >= 75) badgeEvents.push("LMS_75");
    if (percent >= 100) badgeEvents.push("LMS_100");

    const badges = [];

    for (const event of badgeEvents) {
      const result = await awardUserBadge(userId, event);
      badges.push(result);
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

export const getUserBadges = async (userId) => {
  try {
    const badges = await db.sequelize.query(
      `
      SELECT 
        ub.id,
        ub.userId,
        ub.blobId,
        ub.achievedOn,
        bm.badge_name,
        bm.badge
      FROM userBadges ub
      INNER JOIN badgesmaster bm 
        ON bm.id = ub.blobId
      WHERE ub.userId = :userId
        AND ub.delStatus = 0
        AND bm.delStatus = 0
        AND bm.isActive = 1
      ORDER BY ub.achievedOn DESC
      `,
      {
        replacements: { userId },
        type: QueryTypes.SELECT,
      },
    );

    return {
      success: true,
      count: badges.length,
      data: badges,
    };
  } catch (error) {
    console.error("Get user badges error:", error);
    return { success: false, message: "Failed to fetch user badges" };
  }
};

export const recalculateCourseProgress = async (userId, moduleId) => {
  try {
    // 🎯 Total videos

    console.log(
      "🚀 ~ file: UserbadgesService.js:316 ~ recalculateCourseProgress ~ moduleId:",
      moduleId,
    );
    console.log(
      "🚀 ~ file: UserbadgesService.js:317 ~ recalculateCourseProgress ~ userId:",
      userId,
    );
    const totalResult = await db.sequelize.query(
      `
      SELECT COUNT(*) AS total
      FROM filesdetails f
      LEFT JOIN unitsdetails u ON f.UnitID = u.UnitID AND u.delStatus = 0
      LEFT JOIN submodulesdetails s ON s.SubModuleID = u.SubModuleID AND s.delStatus = 0
      LEFT JOIN moduledetails m ON m.ModuleID = s.ModuleID AND m.delStatus = 0
      WHERE f.delStatus = 0
        AND m.ModuleID = :moduleId
      `,
      {
        replacements: { moduleId },
        type: QueryTypes.SELECT,
      },
    );

    const totalVideos = Number(totalResult[0].total);
    if (!totalVideos) return;

    // 🎯 Completed videos
    const completedResult = await db.sequelize.query(
      `
      SELECT COUNT(*) AS completed
      FROM videoprogress p
      JOIN filesdetails f ON f.FileID = p.FileID
      JOIN unitsdetails u ON f.UnitID = u.UnitID
      JOIN submodulesdetails s ON s.SubModuleID = u.SubModuleID
      JOIN moduledetails m ON m.ModuleID = s.ModuleID
      WHERE p.userId = :userId
        AND p.isCompleted = 1
        AND (p.delStatus = 0 OR p.delStatus IS NULL)
        AND m.ModuleID = :moduleId
      `,
      {
        replacements: { userId, moduleId },
        type: QueryTypes.SELECT,
      },
    );

    const completedVideos = Number(completedResult[0].completed);
    const percent = (completedVideos / totalVideos) * 100;

    console.log(
      "🚀 ~ file: UserbadgesService.js:358 ~ recalculateCourseProgress ~ completedVideos:",
      completedVideos,
    );
    console.log(
      "🚀 ~ file: UserbadgesService.js:380 ~ recalculateCourseProgress ~ percent:",
      percent,
    );

    // 🏆 First video badge
    await assignFirstVideoBadge(userId);

    // 🏆 Progress badges
    await assignCompletionBadges(userId, percent);
  } catch (error) {
    console.error("Course progress error:", error);
  }
};

export const assignCompletionBadges = async (userId, percent) => {
  try {
    let eventName = null;

    if (percent >= 25 && percent < 50) {
      eventName = "LMS_25";
    } else if (percent >= 50 && percent < 75) {
      eventName = "LMS_50";
    } else if (percent >= 75 && percent < 100) {
      eventName = "LMS_75";
    } else if (percent === 100) {
      eventName = "LMS_100";
    }

    if (eventName) {
      await awardUserBadgeV1(userId, eventName);
    }
  } catch (error) {
    console.error("Badge engine error:", error);
  }
};

/* =====================================================
   COMMON METHOD — Award Badge (No Duplicate)
===================================================== */
export const awardUserBadgeV1 = async (userId, eventName) => {
  try {
    // 1. Find badge from master
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

    // 2 & 3. Prevent duplicate + Award safely
    const [record, created] = await UserBadges.findOrCreate({
      where: {
        userId,
        badgesId: badge.id,
        delStatus: 0,
      },
      defaults: {
        isView: false, // ✅ fixes notNull error
        achievedOn: new Date(),
        AuthAdd: userId,
        AddOnDt: new Date(),
        delStatus: 0,
      },
    });

    return {
      success: true,
      message: created
        ? "Badge awarded successfully"
        : "Badge already achieved",
      data: badge,
    };
  } catch (error) {
    console.error("Award badge error:", error);
    return { success: false, message: "Failed to award badge" };
  }
};

export const assignFirstVideoBadge = async (userId) => {
  try {
    const result = await db.sequelize.query(
      `
      SELECT COUNT(*) AS completed
      FROM videoprogress
      WHERE userId = :userId
        AND isCompleted = 1
        AND (delStatus = 0 OR delStatus IS NULL)
      `,
      {
        replacements: { userId },
        type: QueryTypes.SELECT,
      },
    );

    const completedCount = Number(result?.[0]?.completed || 0);

    // 🎯 First video completed
    if (completedCount === 1) {
      await awardUserBadgeV1(userId, "FIRST_VIDEO_COMPLETE");
    }
  } catch (error) {
    console.error("First video badge error:", error);
  }
};

export const getUnseenBadgesByUser = async (userId) => {
  return await UserBadges.findAll({
    where: {
      userId,
      isView: false,
      delStatus: 0,
    },
    include: [
      {
        model: BadgesMaster,
        attributes: ["id", "badge_name", "badge"],
      },
    ],
    order: [["achievedOn", "ASC"]],
  });
};

export const markBadgesViewed = async (userId, badgeIds) => {
  await UserBadges.update(
    { isView: true },
    {
      where: {
        userId,
        badgesId: badgeIds,
        isView: false,
      },
    },
  );
};

export const popUserBadges = async (userId) => {
  try {
    const badges = await db.sequelize.query(
      `SELECT 
        ub.id,
        ub.userId,
        ub.badgesId,
        ub.achievedOn,
        bm.badge_name,
         bm.badge_order,
        ub.isView,
        bm.badge
      FROM userBadges ub
      INNER JOIN badgesmaster bm 
        ON bm.id = ub.badgesId
      WHERE ub.userId = :userId
        AND ub.isView = 0
        AND ub.delStatus = 0
        AND bm.delStatus = 0
        AND bm.isActive = 1
      ORDER BY ub.achievedOn ASC`,
      {
        replacements: { userId },
        type: QueryTypes.SELECT,
      },
    );

    if (!badges.length) return [];

    const badgeRowIds = badges.map((b) => b.id);

    await db.sequelize.query(
      `UPDATE userBadges
       SET isView = 1
       WHERE id IN (:badgeRowIds)`,
      {
        replacements: { badgeRowIds },
        type: QueryTypes.UPDATE,
      },
    );

    return badges;
  } catch (err) {
    console.error("Pop badge error:", err);
    throw err;
  }
};
