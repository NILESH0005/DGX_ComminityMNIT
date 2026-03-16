import express from "express";
import {
  getApprovalCounts,
  getDeviceAnalytics,
  getMostActiveUsers,
  getProcessCounts,
  getTrendingBlogs,
  getTrendingDiscussion,
  getRegistrationCounts
} from "../controllers/dashboard.js";

const router = express.Router();

router.get('/getTrendingBlogs', getTrendingBlogs);
router.get('/getTrendingDiscussion', getTrendingDiscussion);
router.get('/getApprovalCounts', getApprovalCounts);
router.get("/processCounts", getProcessCounts);
router.get("/deviceAnalytics", getDeviceAnalytics);
router.get("/getMostActiveUsers", getMostActiveUsers);

// ✅ No token middleware
router.get("/registrationCounts", getRegistrationCounts);

export default router;