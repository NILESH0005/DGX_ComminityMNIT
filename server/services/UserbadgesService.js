import db from "../models/index.js";
import { QueryTypes } from "sequelize";
import { sendApplicationMail } from "./mailService.js";
import fs from "fs/promises";
import path from "path";
// import { getBadgeThreshold } from "../server/services/badgeThresholdService.js";

const { BadgesMaster, UserBadges } = db;

export const getBadgeThreshold = async () => {
  try {
    const setup = await db.Setup.findOne({
      where: {
        setupName: "Badges",
        delStatus: 0,
      },
      attributes: ["threshold"],
    });

    if (!setup || setup.threshold === null || setup.threshold === undefined) {
      return 100;
    }

    // MySQL DECIMAL comes back as a string ("80.00") — convert it.
    const threshold = Number(setup.threshold);

    if (!Number.isFinite(threshold) || threshold < 0 || threshold > 100) {
      return 100;
    }

    return threshold;
  } catch (error) {
    console.error("Error fetching badge threshold:", error);
    return 100;
  }
};

/* =====================================================
   BADGE EMAIL — one place for ALL badges (LMS + non-LMS)
   Called after ANY new UserBadges row is created.
   Each TemplateCode must exist in MailTemplateMaster and point to
   an HTML file in templates/emails/.
   `cid` must match the <img src="cid:..."> inside that HTML file.
===================================================== */
const BADGE_MAIL_CONFIG = {
  FL: { templateCode: "FIRST_LOGIN_BADGE", cid: "first-login-badge" },   // first-badge-email.html
  FMC: { templateCode: "FIRST_MODULE_BADGE", cid: "first-module-badge" }, // first-module-email.html
  "7DS": {
    templateCode: "STREAK_BADGE", // streak-badge-email.html
    cid: "streak-badge",
    extraData: { streak_days: 7 },
  },
  HS: { templateCode: "LONGEST_STREAK_BADGE", cid: "longest-streak-badge" }, // longest-streak-email.html
  FCC: { templateCode: "CERTIFICATE_BADGE", cid: "certificate-badge" },     // certificate-email.html
};

// M1, M2 ... M6 -> milestone-badge-email.html
const MILESTONE_MAIL_CONFIG = { templateCode: "MILESTONE_BADGE", cid: "milestone-badge" };

// 25P, 50P, 100P -> course-progress-email.html
const PROGRESS_MAIL_CONFIG = { templateCode: "COURSE_PROGRESS_BADGE", cid: "progress-badge" };

// Any other badge -> big-badge-email.html
const DEFAULT_MAIL_CONFIG = { templateCode: "BADGE_AWARDED", cid: "badge-image" };

const resolveBadgeMailConfig = (code = "") => {
  if (BADGE_MAIL_CONFIG[code]) return BADGE_MAIL_CONFIG[code];

  const milestone = code.match(/^M(\d+)$/);
  if (milestone) {
    return {
      ...MILESTONE_MAIL_CONFIG,
      extraData: { milestone_number: Number(milestone[1]) },
    };
  }

  const progress = code.match(/^(\d+)P$/);
  if (progress) {
    return {
      ...PROGRESS_MAIL_CONFIG,
      extraData: {
        progress_percent: Number(progress[1]),
        completion_percentage: `${Number(progress[1])}%`, // used by course-progress-email.html
      },
    };
  }

  return DEFAULT_MAIL_CONFIG;
};

/* Badges NOT tied to an LMS module -> skip LMS eligibility check */
const NON_LMS_BADGES = ["FL", "7DS", "HS"];

const getModuleName = async (moduleId) => {
  if (!moduleId) return null;
  try {
    const rows = await db.sequelize.query(
      `SELECT ModuleName FROM moduledetails WHERE ModuleID = :moduleId LIMIT 1`,
      { replacements: { moduleId }, type: QueryTypes.SELECT },
    );
    return rows?.[0]?.ModuleName || null;
  } catch {
    return null;
  }
};

