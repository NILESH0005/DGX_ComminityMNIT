import { fetchPendingEmailsBatch, updateMailStatusBulk } from "../services/communityUserService.js";
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
          "raju.kushwaha@giindia.com",   // admin email
          "Mail Job Completed",
          `<h3>All data transfer successful</h3>
           <p>Total Records Sent: <b>${totalSent}</b></p>`
        );

        await stopScheduler(schedulerId);

        break;
      }

      console.log(`📦 Batch fetched: ${users.length}`);

      const sentUserIds = [];

      await Promise.all(

        users.map(async (user) => {

          const htmlTemplate = communityWelcomeTemplate(
            user.userId,
            user.emailId
          );

          await mailSender(
            user.emailId,
            "Welcome to DGX Community",
            htmlTemplate
          );

          sentUserIds.push(user.userId);

        })

      );

      await updateMailStatusBulk(sentUserIds);

      totalSent += sentUserIds.length;

      console.log(`✅ Total Sent: ${totalSent}`);

    }

  } catch (error) {

    console.error("❌ Mail Job Error:", error);

    await mailSender(
      "raju.kushwaha@giindia.com",
      "Mail Job Failed",
      `<h3>Mail Job Failed</h3>
       <p>Error: ${error.message}</p>`
    );

    await stopScheduler(schedulerId);

  }

};