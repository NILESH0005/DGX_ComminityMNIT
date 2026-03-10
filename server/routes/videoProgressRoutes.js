import express from "express";
import {
  saveVideoProgress,
  getVideoProgress,
} from "../controllers/videoProgressController.js";

const router = express.Router();

router.post("/save", saveVideoProgress);

router.get("/:userId/:fileId", getVideoProgress);

export default router;