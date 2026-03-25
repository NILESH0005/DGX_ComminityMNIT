import {
  awardUserBadge,
  awardModuleBadges,
  getUserBadges,
  popUserBadges,
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

/* =========================================
   GET ALL BADGES
========================================= */
// export const getAllBadges = async (req, res) => {
//   try {
//     const result = await getBadges();
//     return res.status(200).json(result);
//   } catch (error) {
//     logError(error);
//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong",
//     });
//   }
// };

/* =========================================
   GET USER BADGES
========================================= */
export const getUserBadgesByUser = async (req, res) => {
  try {
    console.log("what is req.user", req.user); // check if user info is coming through
    const userId = req.user?.uniqueId; // coming from auth middleware
    // const userId = 18

    console.log("userid", req.user?.uniqueId);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized or userId missing",
      });
    }
    console.log("user id for badges", req.user?.uniqueId);
    const result = await getUserBadges(req.user?.uniqueId);
    console.log("user id for badges22222", req.user?.uniqueId);

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
   POP BADGES (Show once + mark viewed)
========================================= */
// export const popBadgesUser = async (req, res) => {
//   try {
//     const userId = req.user?.uniqueId; // coming from auth middleware
//     console.log(
//       "🚀 ~ file: userbadgesController.js:122 ~ popBadgesController ~ userId:",
//       userId,
//     );
//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         message: "userId required",
//       });
//     }

//     const badges = await popUserBadges(userId);

//     return res.status(200).json({
//       success: true,
//       count: badges.length,
//       data: badges,
//     });
//   } catch (error) {
//     logError(error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch badges",
//     });
//   }
// };



export const popBadgesUser = async (req, res) => {
  try {
    const { userId } = req.params; // ✅ pass via URL
console.log("🚀 ~ file: userbadgesController.js:122 ~ popBadgesController ~ userId:", userId);



    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId required",
      });
    }

    const badges = await popUserBadges(userId);

    return res.status(200).json({
      success: true,
      count: badges.length,
      data: badges,
    });

  } catch (error) {
    logError(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch badges",
    });
  }
};