import db from "../models/index.js";
import { QueryTypes } from "sequelize";

const { BadgesMaster, UserBadges } = db;

// const isBadgeAllowedForUser = async (userId) => {
//   try {
//     const result = await db.sequelize.query(
//       `
//       SELECT me.isBadgeEnabled
//       FROM community_user cu
//       LEFT JOIN masterevent me
//         ON me.EventID = cu.EventType
//       WHERE cu.UserID = :userId
//         AND (cu.delStatus = 0 OR cu.delStatus IS NULL)
//       LIMIT 1
//       `,
//       {
//         replacements: { userId },
//         type: QueryTypes.SELECT,
//       },
//     );

//     return result?.[0]?.isBadgeEnabled === 1;
//   } catch (error) {
//     console.error("Error checking badge eligibility:", error);
//     return false;
//   }
// };

const isBadgeAllowedForUser = async (userId, moduleId) => {
  try {
    console.log("🔐 Checking LMS badge eligibility:", {
      userId,
      moduleId,
    });

    const result = await db.sequelize.query(
      `
      SELECT
        me.EventID,
        me.EventName,
        me.isBadgeEnabled AS eventBadgeEnabled,

        md.ModuleID,
        md.ModuleName,
        md.isBadgeEnabled AS moduleBadgeEnabled

      FROM userevents ue

      INNER JOIN masterevent me
        ON me.EventID = ue.EventID
        AND (me.delStatus = 0 OR me.delStatus IS NULL)

      INNER JOIN moduledetails md
        ON md.EventType = me.EventID
        AND md.ModuleID = :moduleId
        AND (md.delStatus = 0 OR md.delStatus IS NULL)

      WHERE ue.UserID = :userId
        AND (ue.delStatus = 0 OR ue.delStatus IS NULL)

      LIMIT 1
      `,
      {
        replacements: {
          userId,
          moduleId,
        },
        type: QueryTypes.SELECT,
      },
    );

    console.log("🔐 LMS eligibility result:", result);

    if (!result?.length) {
      console.log("❌ User/Event/Module mapping not found");

      return false;
    }

    const row = result[0];

    console.log("🔐 Eligibility:", {
      event: row.EventName,
      eventBadgeEnabled: row.eventBadgeEnabled,
      module: row.ModuleName,
      moduleBadgeEnabled: row.moduleBadgeEnabled,
    });

    return (
      Number(row.eventBadgeEnabled) === 1 &&
      Number(row.moduleBadgeEnabled) === 1
    );
  } catch (error) {
    console.error("❌ Error checking LMS badge eligibility:", error);

    return false;
  }
};

