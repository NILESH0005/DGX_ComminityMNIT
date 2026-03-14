import express from "express";
import { createBlobAchievement } from "../controllers/blobAchievementController.js";

const router = express.Router();

router.post("/blob-event", createBlobAchievement);

export default router;