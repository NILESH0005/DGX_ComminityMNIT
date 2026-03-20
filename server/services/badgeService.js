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