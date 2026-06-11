import db from "../models/index.js";

const { BadgesMaster } = db;

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
    WHERE IFNULL(cu.delStatus,0)=0 AND cu.Category = 'Student' AND cu.MobileOTPVerified = 1 AND cu.EmailOTPVerified = 1
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
    WHERE IFNULL(cu.delStatus,0)=0 AND cu.Category = 'Student' AND cu.MobileOTPVerified = 1 AND cu.EmailOTPVerified = 1 AND ue.EventID = :eventId 
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
    FROM giindiadgx_community.community_user_login_log l
    INNER JOIN userevents ue
    ON l.UserID = ue.UserID
    WHERE l.LogInDateTime >= CURDATE()
    AND l.LogInDateTime < CURDATE() + INTERVAL 1 DAY
    AND ue.EventID = :eventId`;
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
              MAX(total_users.TotalUserCount),
              2
          ) AS ParticipationPercentage,

          MAX(cil.AddOnDt) AS LastViewedAt

      FROM moduledetails md

      INNER JOIN submodulesdetails sm
          ON md.ModuleID = sm.ModuleID
          AND IFNULL(sm.delStatus,0) = 0

      LEFT JOIN content_interaction_log cil
          ON cil.reference = sm.SubModuleID
          AND cil.ProcessName = 'LMS'
          AND cil.View = 1
          AND cil.delStatus = 0

      CROSS JOIN (
          SELECT COUNT(DISTINCT ue.UserID) AS TotalUserCount
          FROM userevents ue
          WHERE ue.EventID = :eventId
      ) total_users

      WHERE md.EventType = :eventId
      AND IFNULL(md.delStatus,0) = 0

      GROUP BY
          md.ModuleID,
          md.ModuleName,
          sm.SubModuleID,
          sm.SubModuleName,
          sm.SortingOrder

      ORDER BY sm.SortingOrder ASC;
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
