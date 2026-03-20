import express from "express";
import {
  createUserBadge,
  createModuleUserBadges,
  getUserBadgesByUser,
} from "../controllers/userbadgesController.js";

const router = express.Router();

router.post("/badge-event", createUserBadge);
router.post("/badge-event/module", createModuleUserBadges);


router.get("/badges/user/:userId", getUserBadgesByUser);

// router.get("/badges/show/:userId", popBadgesController);

export default router;