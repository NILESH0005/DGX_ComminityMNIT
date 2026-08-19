import express from "express";
import {
  createBadge,
  getAssignedBadges,
  getBadgeImageHistory,
  getBadgeImgData,
  getBadges,
  GetEventSubmoduleAnalytics,
  getGenderUserCount,
  getPassFailUserCount,
  GetSubmoduleUserDetails,
  getTodayLiveUserCount,
  getUserCountAgainestBadge,
  saveAssignedBadges,
  updateBadgeImage,
  UserBlockedUser,
  UserCountDistrictWise,
  UserCountQualificationWise,
  UserGenderCountByDistrict,
  UserNotVerifiedUser,
} from "../controllers/badgeController.js";
import { fetchUser } from "../middleware/fetchUser.js";

const router = express.Router();

// GET all badges
router.get("/badges", getBadges);
router.post("/badges", createBadge);
router.get("/user-count", getUserCountAgainestBadge);
router.get("/badge-images", getBadgeImgData);
router.get("/gender-user-count", getGenderUserCount);
router.get("/district-user-count", UserCountDistrictWise);
router.get("/district-gender-user-count", UserGenderCountByDistrict);
router.get("/today-live-user-count", getTodayLiveUserCount);
router.get("/qualification-user-count", UserCountQualificationWise);
router.get("/blocked-users", UserBlockedUser);
router.get("/not-verified-users", UserNotVerifiedUser);
router.get("/total-pass-fail-count", getPassFailUserCount);
router.get("/event-submodule-analytics", GetEventSubmoduleAnalytics);

router.get("/submodule-user-details", GetSubmoduleUserDetails);

router.post("/save-assigned-badges", fetchUser, saveAssignedBadges);
router.get('/get-assigned-badges', fetchUser, getAssignedBadges);
router.post('/update-badge-image', fetchUser, updateBadgeImage);

router.get('/badge-image-history', fetchUser, getBadgeImageHistory);



export default router;
