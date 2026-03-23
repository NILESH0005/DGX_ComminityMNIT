import db from "../models/index.js";

const { BadgesMaster } = db;

// Get all badges
export const getBadgesService = async () => {
  try {
    const badges = await BadgesMaster.findAll({
      where: { delStatus: 0 },
      attributes: ["id", "badge_name", "badge", "badge_order", "isActive", "badge_code", "badge_category"],
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

    const { badge_name, badge_order, AuthAdd, badge, badge_code, badge_category } = req.body;

    const badgeRecord = await BadgesMaster.create({
      badge_name,
      badge, // base64 string
      badge_order,
      isActive: 1,
      AuthAdd,
      AddOnDt: new Date(),
      delStatus: 0,
      badge_code,
      badge_category
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


  export const GetUserCountGenderwise = async() => {
    try {
      const strQuery = `SELECT 
    SUM(CASE WHEN Gender = 'Male' THEN 1 ELSE 0 END) AS MaleCount,
    SUM(CASE WHEN Gender = 'Female' THEN 1 ELSE 0 END) AS FemaleCount
FROM community_user
WHERE IFNULL(delStatus,0)=0 AND Category = 'Student' AND MobileOTPVerified = 1 AND EmailOTPVerified = 1;`;
      const results = await db.sequelize.query(strQuery, {
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

  export const getUserCountByDistrict = async() => {
    try {
      const strQuery = `SELECT district_master.DistrictName,
count(*) As totalUser
FROM community_user
Left Join district_master ON community_user.DistrictID =district_master.DistrictID
WHERE IFNULL(community_user.delStatus,0)=0 AND Category = 'Student' AND MobileOTPVerified = 1 AND EmailOTPVerified = 1
GROUP BY community_user.DistrictID
ORDER BY  district_master.DistrictName;`;
      const results = await db.sequelize.query(strQuery, {
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

  export const getUserGenderCountByDistrict = async() => {
    try {
      const strQuery = `SELECT 
    district_master.DistrictName,
    SUM(CASE WHEN Gender = 'Male' THEN 1 ELSE 0 END) AS MaleCount,
    SUM(CASE WHEN Gender = 'Female' THEN 1 ELSE 0 END) AS FemaleCount
FROM community_user
Left Join district_master ON community_user.DistrictID =district_master.DistrictID
WHERE IFNULL(community_user.delStatus,0)=0 AND Category = 'Student' AND MobileOTPVerified = 1 AND EmailOTPVerified = 1
GROUP BY community_user.DistrictID
ORDER BY  district_master.DistrictName;`;
      const results = await db.sequelize.query(strQuery, {
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


  export const getUserCountQualificationWise = async() => {
    try {
      const strQuery = `SELECT 
qualification.QualificationName,count(*) As totalUser,
SUM(CASE WHEN Gender = 'Male' THEN 1 ELSE 0 END) AS MaleCount,
SUM(CASE WHEN Gender = 'Female' THEN 1 ELSE 0 END) AS FealeCount
FROM community_user
LEFT JOIN qualification ON community_user.QualificationID = qualification.QualificationID  AND IFNULL(qualification.delStatus,0)=0
WHERE IFNULL(community_user.delStatus,0)=0 AND Category = 'Student' AND MobileOTPVerified = 1 AND EmailOTPVerified = 1
GROUP BY community_user.QualificationID
ORDER BY  qualification.QualificationName;`;  
      const results = await db.sequelize.query(strQuery, {
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

  export const todaysUserLogin = async() => {
    try {
      const strQuery = `SELECT COUNT(*) todaysLoing
FROM giindiadgx_community.community_user_login_log
WHERE LogInDateTime >= CURDATE()
  AND LogInDateTime < CURDATE() + INTERVAL 1 DAY;`;
      const results = await db.sequelize.query(strQuery, {
        type: db.sequelize.QueryTypes.SELECT,
      }); 
      return {
        success: true,
        message: "Today's user login count fetched successfully",
        data: results,
      }
    } catch (error) {
      throw error;
     }  
    };