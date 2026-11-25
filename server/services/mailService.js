import { mailSender } from "../helper/mailSender.js";
import db from "../models/index.js";
import { getMailTemplate } from "./mailTemplateService.js";

export const sendApplicationMail = async ({
  templateCode,
  userId = null,
  recipientEmail,
  data = {},
  userMailType,
  LMSID = null,
  DiscussionID = null,
  BlogID = null,
  EventID = null,
  authUserId = "SYSTEM",
  inlineImages = [],
}) => {
  let mailLog = null;

  try {
    console.log("1. Starting email service");
    // 1. Fetch and render email template
    const mail = await getMailTemplate(templateCode, data);

    console.log("2. Template fetched:", mail.templateId);
    console.log("3. Subject:", mail.subject);
    console.log("4. HTML loaded:", !!mail.html);
    console.log("5. Recipient:", recipientEmail);
    // 2. Create pending log
    // Before creating pending log
    console.log("5.1 Creating pending mail log");

    mailLog = await db.MailSendLogs.create({
      UserID: userId,
      TemplateID: mail.templateId,
      RecipientEmail: recipientEmail,
      LMSID,
      DiscussionID,
      BlogID,
      EventID,
      UserMailType: userMailType || templateCode,
      MAILSEND: false,
      MailStatus: "PENDING",
      AuthAdd: authUserId,
      AddOnDt: new Date(),
      delStatus: 0,
    });

    console.log("5.2 Pending mail log created:", mailLog.ID);

    // Before sending
    console.log("5.3 Calling mailSender");

    const result = await mailSender({
      receiver: recipientEmail,
      subject: mail.subject,
      message: `Email notification: ${mail.subject}`,
      htmlContent: mail.html,
      cc: mail.cc,
      bcc: mail.bcc,
      inlineImages,

    });

    console.log("5.4 mailSender completed");
    console.dir(result, { depth: null });

    // 4. Handle sending failure
    if (!result.success) {
      const mailError = new Error(result.error || "ZeptoMail failed");

      mailError.details = result.details || [];
      mailError.requestId = result.requestId || null;

      throw mailError;
    }

    // 5. Update successful log
    await mailLog.update({
      MAILSEND: true,
      MailStatus: "SENT",
      AuthLstEdt: authUserId,
      editOnDt: new Date(),
    });

    return {
      success: true,
      message: "Email sent successfully",
      logId: mailLog.ID,
      response: result.response,
    };
  } catch (error) {
    // 6. Update failed log
    if (mailLog) {
      try {
        await mailLog.update({
          MAILSEND: false,
          MailStatus: "FAILED",
          ErrorMessage: String(error.message || error).slice(0, 60000),
          AuthLstEdt: authUserId,
          editOnDt: new Date(),
        });
      } catch (logError) {
        console.error("Mail log update failed:", logError);
      }
    }

    console.error("Application Mail Error:", error);

    return {
      success: false,
      message: "Email sending failed",
      error: error.message,
      details: error.details || [],
      requestId: error.requestId || null,
      logId: mailLog?.ID || null,
    };
  }
};
