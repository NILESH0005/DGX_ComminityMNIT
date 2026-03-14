import express from "express";
import {
  createBadge,
  getBadges
} from "../controllers/badgeController.js";

const router = express.Router();

router.get("/getBadges", getBadges);
router.post("/badges", createBadge);

export default router;