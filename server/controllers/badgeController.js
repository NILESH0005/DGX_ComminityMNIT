import { logError, logInfo } from "../helper/index.js";
import { createBadgeService, getBadgesService } from "../services/badgeService.js";

export const getBadges = async (req, res) => {
  try {
    const badges = await getBadgesService();

    if (!badges || badges.length === 0) {
      return res.status(200).json({
        success: false,
        data: [],
        message: "No badges found"
      });
    }

    return res.status(200).json({
      success: true,
      data: badges,
      message: "Badges fetched successfully"
    });

  } catch (error) {
    logError(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};

export const createBadge = async (req, res) => {
  try {

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const result = await createBadgeService(req);

    if (!result.success) {
      return res.status(400).json(result);
    }

    logInfo("Badge created successfully");

    return res.status(200).json(result);

  } catch (error) {

    logError(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};