import {
  awardUserBadge,
  awardModuleBadges,
} from "../services/UserbadgesService.js";

import { logError } from "../helper/index.js";

/* =========================================
   Manual Badge (event based)
========================================= */
export const createUserBadge = async (req, res) => {
  try {
    const { userId, eventName } = req.body;

    if (!userId || !eventName) {
      return res.status(400).json({
        success: false,
        message: "userId and eventName are required",
      });
    }

    const result = await awardUserBadge(userId, eventName);
    return res.status(200).json(result);
  } catch (error) {
    logError(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

/* =========================================
   Module Progress Badges
========================================= */
export const createModuleUserBadges = async (req, res) => {
  try {
    const { userId, moduleId } = req.body;

    if (!userId || !moduleId) {
      return res.status(400).json({
        success: false,
        message: "userId and moduleId required",
      });
    }

    const result = await awardModuleBadges(userId, moduleId);
    return res.status(200).json(result);
  } catch (error) {
    logError(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};