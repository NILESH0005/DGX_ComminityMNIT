import express from "express";
import { createBlobAchievement } from "../controllers/blobAchievementController.js";

const router = express.Router();

router.post("/blobAchievement", createBlobAchievement);

export default router;