import express from "express";
import {
  createBadge,
  getBadges
} from "../controllers/badgeController.js";

const router = express.Router();

// GET all badges
router.get("/badges", getBadges);
router.post("/badges", createBadge);

export default router;