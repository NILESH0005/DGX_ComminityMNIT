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
        ON bm.id = ub.badgesId
      WHERE ub.userId = :userId
        AND ub.isView = 0
        AND ub.delStatus = 0
        AND bm.delStatus = 0
        AND bm.isActive = 1
    `;

console.log(
  "🚀 ~ file: UserbadgesService.js:122 ~ popUserBadges ~ userId:",
  userId, "category:", category
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
      }
    );

    return badges;

  } catch (err) {
    console.error("Pop badge error:", err);
    throw err;
  }
};










export const recalculateCourseProgress = async (userId, FileID) => {
  try {
    console.log("🚀 Recalculating:", FileID, userId);

    // =====================================================
    // ✅ STEP 1: GET MODULE
    // =====================================================
    const moduleResult = await db.sequelize.query(
      `
      SELECT s.ModuleID
      FROM filesdetails f
      JOIN unitsdetails u ON f.UnitID = u.UnitID
      JOIN submodulesdetails s ON s.SubModuleID = u.SubModuleID
      WHERE f.FileID = :FileID
      `,
      {
        replacements: { FileID },
        type: QueryTypes.SELECT,
      }
    );

    if (!moduleResult.length) return;
    const moduleId = moduleResult[0].ModuleID;

    // =====================================================
    // ✅ STEP 2: GET BADGES
    // =====================================================
    const badges = await db.sequelize.query(
      `SELECT id, badge_code, badge_name, badge_category FROM badgesmaster`,
      { type: QueryTypes.SELECT }
    );

    const milestoneBadges = badges.filter(b => b.badge_category === "Milestone");
    const progressBadges = badges.filter(b => b.badge_category === "Progress");
    const finalBadges = badges.filter(b => b.badge_category === "Final");

    // =====================================================
    // ✅ STEP 3: SUBMODULES (WITH MILESTONE)
    // =====================================================
    const submodules = await db.sequelize.query(
      `
      SELECT SubModuleID, Milestone, SortingOrder
      FROM submodulesdetails
      WHERE ModuleID = :moduleId AND delStatus = 0
      ORDER BY SortingOrder ASC
      `,
      {
        replacements: { moduleId },
        type: QueryTypes.SELECT,
      }
    );

    let achievedMilestone = 0;
    let isFirstModuleCompleted = false;

    // =====================================================
    // ✅ STEP 4: SEQUENTIAL CHECK
    // =====================================================
    for (const sub of submodules) {
      const subModuleId = sub.SubModuleID;
      const milestone = Number(sub.Milestone || 0);

      const totalRes = await db.sequelize.query(
        `
        SELECT COUNT(*) as total
        FROM filesdetails f
        JOIN unitsdetails u ON f.UnitID = u.UnitID
        WHERE u.SubModuleID = :subModuleId
          AND f.delStatus = 0
        `,
        { replacements: { subModuleId }, type: QueryTypes.SELECT }
      );

      const completedRes = await db.sequelize.query(
        `
        SELECT COUNT(*) as completed
        FROM videoprogress p
        JOIN filesdetails f ON f.FileID = p.FileID
        JOIN unitsdetails u ON f.UnitID = u.UnitID
        WHERE p.userId = :userId
          AND p.isCompleted = 1
          AND (p.delStatus = 0 OR p.delStatus IS NULL)
          AND u.SubModuleID = :subModuleId
        `,
        { replacements: { userId, subModuleId }, type: QueryTypes.SELECT }
      );

      const total = Number(totalRes[0]?.total || 0);
      const completed = Number(completedRes[0]?.completed || 0);

      console.log("📊", subModuleId, "Milestone:", milestone, total, completed);

      // ✅ FMC CONDITION (ONLY FIRST MODULE)
      if (sub.SortingOrder === 1 && total > 0 && completed === total) {
        isFirstModuleCompleted = true;
      }

      // ✅ MILESTONE TRACK (ONLY IF DB milestone > 0)
      if (total > 0 && completed === total) {
        if (milestone > 0) {
          achievedMilestone = milestone;
        }
      } else {
        break;
      }
    }

    console.log("🏁 Milestone:", achievedMilestone);
    console.log("🎯 First Module:", isFirstModuleCompleted);

    // =====================================================
    // 🎯 STEP 5: COURSE PROGRESS
    // =====================================================
    const stats = await db.sequelize.query(
      `
      SELECT 
        COUNT(f.FileId) as total,
        COUNT(vp.ProgressId) as completed
      FROM filesdetails f
      LEFT JOIN videoprogress vp 
        ON vp.FileId = f.FileId 
        AND vp.userId = :userId
        AND vp.isCompleted = 1
        AND (vp.delStatus = 0 OR vp.delStatus IS NULL)
      WHERE f.delStatus = 0
      `,
      {
        replacements: { userId },
        type: QueryTypes.SELECT,
      }
    );

    const totalCourse = Number(stats[0]?.total || 0);
    const completedCourse = Number(stats[0]?.completed || 0);

    const coursePercent =
      totalCourse > 0 ? (completedCourse / totalCourse) * 100 : 0;

    console.log("📊 Course %:", coursePercent);

    const allowMilestone = achievedMilestone > 0;
    const allowFinal = achievedMilestone > 0 && coursePercent === 100;

    // =====================================================
    // 🏆 STEP 6: FMC (INDEPENDENT)
    // =====================================================
    if (isFirstModuleCompleted) {
      for (const badge of milestoneBadges) {
        if (badge.badge_code === "FMC") {
          await assignBadge(userId, badge);
        }
      }
    }

    // =====================================================
    // 🏆 STEP 7: MILESTONE BADGES (ONLY IF milestone > 0)
    // =====================================================
    if (allowMilestone) {
      for (const badge of milestoneBadges) {
        if (badge.badge_code.startsWith("M")) {
          const level = Number(badge.badge_code.replace("M", "") || 0);

          if (level && achievedMilestone >= level) {
            await assignBadge(userId, badge);
          }
        }
      }
    }

    // =====================================================
    // 📊 STEP 8: PROGRESS (ALWAYS)
    // =====================================================
    for (const badge of progressBadges) {
      const percent = Number(badge.badge_code.replace("P", "") || 0);

      if (percent && coursePercent >= percent) {
        await assignBadge(userId, badge);
      }
    }

    // =====================================================
    // 🏁 STEP 9: FINAL
    // =====================================================
    if (allowFinal) {
      for (const badge of finalBadges) {
        if (badge.badge_code === "FCC") {
          await assignBadge(userId, badge);
        }

        if (badge.badge_code === "FF") {
          const isFirst = await isFirstFinisher();
          if (isFirst) {
            await assignBadge(userId, badge);
          }
        }
      }
    }

  } catch (error) {
    console.error("❌ Error:", error);
  }
};


// =====================================================
// 🏆 ASSIGN BADGE
// =====================================================
async function assignBadge(userId, badge) {
  const exists = await UserBadges.findOne({
    where: { userId, badgesId: badge.id },
  });

  if (exists) return;

  await UserBadges.create({
    userId,
    badgesId: badge.id,
    isView: 0,
    achievedOn: new Date(),
    AuthAdd: userId,
    AddOnDt: new Date(),
    delStatus: 0,
  });

  console.log("🎉 Assigned:", badge.badge_name);
}