/* -----------------------------------------------------
   getMailTemplate() throws on ANY {{placeholder}} that is
   missing/undefined in data. Before sending a badge email we
   read the template, fill unknown placeholders with "" and log
   a warning, so a template change never silently blocks mails.
----------------------------------------------------- */
const MAIL_TEMPLATE_DIR = path.resolve(process.cwd(), "templates", "emails");

const prepareTemplateData = async (templateCode, data) => {
  const template = await db.MailTemplateMaster.findOne({
    where: { TemplateCode: templateCode, delStatus: 0 },
    attributes: ["TemplateFileName", "Subject"],
  });

  if (!template) {
    console.warn(
      `📧 Badge email skipped: template "${templateCode}" not found in MailTemplateMaster`,
    );
    return null;
  }

  let html = "";
  try {
    html = await fs.readFile(
      path.resolve(MAIL_TEMPLATE_DIR, path.basename(template.TemplateFileName)),
      "utf-8",
    );
  } catch (err) {
    console.warn(
      `📧 Badge email skipped: cannot read ${template.TemplateFileName} (${err.message})`,
    );
    return null;
  }

  const keys = new Set();
  for (const m of html.matchAll(/\{\{(\w+)\}\}/g)) keys.add(m[1]);
  for (const m of String(template.Subject || "").matchAll(/{{\s*([a-zA-Z0-9_]+)\s*}}/g)) {
    keys.add(m[1]);
  }

  const filled = { ...data };
  const missing = [];
  for (const key of keys) {
    if (filled[key] === undefined || filled[key] === null) {
      filled[key] = "";
      missing.push(key);
    }
  }

  if (missing.length) {
    console.warn(
      `📧 ${templateCode}: placeholders not provided, sent as empty -> ${missing.join(", ")}`,
    );
  }

  return filled;
};

/**
 * Sends the "badge awarded" email.
 * Never throws — an email failure must never undo or block a badge.
 * Callers do NOT await it, so login / file switching is not slowed down.
 */
const sendBadgeMail = async (userId, badgeId, { moduleId = null, moduleName = null } = {}) => {
  try {
    // Always load the full badge (some callers don't select the image)
    const badge = await BadgesMaster.findOne({
      where: { id: badgeId },
      attributes: ["id", "badge_code", "badge_name", "badge_category", "badge"],
    });

    if (!badge) {
      console.warn("Badge email skipped: badge not found", badgeId);
      return;
    }

    const code = badge.badge_code;
    const config = resolveBadgeMailConfig(code);

    const user = await db.User.findOne({
      where: { UserID: userId, delStatus: 0 },
      attributes: ["UserID", "Name", "EmailId"],
    });

    if (!user?.EmailId) {
      console.warn(`${code} badge email skipped: user email not found`, userId);
      return;
    }

    const rawBadge = badge.badge || "";
    const imageMatch = rawBadge.match(
      /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/s,
    );
    const badgeImageContent = imageMatch ? imageMatch[2] : rawBadge;
    const badgeImageMimeType = imageMatch ? imageMatch[1] : "image/png";

    const resolvedModuleName = moduleName || (await getModuleName(moduleId));

    const mailData = await prepareTemplateData(config.templateCode, {
      user_name: user.Name || "Learner",
      badge_name: badge.badge_name || "",
      badge_code: code,
      badge_category: badge.badge_category || "",
      module_name: resolvedModuleName || "",
      modules_url: process.env.LMS_MODULES_URL || "",
      badges_url: process.env.LMS_BADGES_URL || "",
      platform_name: "DGX Community",
      // Shows the badge INSIDE the template: <img src="{{badge_image_url}}">
      // points to the inline image below, so it is not shown as an attachment.
      badge_image_url: badgeImageContent ? `cid:${config.cid}` : "",
      ...(config.extraData || {}),
    });

    if (!mailData) return; // template row/file missing (warning already logged)

    console.log(`📧 ${code} BADGE EMAIL -> ${user.EmailId} (${config.templateCode})`);

    const mailResult = await sendApplicationMail({
      templateCode: config.templateCode,
      userId: user.UserID,
      recipientEmail: user.EmailId,
      userMailType: config.templateCode,
      LMSID: moduleId || null,
      authUserId: "SYSTEM",
      data: mailData,
      inlineImages: badgeImageContent
        ? [
            {
              content: badgeImageContent,
              mime_type: badgeImageMimeType,
              cid: config.cid,
            },
          ]
        : [],
    });

    console.log(`📧 ${code} BADGE MAIL RESULT:`, mailResult);
  } catch (mailError) {
    console.error("❌ BADGE EMAIL ERROR:", mailError);
  }
};

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

