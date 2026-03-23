import express from "express";
import {
  createBadge,
  getBadgeImgData,
  getBadges,
  getGenderUserCount,
  getUserCountAgainestBadge,
  UserCountDistrictWise,
  UserGenderCountByDistrict
} from "../controllers/badgeController.js";

const router = express.Router();

// GET all badges
router.get("/badges", getBadges);
router.post("/badges", createBadge);
router.get("/user-count", getUserCountAgainestBadge);
router.get("/badge-images", getBadgeImgData);
router.get("/gender-user-count", getGenderUserCount);
router.get("/district-user-count", UserCountDistrictWise);
router.get("/district-gender-user-count", UserGenderCountByDistrict);
export default router;