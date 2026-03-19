import express from "express";
import {
  createUserBadge,
  createModuleUserBadges,
} from "../controllers/userbadgesController.js";

const router = express.Router();

router.post("/badge-event", createUserBadge);
router.post("/badge-event/module", createModuleUserBadges);

export default router;