// export const  awardUserBadge = async (userId, eventName) => {
//   if (!(await isBadgeAllowedForUser(userId))) {
//     return { success: false, message: "Badge not allowed" };
//   }
//   try {
//     const badge = await BadgesMaster.findOne({
//       where: {
//         badge_code: eventName,
//         isActive: 1,
//         delStatus: 0,
//       },
//       attributes: ["id", "badge_code", "badge_category", "badge_name", "badge"],
//     });

//     if (!badge) {
//       return { success: false, message: "Badge not found" };
//     }

//     const badgesId = badge.id;
//     console.log("🚀 badgesId:", badgesId);

//     // Prevent duplicate badge
//     const existing = await UserBadges.findOne({
//       where: { userId, badgesId, delStatus: 0 },
//     });

//     if (existing) {
//       return {
//         success: true,
//         message: "Badge already achieved",
//         badgeId: badgesId,
//         data: null,
//       };
//     }

//     // ✅ Correct: include isView default
//     const created = await UserBadges.create({
//       userId,
//       badgesId,
//       achievedOn: new Date(),
//       AuthAdd: userId,
//       AddOnDt: new Date(),
//       delStatus: 0,
//       isView: 1, // <--- must set this to avoid Sequelize notNull error
//     });

//     return {
//       success: true,
//       message: "Badge awarded successfully",
//       badgeId: badgesId,
//       achievementId: created.id,
//       data: badge,
//     };
//   } catch (error) {
//     console.error("Badge award error:", error);
//     return { success: false, message: "Failed to save achievement" };
//   }
// };

