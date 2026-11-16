import { Op } from "sequelize";
import db from "../models/index.js";

const { BadgesMaster, LMSBadgeMapTbl } = db;

// Get all badges
export const getBadgesService = async () => {
  try {
    const badges = await BadgesMaster.findAll({
      where: { delStatus: 0 },
      attributes: [
        "id",
        "badge_name",
        "badge",
        "badge_order",
        "isActive",
        "badge_code",
        "badge_category",
      ],
      order: [["badge_order", "ASC"]],
    });

    return badges;
  } catch (error) {
    throw error;
  }
};

// Create badge
export const createBadgeService = async (req) => {
  try {
    const {
      badge_name,
      badge_order,
      AuthAdd,
      badge,
      badge_code,
      badge_category,
    } = req.body;

    const badgeRecord = await BadgesMaster.create({
      badge_name,
      badge, // base64 string
      badge_order,
      isActive: 1,
      AuthAdd,
      AddOnDt: new Date(),
      delStatus: 0,
      badge_code,
      badge_category,
    });

    return {
      success: true,
      message: "Badge created successfully",
      data: { id: badgeRecord.id },
    };
  } catch (error) {
    console.error("Create badge error:", error);

    return {
      success: false,
      message: "Failed to create badge",
    };
  }
};

export const GetBadgesUserCount = async (req) => {
  try {
    const strQuery = `SELECT 
    ub.badgesId,
    COUNT(t.userId) AS totalUSER
FROM userbadges ub
JOIN (
    SELECT userId, MAX(AddOnDt) AS latestDate
    FROM userbadges
    WHERE IFNULL(delStatus,0)=0
    GROUP BY userId
) t 
    ON ub.userId = t.userId 
    AND ub.AddOnDt = t.latestDate   
LEFT JOIN badgesmaster bm 
    ON ub.badgesId = bm.ID 
    AND IFNULL(bm.delStatus,0)=0
LEFT JOIN community_user cu 
    ON ub.userId = cu.UserID 
    AND IFNULL(cu.delStatus,0)=0
WHERE IFNULL(ub.delStatus,0)=0 
AND cu.Category = 'Student' 
  AND cu.MobileOTPVerified = 1 
  AND cu.EmailOTPVerified = 1
GROUP BY ub.badgesId, bm.badge
ORDER BY totalUSER DESC;
`;
    const results = await db.sequelize.query(strQuery, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    return {
      success: true,
      message: "Most active users fetched successfully",
      data: results,
    };
  } catch (error) {
    console.error("Get badges user count error:", error);
    throw error;
  }
};

export const GetBadgesImg = async () => {
  try {
    const badges = await BadgesMaster.findAll({
      where: { delStatus: 0 },
      attributes: ["id", "badge_name", "badge"],
    });
    return badges;
  } catch (error) {
    throw error;
  }
};

export const GetUserCountGenderwise = async (eventId) => {
  try {
    const strQuery = `SELECT 
    SUM(CASE WHEN Gender = 'Male' THEN 1 ELSE 0 END) AS MaleCount,
    SUM(CASE WHEN Gender = 'Female' THEN 1 ELSE 0 END) AS FemaleCount
    FROM community_user cu
    INNER JOIN userevents ue
    ON cu.UserID = ue.UserID
    WHERE IFNULL(cu.delStatus,0)=0 AND IFNULL(cu.IsTestUser, 0) = 0 AND cu.Category = 'Student' AND cu.MobileOTPVerified = 1 AND cu.EmailOTPVerified = 1
    AND ue.EventID = :eventId;`;
    const results = await db.sequelize.query(strQuery, {
      replacements: { eventId },
      type: db.sequelize.QueryTypes.SELECT,
    });
    return {
      success: true,
      message: "User count by gender fetched successfully",
      data: results,
    };
  } catch (error) {
    throw error;
  }
};

export const getUserCountByDistrict = async (eventId) => {
  try {
    const strQuery = `
      SELECT 
          district_master.DistrictName,
          COUNT(DISTINCT cu.UserID) AS totalUser

      FROM community_user cu

      INNER JOIN userevents ue
          ON cu.UserID = ue.UserID

      LEFT JOIN district_master
          ON cu.DistrictID = district_master.DistrictID

      WHERE IFNULL(cu.delStatus,0)=0
      AND IFNULL(cu.IsTestUser, 0) = 0
      AND cu.Category = 'Student'
      AND cu.MobileOTPVerified = 1
      AND cu.EmailOTPVerified = 1
      AND ue.EventID = :eventId

      GROUP BY cu.DistrictID

      ORDER BY totalUser DESC
    `;

    const results = await db.sequelize.query(strQuery, {
      replacements: { eventId },
      type: db.sequelize.QueryTypes.SELECT,
    });

    return {
      success: true,
      message: "User count by district fetched successfully",
      data: results,
    };
  } catch (error) {
    throw error;
  }
};

export const getUserGenderCountByDistrict = async (eventId) => {
  try {
    const strQuery = `SELECT 
    district_master.DistrictName,

    COUNT(DISTINCT CASE
        WHEN cu.Gender = 'Male'
        THEN cu.UserID
    END) AS MaleCount,

    COUNT(DISTINCT CASE
        WHEN cu.Gender = 'Female'
        THEN cu.UserID
    END) AS FemaleCount

    FROM community_user cu

    INNER JOIN userevents ue
        ON cu.UserID = ue.UserID

    LEFT JOIN district_master
        ON cu.DistrictID = district_master.DistrictID

    WHERE IFNULL(cu.delStatus,0)=0
    AND IFNULL(cu.IsTestUser, 0) = 0
    AND cu.Category = 'Student'
    AND cu.MobileOTPVerified = 1
    AND cu.EmailOTPVerified = 1
    AND ue.EventID = :eventId

    GROUP BY cu.DistrictID

    ORDER BY MaleCount DESC;`;
    const results = await db.sequelize.query(strQuery, {
      replacements: { eventId },

      type: db.sequelize.QueryTypes.SELECT,
    });
    return {
      success: true,
      message: "User gender count by district fetched successfully",
      data: results,
    };
  } catch (error) {
    throw error;
  }
};

export const getUserCountQualificationWise = async (eventId) => {
  try {
    const strQuery = `SELECT 
    q.QualificationName,count(*) As totalUser,
    SUM(CASE WHEN Gender = 'Male' THEN 1 ELSE 0 END) AS MaleCount,
    SUM(CASE WHEN Gender = 'Female' THEN 1 ELSE 0 END) AS FemaleCount
    FROM community_user cu 
    LEFT JOIN qualification q ON cu.QualificationID = q.QualificationID  AND IFNULL(q.delStatus,0)=0
    INNER JOIN userevents ue ON cu.UserID = ue.UserID
    WHERE IFNULL(cu.delStatus,0)=0 AND IFNULL(cu.IsTestUser, 0) = 0 AND cu.Category = 'Student' AND cu.MobileOTPVerified = 1 AND cu.EmailOTPVerified = 1 AND ue.EventID = :eventId 
    GROUP BY cu.QualificationID
    ORDER BY  q.QualificationName;`;
    const results = await db.sequelize.query(strQuery, {
      replacements: { eventId },
      type: db.sequelize.QueryTypes.SELECT,
    });
    return {
      success: true,
      message: "User count by qualification fetched successfully",
      data: results,
    };
  } catch (error) {
    throw error;
  }
};

export const todaysUserLogin = async (eventId) => {
  try {
    const strQuery = `SELECT COUNT(DISTINCT l.UserID) AS todaysLogins
FROM community_user_login_log l
INNER JOIN userevents ue
    ON l.UserID = ue.UserID
INNER JOIN community_user cu
    ON l.UserID = cu.UserID
WHERE l.LogInDateTime >= CURDATE()
    AND l.LogInDateTime < CURDATE() + INTERVAL 1 DAY
    AND ue.EventID = :eventId
    AND IFNULL(cu.IsTestUser, 0) = 0;`;
    const results = await db.sequelize.query(strQuery, {
      replacements: { eventId },
      type: db.sequelize.QueryTypes.SELECT,
    });
    return {
      success: true,
      message: "Today's user login count fetched successfully",
      data: results,
    };
  } catch (error) {
    throw error;
  }
};

export const getBlockedUsers = async (eventId) => {
  try {
    const strQuery = `
      SELECT COUNT(DISTINCT cu.UserID) AS totalBlockedUser

      FROM community_user cu

      INNER JOIN userevents ue
        ON cu.UserID = ue.UserID

      WHERE IFNULL(cu.delStatus,0)=0
      AND IFNULL(cu.IsTestUser, 0) = 0
        AND cu.Category = 'Student'
        AND cu.MobileOTPVerified = 0
        AND cu.EmailOTPVerified = 0
        AND cu.OTPResendAttempts = 4
        AND ue.EventID = :eventId
    `;

    const results = await db.sequelize.query(strQuery, {
      replacements: { eventId },
      type: db.sequelize.QueryTypes.SELECT,
    });

    return {
      success: true,
      message: "Blocked users fetched successfully",
      data: results,
    };
  } catch (error) {
    throw error;
  }
};

export const getNotVerifiedUsers = async (eventId) => {
  try {
    const strQuery = `
      SELECT COUNT(DISTINCT cu.UserID) AS totalNotVerifiedUser

      FROM community_user cu

      INNER JOIN userevents ue
        ON cu.UserID = ue.UserID

      WHERE IFNULL(cu.delStatus,0)=0
      AND IFNULL(cu.IsTestUser, 0) = 0
        AND cu.Category = 'Student'
        AND (
          cu.MobileOTPVerified = 0
          OR cu.EmailOTPVerified = 0
        )
        AND cu.OTPResendAttempts < 4
        AND ue.EventID = :eventId
    `;

    const results = await db.sequelize.query(strQuery, {
      replacements: { eventId },
      type: db.sequelize.QueryTypes.SELECT,
    });

    return {
      success: true,
      message: "Not verified users fetched successfully",
      data: results,
    };
  } catch (error) {
    throw error;
  }
};

export const TotalUserPassOrFailCount = async (eventId) => {
  try {
    const strQuery = `
    SELECT 
      COUNT(CASE WHEN qr.isPass = 1 THEN 1 END) AS totalPass,
      COUNT(CASE WHEN qr.isPass = 0 THEN 1 END) AS totalFail
    FROM community_user cu
    JOIN (
        SELECT userId, MAX(AddOnDt) AS latestDate
        FROM quiz_result
        WHERE IFNULL(delStatus,0)=0
        GROUP BY userId
    ) latest ON cu.UserID = latest.userId
    JOIN quiz_result qr 
      ON qr.userId = latest.userId 
      AND qr.AddOnDt = latest.latestDate
    INNER JOIN userevents ue 
    ON cu.UserID = ue.UserID
    WHERE IFNULL(cu.delStatus,0)=0 
      AND IFNULL(cu.IsTestUser, 0) = 0
      AND cu.Category = 'Student'
      AND ue.EventID = :eventId
      AND cu.MobileOTPVerified = 1 
      AND cu.EmailOTPVerified = 1;`;
    const results = await db.sequelize.query(strQuery, {
      replacements: { eventId },
      type: db.sequelize.QueryTypes.SELECT,
    });
    return {
      success: true,
      message: "Total pass and fail count fetched successfully",
      data: results,
    };
  } catch (error) {
    throw error;
  }
};

export const getEventSubmoduleAnalytics = async (eventId) => {
  try {
    const strQuery = `
      SELECT
    md.ModuleID,
    md.ModuleName,

    sm.SubModuleID,
    sm.SubModuleName,
    sm.SortingOrder,

    COUNT(cil.id) AS TotalViews,

    COUNT(DISTINCT cil.UserID) AS UsersInSubModule,

    MAX(total_users.TotalUserCount) AS TotalUserCount,

    CONCAT(
        COUNT(DISTINCT cil.UserID),
        ' / ',
        MAX(total_users.TotalUserCount)
    ) AS ParticipationRatio,

    ROUND(
        COUNT(DISTINCT cil.UserID) * 100.0 /
        NULLIF(MAX(total_users.TotalUserCount), 0),
        2
    ) AS ParticipationPercentage,

    MAX(cil.AddOnDt) AS LastViewedAt

FROM moduledetails md

INNER JOIN submodulesdetails sm
    ON md.ModuleID = sm.ModuleID
    AND IFNULL(sm.delStatus, 0) = 0

LEFT JOIN content_interaction_log cil
    ON cil.reference = sm.SubModuleID
    AND cil.ProcessName = 'LMS'
    AND cil.View = 1
    AND IFNULL(cil.delStatus, 0) = 0
    AND EXISTS (
        SELECT 1
        FROM community_user cu
        WHERE cu.UserID = cil.UserID
          AND IFNULL(cu.IsTestUser, 0) = 0
          AND IFNULL(cu.delStatus, 0) = 0
    )

CROSS JOIN (
    SELECT COUNT(DISTINCT ue.UserID) AS TotalUserCount
    FROM userevents ue
    INNER JOIN community_user cu
        ON ue.UserID = cu.UserID
    WHERE ue.EventID = :eventId
      AND IFNULL(ue.delStatus, 0) = 0
      AND IFNULL(cu.delStatus, 0) = 0
      AND IFNULL(cu.IsTestUser, 0) = 0
) total_users

WHERE md.EventType = :eventId
  AND IFNULL(md.delStatus, 0) = 0

GROUP BY
    md.ModuleID,
    md.ModuleName,
    sm.SubModuleID,
    sm.SubModuleName,
    sm.SortingOrder

ORDER BY
    sm.SortingOrder ASC;
    `;

    const results = await db.sequelize.query(strQuery, {
      replacements: { eventId },
      type: db.sequelize.QueryTypes.SELECT,
    });

    return {
      success: true,
      message: "Event submodule analytics fetched successfully",
      data: results,
    };
  } catch (error) {
    throw error;
  }
};

export const getSubmoduleUserDetails = async (eventId, subModuleId) => {
  try {
    const strQuery = `
      SELECT
          cu.UserID,
          cu.Name,
          cu.MobileNumber,
          cu.EmailID,

          COUNT(cil.id) AS TotalViews,

          MAX(cil.AddOnDt) AS LastActivity

      FROM content_interaction_log cil

      INNER JOIN community_user cu
          ON cu.UserID = cil.UserID
          AND IFNULL(cu.delStatus,0) = 0
          AND IFNULL(cu.IsTestUser, 0) = 0

      INNER JOIN submodulesdetails sm
          ON sm.SubModuleID = cil.reference

      INNER JOIN moduledetails md
          ON md.ModuleID = sm.ModuleID

      INNER JOIN userevents ue
          ON ue.UserID = cu.UserID
          AND ue.EventID = :eventId

      WHERE cil.reference = :subModuleId
      AND md.EventType = :eventId
      AND cil.ProcessName = 'LMS'
      AND cil.View = 1
      AND cil.delStatus = 0

      GROUP BY
          cu.UserID,
          cu.Name,
          cu.MobileNumber,
          cu.EmailID

      ORDER BY
          TotalViews DESC,
          LastActivity DESC;
    `;

    const results = await db.sequelize.query(strQuery, {
      replacements: {
        eventId,
        subModuleId,
      },
      type: db.sequelize.QueryTypes.SELECT,
    });

    return {
      success: true,
      message: "Submodule users fetched successfully",
      data: results,
    };
  } catch (error) {
    throw error;
  }
};

export const saveAssignedBadgesService = async (moduleId, badges, userId) => {
  try {
    console.log("📦 Service called with:", {
      moduleId,
      badgesCount: badges?.length,
      userId,
    });

    const moduleIdNum = parseInt(moduleId);
    if (isNaN(moduleIdNum)) {
      throw new Error("Invalid Module ID");
    }

    const validBadges = badges.filter((badge) => {
      const badgeId = parseInt(badge.BadgeID);
      if (isNaN(badgeId) || badgeId <= 0) {
        console.log(`⚠️ Skipping invalid badge:`, badge);
        return false;
      }
      return true;
    });

    if (validBadges.length === 0) {
      throw new Error("No valid badges to save");
    }

    console.log(`✅ Processing ${validBadges.length} valid badges`);

    const transaction = await db.sequelize.transaction();

    try {
      // ✅ Get current assignments
      const currentAssignments = await LMSBadgeMapTbl.findAll({
        where: {
          ModuleID: moduleIdNum,
          delStatus: 0,
        },
        attributes: [
          "id",
          "BadgeID",
          "BadgeImage",
          "isCustomImage",
          "BadgeName",
        ],
        transaction: transaction,
      });

      console.log(`📦 Current assignments: ${currentAssignments.length}`);

      // ✅ Create maps
      const currentMap = {};
      currentAssignments.forEach((a) => {
        currentMap[a.BadgeID] = {
          id: a.id,
          BadgeName: a.BadgeName || "",
          BadgeImage: a.BadgeImage || "",
          isCustomImage: a.isCustomImage || false,
        };
      });

      const newMap = {};
      validBadges.forEach((b) => {
        newMap[b.BadgeID] = {
          id: b.id || null,
          BadgeName: b.BadgeName || "",
          BadgeImage: b.BadgeImage || "",
          isCustomImage: b.isCustomImage || false,
        };
      });

      const currentIds = Object.keys(currentMap).map(Number);
      const newIds = Object.keys(newMap).map(Number);

      // ✅ Find badges to REMOVE (in current but not in new)
      const toRemove = currentIds.filter((id) => !newIds.includes(id));

      // ✅ Find badges to ADD (in new but not in current)
      const toAdd = validBadges.filter(
        (b) => !currentIds.includes(parseInt(b.BadgeID)),
      );

      // ✅ Find badges to UPDATE - ONLY when there's a REAL image change
      const toUpdate = validBadges.filter((b) => {
        const badgeId = parseInt(b.BadgeID);
        const current = currentMap[badgeId];

        if (!current) return false;

        const hasId = b.id && b.id > 0;

        if (!hasId) return false;

        const currentName = current.BadgeName || "";
        const newName = b.BadgeName || "";

        const currentImage = current.BadgeImage || "";
        const newImage = b.BadgeImage || "";

        const currentCustom = Boolean(current.isCustomImage);
        const newCustom = Boolean(b.isCustomImage);

        const nameChanged = currentName !== newName;
        const imageChanged = currentImage !== newImage;
        const customChanged = currentCustom !== newCustom;

        return nameChanged || imageChanged || customChanged;
      });

      // ✅ Find UNCHANGED badges
      const unchanged = validBadges.filter((b) => {
        const badgeId = parseInt(b.BadgeID);
        const current = currentMap[badgeId];
        if (!current) return false;

        // ✅ Check if it has an ID
        const hasId = b.id && b.id > 0;
        if (!hasId) return false;

        const currentImage = current.BadgeImage || "";
        const newImage = b.BadgeImage || "";
        const currentCustom = current.isCustomImage || false;
        const newCustom = b.isCustomImage || false;

        const currentName = current.BadgeName || "";
        const newName = b.BadgeName || "";

        return (
          currentName === newName &&
          currentImage === newImage &&
          currentCustom === newCustom
        );
      });

      console.log(`📊 Summary:
        - Current: ${currentIds.length}
        - New: ${newIds.length}
        - To Remove: ${toRemove.length}
        - To Add: ${toAdd.length}
        - To Update: ${toUpdate.length}
        - Unchanged: ${unchanged.length}
      `);

      // Log the details of what's being updated
      if (toUpdate.length > 0) {
        console.log(
          "🔄 Badges being updated:",
          toUpdate.map((b) => ({
            BadgeID: b.BadgeID,
            id: b.id,
            imageLength: b.BadgeImage?.length || 0,
            isCustomImage: b.isCustomImage,
          })),
        );
      }

      // ✅ REMOVE badges
      if (toRemove.length > 0) {
        await LMSBadgeMapTbl.update(
          {
            delStatus: 1,
            AuthDel: userId,
            delOnDt: new Date(),
            AuthLstEdt: userId,
            editOnDt: new Date(),
          },
          {
            where: {
              ModuleID: moduleIdNum,
              BadgeID: toRemove,
              delStatus: 0,
            },
            transaction: transaction,
          },
        );
        console.log(`✅ Removed ${toRemove.length} badges:`, toRemove);
      }

      // ✅ UPDATE badges (soft delete + insert new)
      if (toUpdate.length > 0) {
        const updateBadgeIds = toUpdate.map((b) => parseInt(b.BadgeID));

        // Soft delete old entries
        await LMSBadgeMapTbl.update(
          {
            delStatus: 1,
            AuthDel: userId,
            delOnDt: new Date(),
            AuthLstEdt: userId,
            editOnDt: new Date(),
          },
          {
            where: {
              ModuleID: moduleIdNum,
              BadgeID: updateBadgeIds,
              delStatus: 0,
            },
            transaction: transaction,
          },
        );
        console.log(`✅ Soft deleted ${toUpdate.length} badges for update`);

        // Insert new entries with updated images
        const updateAssignments = toUpdate.map((badge) => ({
          ModuleID: moduleIdNum,
          BadgeID: parseInt(badge.BadgeID),
          BadgeName: badge.BadgeName || null,

          BadgeImage: badge.BadgeImage || null,
          BadgeImagePath: badge.BadgeImagePath || null,
          isCustomImage: badge.isCustomImage ? 1 : 0,
          AuthAdd: userId,
          AddOnDt: new Date(),
          delStatus: 0,
        }));

        await LMSBadgeMapTbl.bulkCreate(updateAssignments, {
          transaction: transaction,
        });
        console.log(`✅ Re-inserted ${toUpdate.length} badges with new images`);
      }

      // ✅ ADD new badges
      if (toAdd.length > 0) {
        const addAssignments = toAdd.map((badge) => ({
          ModuleID: moduleIdNum,
          BadgeID: parseInt(badge.BadgeID),
          BadgeName: badge.BadgeName || null,

          BadgeImage: badge.BadgeImage || null,
          BadgeImagePath: badge.BadgeImagePath || null,
          isCustomImage: badge.isCustomImage ? 1 : 0,
          AuthAdd: userId,
          AddOnDt: new Date(),
          delStatus: 0,
        }));

        await LMSBadgeMapTbl.bulkCreate(addAssignments, {
          transaction: transaction,
        });
        console.log(`✅ Added ${toAdd.length} new badges`);
      }

      await transaction.commit();

      const finalAssignments = await LMSBadgeMapTbl.findAll({
        where: {
          ModuleID: moduleIdNum,
          delStatus: 0,
        },
        attributes: [
          "id",
          "ModuleID",
          "BadgeID",
          "BadgeName",
          "BadgeImage",
          "BadgeImagePath",
          "isCustomImage",
          "AuthAdd",
          "AddOnDt",
        ],
        order: [["AddOnDt", "ASC"]],
        transaction: null,
      });

      return {
        success: true,
        removed: toRemove.length,
        added: toAdd.length,
        updated: toUpdate.length,
        unchanged: unchanged.length,
        total: finalAssignments.length,
        data: finalAssignments,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("❌ Error in saveAssignedBadges service:", error);
    throw error;
  }
};

export const getAssignedBadgesService = async (moduleId) => {
  try {
    const moduleIdNum = parseInt(moduleId);

    if (isNaN(moduleIdNum)) {
      throw new Error("Invalid Module ID");
    }

    const assignments = await LMSBadgeMapTbl.findAll({
      where: {
        ModuleID: moduleIdNum,
        delStatus: 0,
      },
      attributes: [
        "id",
        "ModuleID",
        "BadgeID",
        "BadgeName",         
        "BadgeImage",
        "BadgeImagePath",
        "isCustomImage",
        "AuthAdd",
        "AddOnDt",
      ],
      order: [["AddOnDt", "ASC"]],
    });

    const result = await Promise.all(
      assignments.map(async (assignment) => {
        const badge = await BadgesMaster.findOne({
          where: {
            id: assignment.BadgeID,
            delStatus: 0,
          },
          attributes: [
            "id",
            "badge_name",
            "badge",
            "badge_order",
            "isActive",
            "badge_code",
            "badge_category",
          ],
        });

        return {
          id: assignment.id,
          ModuleID: assignment.ModuleID,
          BadgeID: assignment.BadgeID,

          BadgeName:
            assignment.BadgeName ||
            badge?.badge_name ||
            "Unknown Badge",

          BadgeImage:
            assignment.BadgeImage ||
            badge?.badge ||
            null,

          BadgeImagePath:
            assignment.BadgeImagePath || null,

          isCustomImage:
            assignment.isCustomImage || false,

          BadgeDescription:
            badge?.badge_description ||
            "AI achievement unlocked.",

          BadgeCategory:
            badge?.badge_category ||
            "General",

          BadgeCode:
            badge?.badge_code ||
            null,

          BadgeOrder:
            badge?.badge_order ||
            0,

          isActive:
            badge?.isActive ?? true,

          assignedAt:
            assignment.AddOnDt,

          assignedBy:
            assignment.AuthAdd,
        };
      }),
    );

    console.log(
      "📤 Returning badges:",
      result.map((r) => ({
        id: r.id,
        BadgeID: r.BadgeID,
        BadgeName: r.BadgeName,
      })),
    );

    return result;
  } catch (error) {
    console.error(
      "Error in getAssignedBadges service:",
      error,
    );

    throw error;
  }
};

export const updateBadgeImageService = async (
  assignmentId,
  imageData,
  imagePath,
  badgeName,
  userId,
) => {
  try {
    const assignment = await LMSBadgeMapTbl.findOne({
      where: {
        id: assignmentId,
        delStatus: 0,
      },
    });

    if (!assignment) {
      throw new Error("Assignment not found");
    }

    const updateData = {
      BadgeImage: imageData,
      BadgeImagePath: imagePath || null,
      isCustomImage: 1,
      AuthLstEdt: userId,
      editOnDt: new Date(),
    };

    // Update name only when supplied
    if (badgeName !== undefined) {
      updateData.BadgeName = badgeName.trim();
    }

    await assignment.update(updateData);

    return assignment;
  } catch (error) {
    console.error("Error in updateBadgeImage service:", error);
    throw error;
  }
};

// export const getBadgeImageHistoryService = async (
//   badgeId,
//   moduleId,
//   userId,
// ) => {
//   try {
//     console.log("📦 Fetching image history for:", {
//       badgeId,
//       moduleId,
//       userId,
//     });

//     // const masterBadge = await BadgesMaster.findOne({
//     //   where: {
//     //     id: badgeId,
//     //     delStatus: 0,
//     //   },
//     //   attributes: ["id", "badge_name", "badge", "badge_category"],
//     // });

//     const history = await LMSBadgeMapTbl.findAll({
//       where: {
//         ModuleID: moduleId,
//         BadgeID: badgeId,
//         delStatus: 1, // Only archived
//         // isCustomImage: true, // Only custom images
//       },
//       attributes: [
//         "id",
//         "BadgeImage",
//         "BadgeImagePath",
//         "isCustomImage",
//         "AuthAdd",
//         "AddOnDt",
//         "editOnDt",
//         "delStatus",
//       ],
//       order: [["editOnDt", "DESC"]],
//     });

//     const activeBadge = await LMSBadgeMapTbl.findOne({
//       where: {
//         ModuleID: moduleId,
//         BadgeID: badgeId,
//         delStatus: 0,
//         isCustomImage: true,
//       },
//     });

//     const userHistory = history.filter(
//       (item) => item.AuthAdd === userId || item.AuthAdd === String(userId),
//     );

//     const formattedHistory = userHistory.map((item, index) => ({
//       id: item.id,
//       BadgeImage: item.BadgeImage,
//       BadgeImagePath: item.BadgeImagePath,
//       isCustomImage: item.isCustomImage,
//       uploadedAt: item.AddOnDt,
//       lastEditedAt: item.editOnDt,
//       isActive: item.delStatus === 0,
//       status: item.delStatus === 0 ? "active" : "archived",
//       version: index + 1,
//     }));

//     const response = {
//       // master: masterBadge
//       //   ? {
//       //       BadgeImage: masterBadge.badge,
//       //       BadgeName: masterBadge.badge_name,
//       //       type: "master",
//       //     }
//       //   : null,

//       active: activeBadge
//         ? {
//             id: activeBadge.id,
//             BadgeImage: activeBadge.BadgeImage,
//             BadgeImagePath: activeBadge.BadgeImagePath,
//             isCustomImage: activeBadge.isCustomImage,
//             uploadedAt: activeBadge.AddOnDt,
//             lastEditedAt: activeBadge.editOnDt,
//             isActive: true,
//             type: "active",
//           }
//         : null,

//       history: formattedHistory,

//       summary: {
//         total: formattedHistory.length,
//         active: activeBadge ? 1 : 0,
//         archived: formattedHistory.length,
//       },
//     };

//     return response;
//   } catch (error) {
//     console.error("Error in getBadgeImageHistory service:", error);
//     throw error;
//   }
// };

export const getBadgeImageHistoryService = async (
  badgeId,
  moduleId,
  userId,
) => {
  try {
    console.log("📦 Fetching image history for:", {
      badgeId,
      moduleId,
      userId,
    });

    const masterBadge = await BadgesMaster.findOne({
      where: {
        id: badgeId,
        delStatus: 0,
      },
      attributes: ["id", "badge_name", "badge", "badge_category", "path"],
    });

    const activeBadge = await LMSBadgeMapTbl.findOne({
      where: {
        ModuleID: moduleId,
        BadgeID: badgeId,
        delStatus: 0,
        isCustomImage: true,
      },
    });

    // Archived Badges
    const history = await LMSBadgeMapTbl.findAll({
      where: {
        ModuleID: moduleId,
        BadgeID: badgeId,
        delStatus: 1,
      },
      attributes: [
        "id",
        "BadgeImage",
        "BadgeImagePath",
        "isCustomImage",
        "AuthAdd",
        "AddOnDt",
        "editOnDt",
        "delStatus",
      ],
      order: [["editOnDt", "DESC"]],
    });

    // User History
    const userHistory = history.filter(
      (item) => item.AuthAdd === userId || item.AuthAdd === String(userId),
    );

    // Remove duplicate of active badge if present
    const filteredHistory = userHistory.filter((item) => {
      if (!activeBadge) return true;

      return (
        item.BadgeImage !== activeBadge.BadgeImage &&
        item.BadgeImagePath !== activeBadge.BadgeImagePath
      );
    });

    const formattedHistory = filteredHistory.map((item, index) => ({
      id: item.id,
      BadgeImage: item.BadgeImage,
      BadgeImagePath: item.BadgeImagePath,
      isCustomImage: item.isCustomImage,
      uploadedAt: item.AddOnDt,
      lastEditedAt: item.editOnDt,
      isActive: false,
      status: "archived",
      version: index + 1,
    }));

    return {
      master: masterBadge
        ? {
            id: masterBadge.id,
            BadgeName: masterBadge.badge_name,
            BadgeImage: masterBadge.badge,
            BadgeImagePath: masterBadge.path,
            badgeCategory: masterBadge.badge_category,
            type: "master",
          }
        : null,

      active: activeBadge
        ? {
            id: activeBadge.id,
            BadgeImage: activeBadge.BadgeImage,
            BadgeImagePath: activeBadge.BadgeImagePath,
            isCustomImage: activeBadge.isCustomImage,
            uploadedAt: activeBadge.AddOnDt,
            lastEditedAt: activeBadge.editOnDt,
            isActive: true,
            type: "active",
          }
        : null,

      history: formattedHistory,

      summary: {
        total: formattedHistory.length,
        active: activeBadge ? 1 : 0,
        archived: formattedHistory.length,
      },
    };
  } catch (error) {
    console.error("Error in getBadgeImageHistoryService:", error);
    throw error;
  }
};
