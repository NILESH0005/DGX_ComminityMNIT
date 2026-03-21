import express from "express";
import {
  createBadge,
  getBadgeImgData,
  getBadges,
  getUserCountAgainestBadge
} from "../controllers/badgeController.js";

const router = express.Router();

// GET all badges
router.get("/badges", getBadges);
router.post("/badges", createBadge);
router.get("/user-count", getUserCountAgainestBadge);
router.get("/badge-images", getBadgeImgData);
export default router;