export const awardUserBadge = async (userId, eventName) => {
  console.log("========== BADGE PROCESS STARTED ==========");
  console.log("User ID:", userId);
  console.log("Event Name:", eventName);
  try {
    // Skip LMS eligibility only for First Login badge
    if (
      !NON_LMS_BADGES.includes(eventName) &&
      !(await isBadgeAllowedForUser(userId))
    ) {
      return {
        success: false,
        message: "Badge not allowed",
      };
    }

    // Find badge
    const badge = await BadgesMaster.findOne({
      where: {
        badge_code: eventName,
        isActive: 1,
        delStatus: 0,
      },
      attributes: ["id", "badge_code", "badge_category", "badge_name", "badge"],
    });

    if (!badge) {
      return {
        success: false,
        message: "Badge not found",
      };
    }
    console.log("BADGE MASTER RESULT:", badge?.toJSON());

    const badgesId = badge.id;

    // Check whether badge already exists
    const existing = await UserBadges.findOne({
      where: {
        userId,
        badgesId,
        delStatus: 0,
      },
    });

    if (existing) {
      return {
        success: true,
        newlyAwarded: false,
        message: "Badge already achieved",
        badgeId: badgesId,
        data: badge,
      };
    }

    console.log("EXISTING USER BADGE:", existing?.toJSON());
    // Create badge achievement
    const created = await UserBadges.create({
      userId,
      badgesId,
      achievedOn: new Date(),
      AuthAdd: userId,
      AddOnDt: new Date(),
      delStatus: 0,
      isView: 1,
    });

    // 📧 Email for ANY newly awarded badge (not awaited)
    sendBadgeMail(userId, badgesId);

    return {
      success: true,
      newlyAwarded: true,
      message: "Badge awarded successfully",
      badgeId: badgesId,
      achievementId: created.id,
      data: badge,
    };
  } catch (error) {
    console.error("Badge award error:", error);

    return {
      success: false,
      message: "Failed to save achievement",
    };
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

    // 📧 Email for a newly awarded badge (not awaited)
    if (created) {
      sendBadgeMail(userId, badge.id);
    }

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
  s.SubModuleID,
  md.ModuleName
FROM filesdetails f
JOIN unitsdetails u
  ON f.UnitID = u.UnitID
JOIN submodulesdetails s
  ON s.SubModuleID = u.SubModuleID
JOIN ModuleDetails md
  ON md.ModuleID = s.ModuleID
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
    const moduleName = moduleResult[0].ModuleName;
    const threshold = await getBadgeThreshold();
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
        bm.badge_category,
        bm.badge
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
    // STEP 4: SUBMODULE STATS (per-file threshold, single query)
    // A file QUALIFIES only if:
    //   - it is completed (VideoProgress.IsCompleted = 1), AND
    //   - its OWN time spent >= threshold % of its OWN EstimatedTime
    // filesdetails.EstimatedTime is in MINUTES  -> * 60
    // UserLmsProgress.TimeSpentSeconds is in SECONDS
    // File with no EstimatedTime -> only completion is checked.
    // =====================================================

    console.log("🎚️ Badge threshold:", threshold);

    const submodules = await db.sequelize.query(
      `
      SELECT
        s.SubModuleID,
        s.Milestone,
        s.SortingOrder,
        COUNT(f.FileID) AS totalFiles,
        COALESCE(SUM(CASE WHEN vp.FileID IS NOT NULL THEN 1 ELSE 0 END), 0) AS completedFiles,
        COALESCE(SUM(
          CASE
            WHEN vp.FileID IS NOT NULL
             AND (
               COALESCE(f.EstimatedTime, 0) = 0
               OR COALESCE(t.spent, 0) >= (f.EstimatedTime * 60 * :threshold / 100)
             )
            THEN 1 ELSE 0
          END
        ), 0) AS qualifiedFiles
      FROM submodulesdetails s
      LEFT JOIN unitsdetails u
        ON u.SubModuleID = s.SubModuleID
        AND (u.delStatus = 0 OR u.delStatus IS NULL)
      LEFT JOIN filesdetails f
        ON f.UnitID = u.UnitID
        AND (f.delStatus = 0 OR f.delStatus IS NULL)
      LEFT JOIN (
        SELECT DISTINCT FileID
        FROM videoprogress
        WHERE UserID = :userId
          AND IsCompleted = 1
          AND (delStatus = 0 OR delStatus IS NULL)
      ) vp ON vp.FileID = f.FileID
      LEFT JOIN (
        SELECT FileID, SUM(COALESCE(TimeSpentSeconds, 0)) AS spent
        FROM UserLmsProgress
        WHERE UserID = :userId
          AND EndTime IS NOT NULL
          AND (delStatus = 0 OR delStatus IS NULL)
        GROUP BY FileID
      ) t ON t.FileID = f.FileID
      WHERE s.ModuleID = :moduleId
        AND (s.delStatus = 0 OR s.delStatus IS NULL)
      GROUP BY s.SubModuleID, s.Milestone, s.SortingOrder
      ORDER BY s.SortingOrder ASC
      `,
      {
        replacements: { userId, moduleId, threshold },
        type: QueryTypes.SELECT,
      },
    );

    if (!submodules.length) {
      console.log("🚫 No submodules found for module:", moduleId);
      return;
    }

    let achievedMilestone = 0;

    // This will remain TRUE only if EVERY submodule qualifies.
    let allSubModulesCompleted = true;

    // =====================================================
    // STEP 5: SEQUENTIAL CHECK
    // Submodule qualifies only when EVERY file in it qualifies
    // (completed + its own time >= threshold).
    // =====================================================

    for (const sub of submodules) {
      const subModuleId = sub.SubModuleID;
      const milestone = Number(sub.Milestone || 0);
      const totalFiles = Number(sub.totalFiles || 0);
      const completedFiles = Number(sub.completedFiles || 0);
      const qualifiedFiles = Number(sub.qualifiedFiles || 0);

      const isEligible = totalFiles > 0 && qualifiedFiles >= totalFiles;

      console.log("🎯 SUBMODULE CHECK", {
        subModuleId,
        sortingOrder: sub.SortingOrder,
        milestone,
        totalFiles,
        completedFiles,
        qualifiedFiles,
        threshold,
        isEligible,
      });

      if (isEligible) {
        console.log(`✅ Submodule ${subModuleId} QUALIFIED`);

        if (milestone > 0) {
          achievedMilestone = Math.max(achievedMilestone, milestone);
        }
      } else {
        console.log(`⏳ Submodule ${subModuleId} NOT qualified`);
        allSubModulesCompleted = false;
        break; // sequential rule
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

        await assignBadge(userId, badge, moduleId, moduleName);
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

        await assignBadge(userId, fmcBadge, moduleId, moduleName);
      } else {
        console.log("🚫 FMC is not mapped to this module");
      }
    } else {
      console.log("⏳ Full module not completed yet");
    }

    // =====================================================
    // STEP 8: MODULE PROGRESS (threshold applied per file)
    // A file counts only if it is completed AND
    // time spent >= threshold % of its EstimatedTime (minutes * 60).
    // File with no EstimatedTime -> only completion is checked.
    // =====================================================

    const moduleStats = await db.sequelize.query(
      `
      SELECT
        COUNT(f.FileID) AS totalFiles,
        COALESCE(SUM(CASE WHEN vp.FileID IS NOT NULL THEN 1 ELSE 0 END), 0) AS completedFiles,
        COALESCE(SUM(
          CASE
            WHEN vp.FileID IS NOT NULL
             AND (
               COALESCE(f.EstimatedTime, 0) = 0
               OR COALESCE(t.spent, 0) >= (f.EstimatedTime * 60 * :threshold / 100)
             )
            THEN 1 ELSE 0
          END
        ), 0) AS qualifiedFiles
      FROM filesdetails f
      JOIN unitsdetails u
        ON f.UnitID = u.UnitID
        AND (u.delStatus = 0 OR u.delStatus IS NULL)
      JOIN submodulesdetails s
        ON s.SubModuleID = u.SubModuleID
        AND (s.delStatus = 0 OR s.delStatus IS NULL)
      LEFT JOIN (
        SELECT DISTINCT FileID
        FROM videoprogress
        WHERE UserID = :userId
          AND IsCompleted = 1
          AND (delStatus = 0 OR delStatus IS NULL)
      ) vp ON vp.FileID = f.FileID
      LEFT JOIN (
        SELECT FileID, SUM(COALESCE(TimeSpentSeconds, 0)) AS spent
        FROM UserLmsProgress
        WHERE UserID = :userId
          AND EndTime IS NOT NULL
          AND (delStatus = 0 OR delStatus IS NULL)
        GROUP BY FileID
      ) t ON t.FileID = f.FileID
      WHERE s.ModuleID = :moduleId
        AND (f.delStatus = 0 OR f.delStatus IS NULL)
      `,
      {
        replacements: { userId, moduleId, threshold },
        type: QueryTypes.SELECT,
      },
    );

    const totalFiles = Number(moduleStats[0]?.totalFiles || 0);
    const completedFiles = Number(moduleStats[0]?.completedFiles || 0);
    const qualifiedFiles = Number(moduleStats[0]?.qualifiedFiles || 0);

    const modulePercent =
      totalFiles > 0 ? (qualifiedFiles / totalFiles) * 100 : 0;

    console.log("========================================");
    console.log("📊 MODULE PROGRESS", {
      moduleId,
      totalFiles,
      completedFiles,
      qualifiedFiles,
      threshold,
      modulePercent: modulePercent.toFixed(1),
    });
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

        await assignBadge(userId, badge, moduleId, moduleName);
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

export const assignBadge = async (userId, badge, moduleId, moduleName) => {
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

    // 📧 Email for ANY newly awarded LMS badge (M1-M6, FMC, 25P/50P/100P, FCC)
    // Not awaited, so file switching is not slowed down.
    sendBadgeMail(userId, badge.id, { moduleId, moduleName });
  } catch (error) {
    // Two recalculations ran at the same time (video save + session close)
    if (error.name === "SequelizeUniqueConstraintError") {
      console.log("ℹ️ Badge already assigned (concurrent):", badge.badge_name);
      return;
    }
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

export const assignFCCBadgeIfPassed = async (userId, isPass, moduleId) => {
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