export const awardUserBadge = async (userId, eventName) => {
  if (!(await isBadgeAllowedForUser(userId))) {
    return { success: false, message: "Badge not allowed" };
  }
  try {
    const badge = await BadgesMaster.findOne({
      where: {
        badge_code: eventName,
        isActive: 1,
        delStatus: 0,
      },
      attributes: ["id", "badge_code", "badge_category", "badge_name", "badge"],
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
        data: null,
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
        bm.id AS badgeId,
        bm.badge_name AS badgeName,
         bm.badge_order AS badgeOrder,
        bm.isActive AS badgeIsActive,
        IF(ub.isView IS NULL, 0, ub.isView) AS active,
        bm.badge
      FROM badgesmaster bm
      LEFT JOIN userbadges ub
        ON bm.id = ub.badgesId AND ub.userId = :userId
      ORDER BY bm.badge_order
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
    return { success: false, message: "Failed to fetch user badges", data: [] };
  }
};

// export const recalculateCourseProgress = async (userId, FileID) => {
//   try {
//     // 🎯 Total videos

//     console.log(
//       "🚀 ~ file: UserbadgesService.js:316 ~ recalculateCourseProgress ~ moduleId:",
//       FileID,
//     );
//     console.log(
//       "🚀 ~ file: UserbadgesService.js:317 ~ recalculateCourseProgress ~ userId:",
//       FileID,
//     );
//     const totalResult = await db.sequelize.query(
//       `
//       SELECT COUNT(*) AS total
//       FROM filesdetails f
//       LEFT JOIN unitsdetails u ON f.UnitID = u.UnitID AND u.delStatus = 0
//       LEFT JOIN submodulesdetails s ON s.SubModuleID = u.SubModuleID AND s.delStatus = 0
//       LEFT JOIN moduledetails m ON m.ModuleID = s.ModuleID AND m.delStatus = 0
//       WHERE f.delStatus = 0
//         AND m.ModuleID = :moduleId
//       `,
//       {
//         replacements: { moduleId },
//         type: QueryTypes.SELECT,
//       },
//     );

//     const totalVideos = Number(totalResult[0].total);
//     if (!totalVideos) return;

//     // 🎯 Completed videos
//     const completedResult = await db.sequelize.query(
//       `
//       SELECT COUNT(*) AS completed
//       FROM videoprogress p
//       JOIN filesdetails f ON f.FileID = p.FileID
//       JOIN unitsdetails u ON f.UnitID = u.UnitID
//       JOIN submodulesdetails s ON s.SubModuleID = u.SubModuleID
//       JOIN moduledetails m ON m.ModuleID = s.ModuleID
//       WHERE p.userId = :userId
//         AND p.isCompleted = 1
//         AND (p.delStatus = 0 OR p.delStatus IS NULL)
//         AND m.ModuleID = :moduleId
//       `,
//       {
//         replacements: { userId, moduleId },
//         type: QueryTypes.SELECT,
//       },
//     );

//     const completedVideos = Number(completedResult[0].completed);
//     const percent = (completedVideos / totalVideos) * 100;

//     console.log(
//       "🚀 ~ file: UserbadgesService.js:358 ~ recalculateCourseProgress ~ completedVideos:",
//       completedVideos,
//     );
//     console.log(
//       "🚀 ~ file: UserbadgesService.js:380 ~ recalculateCourseProgress ~ percent:",
//       percent,
//     );

//     // 🏆 First video badge
//     await assignFirstVideoBadge(userId);

//     // 🏆 Progress badges
//     await assignCompletionBadges(userId, percent);
//   } catch (error) {
//     console.error("Course progress error:", error);
//   }
// };

// export const recalculateCourseProgress = async (userId, FileID) => {
//   try {
//     // =====================================================
//     // ✅ STEP 1: GET MODULE
//     // =====================================================

//     console.log(
//       "🚀 ~ file: UserbadgesService.js:316 ~ recalculateCourseProgress ~ FileID:",
//       FileID,userId);

//     const moduleResult = await db.sequelize.query(
//       `
//       SELECT s.ModuleID
//       FROM filesdetails f
//       JOIN unitsdetails u ON f.UnitID = u.UnitID
//       JOIN submodulesdetails s ON s.SubModuleID = u.SubModuleID
//       WHERE f.FileID = :FileID
//       `,
//       {
//         replacements: { FileID },
//         type: QueryTypes.SELECT,
//       }
//     );

// console.log(
//   "🚀 ~ file: UserbadgesService.js:358 ~ recalculateCourseProgress ~ moduleResult:",
//   moduleResult,
// );

//     if (!moduleResult.length) return;

//     const moduleId = moduleResult[0].ModuleID;

//     // =====================================================
//     // ✅ STEP 2: GET BADGES (WITH badge_id)
//     // =====================================================
//     const badges = await db.sequelize.query(
//       `
//       SELECT id, badge_code, badge_name, badge_category
//       FROM badgesmaster
//       `,
//       { type: QueryTypes.SELECT }
//     );

//     const milestoneBadges = badges.filter(b => b.badge_category === "Milestone");
//     const progressBadges = badges.filter(b => b.badge_category === "Progress");
//     const finalBadges = badges.filter(b => b.badge_category === "Final");

// console.log(
//   "🚀 ~ file: UserbadgesService.js:380 ~ recalculateCourseProgress ~ milestoneBadges:",
//   milestoneBadges,  progressBadges, finalBadges
// );

//     // =====================================================
//     // ✅ STEP 3: SUBMODULE COMPLETION COUNT
//     // =====================================================
//     const submodules = await db.sequelize.query(
//       `
//       SELECT SubModuleID
//       FROM submodulesdetails
//       WHERE ModuleID = :moduleId AND delStatus = 0
//       ORDER BY SortingOrder ASC
//       `,
//       {
//         replacements: { moduleId },
//         type: QueryTypes.SELECT,
//       }
//     );

//     let completedSubmodules = 0;

// console.log(
//   "🚀 ~ file: UserbadgesService.js:410 ~ recalculateCourseProgress ~ submodules:",
//   submodules
// );

//     for (const sub of submodules) {
//       const subModuleId = sub.SubModuleID;

//       const totalRes = await db.sequelize.query(
//         `
//         SELECT COUNT(*) as total
//         FROM filesdetails f
//         JOIN unitsdetails u ON f.UnitID = u.UnitID
//         WHERE u.SubModuleID = :subModuleId
//           AND f.delStatus = 0
//         `,
//         { replacements: { subModuleId }, type: QueryTypes.SELECT }
//       );

//       const completedRes = await db.sequelize.query(
//         `
//         SELECT COUNT(*) as completed
//         FROM videoprogress p
//         JOIN filesdetails f ON f.FileID = p.FileID
//         JOIN unitsdetails u ON f.UnitID = u.UnitID
//         WHERE p.userId = :userId
//           AND p.isCompleted = 1
//           AND (p.delStatus = 0 OR p.delStatus IS NULL)
//           AND u.SubModuleID = :subModuleId
//         `,
//         { replacements: { userId, subModuleId }, type: QueryTypes.SELECT }
//       );

//       const total = Number(totalRes[0]?.total || 0);
//       const completed = Number(completedRes[0]?.completed || 0);

//       console.log(
//         "🚀 ~ file: UserbadgesService.js:450 ~ recalculateCourseProgress ~ SubModuleID:",
//         subModuleId, "Total:", total, "Completed:", completed
//       );

//       if (total > 0 && completed == total) {
//         completedSubmodules++;
//       } else {
//         break; // sequential rule
//       }
//     }

//     console.log("Completed Submodules:", completedSubmodules);

//     // =====================================================
//     // 🎯 STEP 4: COURSE PROGRESS
//     // =====================================================
//     const totalCourseRes = await db.sequelize.query(
//       `SELECT COUNT(*) as total FROM filesdetails WHERE delStatus = 0`,
//       { type: QueryTypes.SELECT }
//     );

//     const completedCourseRes = await db.sequelize.query(
//       `
//       SELECT COUNT(*) as completed
//       FROM videoprogress
//       WHERE userId = :userId
//         AND isCompleted = 1
//         AND (delStatus = 0 OR delStatus IS NULL)
//       `,
//       { replacements: { userId }, type: QueryTypes.SELECT }
//     );

//     const totalCourse = Number(totalCourseRes[0]?.total || 0);
//     const completedCourse = Number(completedCourseRes[0]?.completed || 0);

//     const coursePercent =
//       totalCourse > 0 ? (completedCourse / totalCourse) * 100 : 0;

//     console.log("Course %:", coursePercent);

//     // =====================================================
//     // 🏆 STEP 5: MILESTONE BADGES
//     // =====================================================
//     for (const badge of milestoneBadges) {
//       if (badge.badge_code.startsWith("M")) {
//         const level = parseInt(badge.badge_code.replace("M", ""));
// console.log(
//   "🚀 ~ file: UserbadgesService.js:526 ~ recalculateCourseProgress ~ Checking milestone badge:",
//   badge.badge_code, "Level:", level, "Completed Submodules:", completedSubmodules
// );

//         if (completedSubmodules == level) {
//           console.log(
//             "🎯 Milestone hit! Awarding badge:",
//             badge);
//           await assignBadge(userId, badge);
//         }
//       }

//       if (badge.badge_code === "FMC" && completedSubmodules === 1) {
//         await assignBadge(userId, badge);
//       }
//     }

//     // =====================================================
//     // 📊 STEP 6: PROGRESS BADGES
//     // =====================================================
//     for (const badge of progressBadges) {
//       const percent = parseInt(badge.badge_code.replace("P", ""));

//       if (coursePercent >= percent) {
//         await assignBadge(userId, badge);
//       }
//     }

//     // =====================================================
//     // 🏁 STEP 7: FINAL BADGES
//     // =====================================================
//     if (coursePercent === 100) {
//       for (const badge of finalBadges) {
//         if (badge.badge_code === "FCC") {
//           await assignBadge(userId, badge);
//         }

//         if (badge.badge_code === "FF") {
//           const isFirst = await isFirstFinisher();
//           if (isFirst) {
//             await assignBadge(userId, badge);
//           }
//         }
//       }
//     }

//   } catch (error) {
//     console.error("Error:", error);
//   }
// };

// async function assignBadge(userId, badge) {
//   // ✅ Check using badgeId

//   console.log("🚀 ~ file: UserbadgesService.js:557 ~ assignBadge ~ Checking badge assignment for userId:",
// userId, "badgeId:", badge.id);

//   const exists = await UserBadges.findOne({
//     where: { userId, badgesId: badge.id },
//   });

//   if (exists) return;

//   // ✅ Save using badgeId
//   await UserBadges.create({
//     userId: userId,
//     badgesId: badge.id,   // 🔥 important
//   isView: 0, // ✅ fixes notNull error
//     achievedOn: new Date(),
//     AuthAdd: userId,
//     AddOnDt: new Date(),
//     delStatus: 0,
//   });

//   console.log("🏆 Assigned:", badge.badge_name);
// }

export const assignCompletionBadges = async (userId, percent) => {
  if (!(await isBadgeAllowedForUser(userId))) return;
  try {
    let eventName = null;

    if (percent >= 25 && percent < 50) {
      eventName = "LMS_25";
    } else if (percent >= 50 && percent < 75) {
      eventName = "LMS_50";
    } else if (percent >= 75 && percent < 100) {
      eventName = "LMS_75";
    } else if (percent == 100) {
      eventName = "LMS_100";
    }

    if (eventName) {
      await awardUserBadgeV1(userId, eventName);
    }
  } catch (error) {
    console.error("Badge engine error:", error);
  }
};

export const awardUserBadgeV1 = async (userId, eventName) => {
  if (!(await isBadgeAllowedForUser(userId))) return;
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
      await awardUserBadgeV1(userId, "F");
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

// export const popUserBadges = async (userId) => {
//   try {
//     const badges = await db.sequelize.query(
//       `SELECT
//         ub.id,
//         ub.userId,
//         ub.badgesId,
//         ub.achievedOn,
//         bm.badge_name,
//          bm.badge_order,
//         ub.isView,
//         bm.badge
//       FROM userBadges ub
//       INNER JOIN badgesmaster bm
//         ON bm.id = ub.badgesId
//       WHERE ub.userId = :userId
//         AND ub.isView = 0
//         AND ub.delStatus = 0
//         AND bm.delStatus = 0
//         AND bm.isActive = 1
//       ORDER BY ub.achievedOn ASC`,
//       {
//         replacements: { userId },
//         type: QueryTypes.SELECT,
//       },
//     );

//     if (!badges.length) return [];

//     const badgeRowIds = badges.map((b) => b.id);

//     await db.sequelize.query(
//       `UPDATE userBadges
//        SET isView = 1
//        WHERE id IN (:badgeRowIds)`,
//       {
//         replacements: { badgeRowIds },
//         type: QueryTypes.UPDATE,
//       },
//     );

//     return badges;
//   } catch (err) {
//     console.error("Pop badge error:", err);
//     throw err;
//   }
// };

export const popUserBadges = async (userId, category = null) => {
  try {
    let query = `
      SELECT 
        ub.id,
        ub.userId,
        ub.badgesId,
        ub.achievedOn,
        bm.badge_name,
        bm.badge_code,
        bm.badge_category,
        bm.badge_order,
        bm.badge,
        ub.isView
      FROM userBadges ub
      INNER JOIN badgesmaster bm 
        ON bm.id = ub.badgesId and bm.badge_code <>'FCC'
      WHERE ub.userId = :userId
        AND ub.isView = 0
        AND ub.delStatus = 0
        AND bm.delStatus = 0
        AND bm.isActive = 1
    `;

    console.log(
      "🚀 ~ file: UserbadgesService.js:122 ~ popUserBadges ~ userId:",
      userId,
      "category:",
      category,
    );

    // ✅ Apply category filter if passed
    if (category) {
      query += ` AND bm.badge_category = :category`;
    }

    query += ` ORDER BY ub.achievedOn ASC`;

    const badges = await db.sequelize.query(query, {
      replacements: { userId, category },
      type: QueryTypes.SELECT,
    });

    if (!badges.length) return [];

    // ✅ Extract IDs to update isView
    const badgeRowIds = badges.map((b) => b.id);

    await db.sequelize.query(
      `
      UPDATE userBadges
      SET isView = 1
      WHERE id IN (:badgeRowIds)
      `,
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

// export const recalculateCourseProgress = async (userId, FileID) => {
//   try {
//     console.log("🚀 Recalculating:", FileID, userId);

//     // =====================================================
//     // STEP 1: GET MODULE
//     // =====================================================

//     const moduleResult = await db.sequelize.query(
//       `
//       SELECT
//         s.ModuleID,
//         s.SubModuleID
//       FROM filesdetails f
//       JOIN unitsdetails u
//         ON f.UnitID = u.UnitID
//       JOIN submodulesdetails s
//         ON s.SubModuleID = u.SubModuleID
//       WHERE f.FileID = :FileID
//         AND (f.delStatus = 0 OR f.delStatus IS NULL)
//       LIMIT 1
//       `,
//       {
//         replacements: { FileID },
//         type: QueryTypes.SELECT,
//       },
//     );

//     console.log("📍 Module result:", moduleResult);

//     if (!moduleResult.length) {
//       console.log("❌ Module not found for FileID:", FileID);
//       return;
//     }

//     const moduleId = moduleResult[0].ModuleID;
//     const currentSubModuleId = moduleResult[0].SubModuleID;

//     console.log("📚 Resolved:", {
//       moduleId,
//       currentSubModuleId,
//       FileID,
//     });

//     const isAllowed = await isBadgeAllowedForUser(userId, moduleId);

//     console.log("🔐 Badge eligibility:", {
//       userId,
//       moduleId,
//       isAllowed,
//     });

//     if (!isAllowed) {
//       console.log("🚫 Badges not allowed for this user/module");
//       return;
//     }

//     const badges = await db.sequelize.query(
//       ` SELECT bm.id, bm.badge_code,
//         bm.badge_name,bm.badge_category
//       FROM badgesmaster bm
//       INNER JOIN LMSBadgeMap lbm
//         ON lbm.BadgeID = bm.id
//       WHERE lbm.ModuleID = :moduleId
//         AND lbm.delStatus = 0
//         AND bm.delStatus = 0
//       `,
//       {
//         replacements: { moduleId },
//         type: QueryTypes.SELECT,
//       },
//     );

//     console.log("🏅 Badges mapped to Module:", moduleId, badges);

//     const milestoneBadges = badges.filter(
//       (b) => b.badge_category === "Milestone",
//     );

//     const progressBadges = badges.filter(
//       (b) => b.badge_category === "Progress",
//     );

//     const finalBadges = badges.filter((b) => b.badge_category === "Final");

//     // =====================================================
//     // STEP 4: SUBMODULES
//     // =====================================================

//     const submodules = await db.sequelize.query(
//       `
//       SELECT
//         SubModuleID,
//         Milestone,
//         SortingOrder
//       FROM submodulesdetails
//       WHERE ModuleID = :moduleId
//         AND (delStatus = 0 OR delStatus IS NULL)
//       ORDER BY SortingOrder ASC
//       `,
//       {
//         replacements: { moduleId },
//         type: QueryTypes.SELECT,
//       },
//     );

//     let achievedMilestone = 0;
//     let allSubModulesCompleted = true;

//     // =====================================================
//     // STEP 5: SEQUENTIAL CHECK
//     // =====================================================

//     for (const sub of submodules) {
//       const subModuleId = sub.SubModuleID;
//       const milestone = Number(sub.Milestone || 0);

//       const totalRes = await db.sequelize.query(
//         `
//     SELECT COUNT(*) AS total
//     FROM filesdetails f
//     JOIN unitsdetails u
//       ON f.UnitID = u.UnitID
//     WHERE u.SubModuleID = :subModuleId
//       AND f.delStatus = 0
//     `,
//         {
//           replacements: { subModuleId },
//           type: QueryTypes.SELECT,
//         },
//       );

//       const completedRes = await db.sequelize.query(
//         `
//     SELECT COUNT(DISTINCT f.FileID) AS completed
//     FROM videoprogress p
//     JOIN filesdetails f
//       ON f.FileID = p.FileID
//     JOIN unitsdetails u
//       ON f.UnitID = u.UnitID
//     WHERE p.UserID = :userId
//       AND p.IsCompleted = 1
//       AND (p.delStatus = 0 OR p.delStatus IS NULL)
//       AND u.SubModuleID = :subModuleId
//       AND f.delStatus = 0
//     `,
//         {
//           replacements: {
//             userId,
//             subModuleId,
//           },
//           type: QueryTypes.SELECT,
//         },
//       );

//       const total = Number(totalRes[0]?.total || 0);
//       const completed = Number(completedRes[0]?.completed || 0);

//       console.log("========================================");
//       console.log("🎯 SUBMODULE CHECK");
//       console.log("SubModuleID:", subModuleId);
//       console.log("Milestone:", milestone);
//       console.log("Total:", total);
//       console.log("Completed:", completed);
//       console.log("========================================");

//       // -----------------------------------------
//       // SUBMODULE COMPLETED
//       // -----------------------------------------

//       if (total > 0 && completed === total) {
//         // M1, M2, M3...
//         if (milestone > 0) {
//           achievedMilestone = Math.max(achievedMilestone, milestone);
//         }
//       } else {
//         // At least one submodule is incomplete
//         allSubModulesCompleted = false;

//         // Sequential progression
//         break;
//       }
//     }

//     console.log("🏁 Achieved milestone:", achievedMilestone);

//     // =====================================================
//     // STEP 6: TEST M1 ONLY
//     // =====================================================

//     if (achievedMilestone >= 1) {
//       console.log("🎯 M1 CONDITION PASSED");

//       const m1Badge = milestoneBadges.find(
//         (badge) => badge.badge_code === "M1",
//       );

//       if (achievedMilestone >= 1 && m1Badge) {
//         console.log("🏆 Awarding M1");

//         await assignBadge(userId, m1Badge, moduleId);
//       }

//       console.log("🔎 M1 badge:", m1Badge);

//       if (m1Badge) {
//         await assignBadge(userId, m1Badge, moduleId);
//       } else {
//         console.log("🚫 M1 is not mapped to this module");
//       }
//     } else {
//       console.log("⏳ M1 condition NOT reached");
//     }
//   } catch (error) {
//     console.error("❌ Error in recalculateCourseProgress:", error);
//   }
// };

export const recalculateCourseProgress = async (userId, FileID) => {
  try {
    console.log("========================================");
    console.log("🚀 RE-CALCULATING BADGES");
    console.log("UserID:", userId);
    console.log("FileID:", FileID);
    console.log("========================================");

    // =====================================================
    // STEP 1: GET MODULE + CURRENT SUBMODULE
    // =====================================================

    const moduleResult = await db.sequelize.query(
      `
      SELECT
        s.ModuleID,
        s.SubModuleID
      FROM filesdetails f
      JOIN unitsdetails u
        ON f.UnitID = u.UnitID
      JOIN submodulesdetails s
        ON s.SubModuleID = u.SubModuleID
      WHERE f.FileID = :FileID
        AND (f.delStatus = 0 OR f.delStatus IS NULL)
      LIMIT 1
      `,
      {
        replacements: { FileID },
        type: QueryTypes.SELECT,
      },
    );

    console.log("📍 Module result:", moduleResult);

    if (!moduleResult.length) {
      console.log("❌ Module not found for FileID:", FileID);
      return;
    }

    const moduleId = moduleResult[0].ModuleID;
    const currentSubModuleId = moduleResult[0].SubModuleID;

    console.log("📚 Resolved:", {
      moduleId,
      currentSubModuleId,
      FileID,
    });

    // =====================================================
    // STEP 2: CHECK LMS BADGE ELIGIBILITY
    // =====================================================

    const isAllowed = await isBadgeAllowedForUser(userId, moduleId);

    console.log("🔐 Badge eligibility:", {
      userId,
      moduleId,
      isAllowed,
    });

    if (!isAllowed) {
      console.log("🚫 Badges not allowed for this user/module");
      return;
    }

    // =====================================================
    // STEP 3: GET BADGES MAPPED TO THIS LMS
    // =====================================================

    const badges = await db.sequelize.query(
      `
      SELECT
        bm.id,
        bm.badge_code,
        bm.badge_name,
        bm.badge_category
      FROM badgesmaster bm
      INNER JOIN LMSBadgeMap lbm
        ON lbm.BadgeID = bm.id
      WHERE lbm.ModuleID = :moduleId
        AND lbm.delStatus = 0
        AND bm.delStatus = 0
        AND bm.isActive = 1
      `,
      {
        replacements: { moduleId },
        type: QueryTypes.SELECT,
      },
    );

    console.log("🏅 Badges mapped to Module:", moduleId, badges);

    if (!badges.length) {
      console.log("🚫 No badges mapped to this module");
      return;
    }

    // =====================================================
    // SEPARATE BADGE TYPES
    // =====================================================

    const milestoneBadges = badges.filter(
      (b) => b.badge_category === "Milestone",
    );

    const progressBadges = badges.filter(
      (b) => b.badge_category === "Progress",
    );

    const finalBadges = badges.filter((b) => b.badge_category === "Final");

    console.log("🏅 Milestone badges:", milestoneBadges);
    console.log("📊 Progress badges:", progressBadges);
    console.log("🏁 Final badges:", finalBadges);

    // =====================================================
    // STEP 4: GET ALL SUBMODULES OF THIS LMS
    // =====================================================

    const submodules = await db.sequelize.query(
      `
      SELECT
        SubModuleID,
        Milestone,
        SortingOrder
      FROM submodulesdetails
      WHERE ModuleID = :moduleId
        AND (delStatus = 0 OR delStatus IS NULL)
      ORDER BY SortingOrder ASC
      `,
      {
        replacements: { moduleId },
        type: QueryTypes.SELECT,
      },
    );

    console.log("📚 Submodules:", submodules);

    if (!submodules.length) {
      console.log("🚫 No submodules found for module:", moduleId);
      return;
    }

    let achievedMilestone = 0;

    // This will remain TRUE only if EVERY submodule
    // has been completed.
    let allSubModulesCompleted = true;

    // =====================================================
    // STEP 5: CHECK SUBMODULE COMPLETION
    // =====================================================

    for (const sub of submodules) {
      const subModuleId = sub.SubModuleID;

      const milestone = Number(sub.Milestone || 0);

      // ---------------------------------------------------
      // TOTAL FILES IN SUBMODULE
      // ---------------------------------------------------

      const totalRes = await db.sequelize.query(
        `
        SELECT COUNT(DISTINCT f.FileID) AS total
        FROM filesdetails f
        JOIN unitsdetails u
          ON f.UnitID = u.UnitID
        WHERE u.SubModuleID = :subModuleId
          AND (f.delStatus = 0 OR f.delStatus IS NULL)
        `,
        {
          replacements: {
            subModuleId,
          },
          type: QueryTypes.SELECT,
        },
      );

      // ---------------------------------------------------
      // COMPLETED FILES IN SUBMODULE
      // ---------------------------------------------------

      const completedRes = await db.sequelize.query(
        `
        SELECT COUNT(DISTINCT f.FileID) AS completed
        FROM videoprogress p
        JOIN filesdetails f
          ON f.FileID = p.FileID
        JOIN unitsdetails u
          ON f.UnitID = u.UnitID
        WHERE p.UserID = :userId
          AND p.IsCompleted = 1
          AND (p.delStatus = 0 OR p.delStatus IS NULL)
          AND u.SubModuleID = :subModuleId
          AND (f.delStatus = 0 OR f.delStatus IS NULL)
        `,
        {
          replacements: {
            userId,
            subModuleId,
          },
          type: QueryTypes.SELECT,
        },
      );

      const total = Number(totalRes[0]?.total || 0);

      const completed = Number(completedRes[0]?.completed || 0);

      console.log("========================================");
      console.log("🎯 SUBMODULE CHECK");
      console.log("SubModuleID:", subModuleId);
      console.log("SortingOrder:", sub.SortingOrder);
      console.log("Milestone:", milestone);
      console.log("Total:", total);
      console.log("Completed:", completed);
      console.log("========================================");

      // ---------------------------------------------------
      // SUBMODULE COMPLETED
      // ---------------------------------------------------

      if (total > 0 && completed === total) {
        console.log(`✅ Submodule ${subModuleId} COMPLETED`);

        // M1/M2/M3...
        if (milestone > 0) {
          achievedMilestone = Math.max(achievedMilestone, milestone);
        }
      } else {
        console.log(`⏳ Submodule ${subModuleId} NOT completed`);

        allSubModulesCompleted = false;

        // Sequential progression.
        // Stop checking further submodules.
        break;
      }
    }

    console.log("========================================");
    console.log("🏁 Achieved milestone:", achievedMilestone);
    console.log("🎯 All submodules completed:", allSubModulesCompleted);
    console.log("========================================");

    // =====================================================
    // STEP 6: M1 - M6 BADGES
    // =====================================================

    for (const badge of milestoneBadges) {
      // FMC is handled separately.
      if (badge.badge_code === "FMC") {
        continue;
      }

      // M1 -> 1
      // M2 -> 2
      // M3 -> 3
      // M4 -> 4
      // M5 -> 5
      // M6 -> 6

      const requiredMilestone = Number(badge.badge_code.replace("M", ""));

      if (!requiredMilestone) {
        continue;
      }

      console.log("🔎 Checking milestone badge:", {
        badgeCode: badge.badge_code,
        badgeName: badge.badge_name,
        requiredMilestone,
        achievedMilestone,
      });

      if (achievedMilestone >= requiredMilestone) {
        console.log(`🏆 Awarding ${badge.badge_code}: ${badge.badge_name}`);

        await assignBadge(userId, badge, moduleId);
      }
    }

    // =====================================================
    // STEP 7: FMC - FULL MODULE COMPLETION
    // =====================================================

    if (allSubModulesCompleted) {
      console.log("🎯 FULL MODULE COMPLETED");

      const fmcBadge = milestoneBadges.find(
        (badge) => badge.badge_code === "FMC",
      );

      console.log("🔎 FMC badge:", fmcBadge);

      if (fmcBadge) {
        console.log("🏆 Awarding FMC:", fmcBadge.badge_name);

        await assignBadge(userId, fmcBadge, moduleId);
      } else {
        console.log("🚫 FMC is not mapped to this module");
      }
    } else {
      console.log("⏳ Full module not completed yet");
    }

    // =====================================================
    // STEP 8: MODULE FILE PROGRESS
    // =====================================================

    const moduleStats = await db.sequelize.query(
      `
        SELECT

          COUNT(
            DISTINCT f.FileID
          ) AS totalFiles,

          COUNT(
            DISTINCT CASE
              WHEN vp.IsCompleted = 1
              THEN f.FileID
            END
          ) AS completedFiles

        FROM filesdetails f

        JOIN unitsdetails u
          ON f.UnitID = u.UnitID

        JOIN submodulesdetails s
          ON s.SubModuleID = u.SubModuleID

        LEFT JOIN videoprogress vp
          ON vp.FileID = f.FileID
          AND vp.UserID = :userId
          AND vp.IsCompleted = 1
          AND (
            vp.delStatus = 0
            OR vp.delStatus IS NULL
          )

        WHERE s.ModuleID = :moduleId
          AND (
            f.delStatus = 0
            OR f.delStatus IS NULL
          )
        `,
      {
        replacements: {
          userId,
          moduleId,
        },
        type: QueryTypes.SELECT,
      },
    );

    const totalFiles = Number(moduleStats[0]?.totalFiles || 0);

    const completedFiles = Number(moduleStats[0]?.completedFiles || 0);

    const modulePercent =
      totalFiles > 0 ? (completedFiles / totalFiles) * 100 : 0;

    console.log("========================================");
    console.log("📊 MODULE PROGRESS");
    console.log("ModuleID:", moduleId);
    console.log("Total files:", totalFiles);
    console.log("Completed files:", completedFiles);
    console.log("Module percentage:", modulePercent);
    console.log("========================================");

    // =====================================================
    // STEP 9: 25P / 50P / 100P
    // =====================================================

    for (const badge of progressBadges) {
      // 25P -> 25
      // 50P -> 50
      // 100P -> 100

      const requiredPercent = Number(badge.badge_code.replace("P", ""));

      if (!requiredPercent) {
        continue;
      }

      console.log("📊 Checking progress badge:", {
        badgeCode: badge.badge_code,
        badgeName: badge.badge_name,
        requiredPercent,
        modulePercent,
      });

      if (modulePercent >= requiredPercent) {
        console.log(`🏆 Awarding ${badge.badge_code}: ${badge.badge_name}`);

        await assignBadge(userId, badge, moduleId);
      }
    }

    // =====================================================
    // STEP 10: FINAL BADGES
    // =====================================================
    // FCC / FF will be implemented separately.
    // We are intentionally NOT handling them yet.

    console.log("🏁 Badge recalculation completed");

    console.log("========================================");
  } catch (error) {
    console.error("❌ Error in recalculateCourseProgress:", error);
  }
};

export const assignBadge = async (userId, badge, moduleId) => {
  try {
    console.log("🚀 Assigning badge:", {
      userId,
      moduleId,
      badgeId: badge.id,
      badgeCode: badge.badge_code,
      badgeName: badge.badge_name,
    });

    const exists = await UserBadges.findOne({
      where: {
        userId,
        badgesId: badge.id,
        ModuleID: moduleId,
        delStatus: 0,
      },
    });

    if (exists) {
      console.log("ℹ️ Badge already assigned:", badge.badge_name);
      return;
    }

    await UserBadges.create({
      userId,
      badgesId: badge.id,
      ModuleID: moduleId,
      isView: 0,
      achievedOn: new Date(),
      AuthAdd: userId,
      AddOnDt: new Date(),
      delStatus: 0,
    });

    console.log(
      "🎉 Badge assigned successfully:",
      badge.badge_name,
      "Module:",
      moduleId,
    );
  } catch (error) {
    console.error("❌ Error assigning badge:", error);
  }
};

// First Finisher logic: checks if total time spent is less than 30 hours (108000 seconds)
const isFirstFinisher = async (userId) => {
  try {
    // ⏱️ Get total time spent by user (in seconds)
    const result = await db.sequelize.query(
      `
      SELECT SUM(IFNULL(ulp.TimeSpentSeconds, 0)) AS totalSeconds
      FROM videoprogress vp
      LEFT JOIN userlmsprogress ulp 
        ON vp.FileID = ulp.FileID
        AND IFNULL(ulp.delstatus, 0) = 0
      WHERE vp.userId = :userId
        AND IFNULL(vp.delstatus, 0) = 0
      `,
      {
        replacements: { userId },
        type: QueryTypes.SELECT,
      },
    );

    const totalSeconds = Number(result[0]?.totalSeconds || 0);

    console.log("⏱️ Total Seconds:", totalSeconds);

    // ✅ 30 hours = 108000 seconds
    if (totalSeconds < 108000) {
      return true; // Eligible for FF
    }

    return false; // Not eligible
  } catch (error) {
    console.error("❌ Error in isFirstFinisher:", error);
    return false;
  }
};

export const assignFCCBadgeIfPassed = async (userId, isPass) => {
  try {
    if (!isPass) return;

    console.log(
      "✅ User passed final test, checking FCC badge assignment for userId:",
      userId,
    );

    const badge = await BadgesMaster.findOne({
      where: { badge_code: "FCC" },
      attributes: ["id", "badge_code", "badge_name"],
    });

    console.log("Badge to assign:", badge?.badge_code);

    if (badge) {
      await assignBadge(userId, badge, moduleId);
    }
  } catch (error) {
    console.error("Error assigning FCC badge:", error);
    throw error;
  }
};

// FCC badge is now assigned based on final test result, so we need to check if user passed the test and then assign the badge accordingly. This function can be called from the part of code where final test result is processed.

export const popFCCUserBadges = async (userId) => {
  try {
    let query = `
      SELECT 
        ub.id,
        ub.userId,
        ub.badgesId,
        ub.achievedOn,
        bm.badge_name,
        bm.badge_code,
        bm.badge_category,
        bm.badge_order,
         ub.isView,
        bm.badge
      FROM userBadges ub
      INNER JOIN badgesmaster bm 
        ON bm.id = ub.badgesId 
        AND bm.badge_code = 'FCC'
      WHERE ub.userId = :userId
        AND ub.isView = 0
        AND ub.delStatus = 0
        AND bm.delStatus = 0
        AND bm.isActive = 1
      ORDER BY ub.achievedOn ASC
    `;

    const badges = await db.sequelize.query(query, {
      replacements: { userId },
      type: QueryTypes.SELECT,
    });

    if (!badges.length) return [];

    // ✅ Mark as viewed
    const badgeRowIds = badges.map((b) => b.id);

    await db.sequelize.query(
      `
      UPDATE userBadges
      SET isView = 1
      WHERE id IN (:badgeRowIds)
      `,
      {
        replacements: { badgeRowIds },
        type: QueryTypes.UPDATE,
      },
    );

    return badges;
  } catch (err) {
    console.error("Pop FCC badge error:", err);
    throw err;
  }
};
