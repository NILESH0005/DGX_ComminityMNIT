import express from "express";
import {
  saveVideoProgress,
  getVideoProgress,
  getSubmoduleCompletionStatus,
} from "../controllers/videoProgressController.js";
import { fetchUser } from "../middleware/fetchUser.js";

const router = express.Router();

router.post("/save", saveVideoProgress);

router.get("/:userId/:fileId", getVideoProgress);

router.post("/getSubmoduleCompletionStatus", fetchUser, getSubmoduleCompletionStatus);

export default router;