import cron from "node-cron";
import { sendPendingMails } from "../controllers/mailController.js";

export const startMailScheduler = () => {

  console.log("📨 Mail Scheduler Started");

  cron.schedule("*/30 * * * * *", async () => {

    console.log("⏰ Running scheduler...");

    await sendPendingMails();

  });

};