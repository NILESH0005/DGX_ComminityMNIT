import db from "../models/index.js";

const { BadgesMaster } = db;

// Get all badges
export const getBadgesService = async () => {
  try {
    const badges = await BadgesMaster.findAll({
      where: { delStatus: 0 },
      attributes: ["id", "badge_name", "badge", "badge_order", "isActive"],
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

    const { badge_name, badge_order, AuthAdd, badge } = req.body;

    const badgeRecord = await BadgesMaster.create({
      badge_name,
      badge, // base64 string
      badge_order,
      isActive: 1,
      AuthAdd,
      AddOnDt: new Date(),
      delStatus: 0
    });

    return {
      success: true,
      message: "Badge created successfully",
      data: { id: badgeRecord.id }
    };

  } catch (error) {

    console.error("Create badge error:", error);

    return {
      success: false,
      message: "Failed to create badge"
    };
  }
};

export const GetBadgesUserCount   = async (req) => {
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
}

export const GetBadgesImg = async() => {
  try {
    const badges = await BadgesMaster.findAll({
      where: { delStatus: 0 },
      attributes: ["id", "badge_name", "badge"]
    }); 
      return badges;
  } catch (error) {
    throw error;
  } };