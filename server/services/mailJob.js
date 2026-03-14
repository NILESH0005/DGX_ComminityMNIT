import {
  fetchPendingEmailsBatch,
  updateMailStatusBulk,
} from "../services/communityUserService.js";
import { mailSender } from "../helper/mailSender.js";
import { communityWelcomeTemplate } from "../templates/communityWelcomeTemplate.js";
import { stopScheduler } from "../services/schedulerService.js";

export const processMailJob = async (schedulerId) => {
  try {
    const batchSize = 1000;
    let totalSent = 0;

    while (true) {
      const users = await fetchPendingEmailsBatch(batchSize);

      if (!users || users.length === 0) {
        console.log("🎉 All emails sent");

        // Send admin email
        await mailSender(
          process.env.ADMIN_GMAIL_STATUS_MAIL, // admin email
          "Mail Job Completed",
          `<h3>All data transfer successful</h3>
           <p>Total Records Sent: <b>${totalSent}</b></p>`,
        );

        await stopScheduler(schedulerId);

        break;
      }

      console.log(`📦 Batch fetched: ${users.length}`);

      const sentUserIds = [];

      for (const user of users) {
        try {
          const htmlTemplate = communityWelcomeTemplate(
            user.userId,
            user.emailId,
          );

          await mailSender(
            user.emailId,
            "Welcome to DGX Community",
            htmlTemplate,
          );

          sentUserIds.push(user.userId);

          // Delay to prevent Gmail blocking
          await new Promise((resolve) => setTimeout(resolve, 1500));
        } catch (err) {
          console.error(`❌ Failed for ${user.emailId}`, err.message);
        }
      }

      await updateMailStatusBulk(sentUserIds);

      totalSent += sentUserIds.length;

      console.log(`✅ Total Sent: ${totalSent}`);
    }
  } catch (error) {
    console.error("❌ Mail Job Error:", error);

    await mailSender(
      process.env.ADMIN_GMAIL_STATUS_MAIL, // admin email
      "Mail Job Failed",
      `<h3>Mail Job Failed</h3>
       <p>Error: ${error.message}</p>`,
    );

    await stopScheduler(schedulerId);
  }
};
