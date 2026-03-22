import e from "express";
import { logError, logInfo } from "../helper/index.js";
import { createBadgeService, GetBadgesImg, getBadgesService, GetBadgesUserCount } from "../services/badgeService.js";


export const getBadges = async (req, res) => {
  try {
    const badges = await getBadgesService();

    return res.status(200).json({
      success: true,
      count: badges.length,
      data: badges,
      message:
        badges.length > 0
          ? "Badges fetched successfully"
          : "No badges found",
    });

  } catch (error) {
    logError(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
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

export const getUserCountAgainestBadge = async (req, res) => {
  try {
    const result = await GetBadgesUserCount(req);
    return res.status(200).json({
      success: true,
      data: result,
      message: "User count against badges fetched successfully"
    });
  } catch (error) {
    logError(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};

export const getBadgeImgData = async(req, res) => {
  try {
    const badges = await GetBadgesImg();
    return res.status(200).json({
      success: true,
      data: badges,
      message: "Badge images fetched successfully"
    });
  } catch (error) {
    logError(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
}