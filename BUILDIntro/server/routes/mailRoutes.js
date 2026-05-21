import express from "express";
import { sendPendingMails } from "../controllers/mailController.js";

const router = express.Router();

router.get("/send-mails", sendPendingMails);

export default router;