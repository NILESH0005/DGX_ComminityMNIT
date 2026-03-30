import express from "express";
import {
  createUserBadge,
  createModuleUserBadges,
  getUserBadgesByUser,
  popBadgesUser,
  popFCCBadgesUser,
} from "../controllers/userbadgesController.js";
import { fetchUser } from "../middleware/fetchUser.js";

const router = express.Router();

router.post("/badge-event", createUserBadge);
router.post("/badge-event/module", createModuleUserBadges);


router.get("/getUserbadges", fetchUser, getUserBadgesByUser);

 router.get("/badges/show/:userId", popBadgesUser); // ✅ pass userId via URL

 //router.get("/badges/show", fetchUser, popBadgesUser); // fetchUser provides req.user


router.get("/fccbadges/:userId", popFCCBadgesUser);

export default router;