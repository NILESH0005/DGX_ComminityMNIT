
import dotenv from "dotenv";
import { SendMailClient } from "zeptomail";

dotenv.config();

const url = "https://api.zeptomail.in/v1.1/email";
const token = process.env.ZEPTO_API_KEY;

if (!token) {
  throw new Error("ZEPTO_API_KEY is missing");
}

const client = new SendMailClient({ url, token });

export async function mailSender({
  receiver,
  subject,
  message = "",
  htmlContent,
  cc,
  bcc,
  inlineImages = [],
}) {
  try {
    const payload = {
      from: {
        address: "support@mpitup.in",
        name: process.env.MAIL_FROM_NAME || "LMS Team",
      },
      to: [
        {
          email_address: {
            address: receiver,
            name: "User",
          },
        },
      ],
      subject,
      textbody: message,
      htmlbody: htmlContent,
    };

    const convertEmails = (emails) => {
      if (!emails) return undefined;

      const list = Array.isArray(emails)
        ? emails
        : String(emails).split(/[;,]/);

      return list
        .map((email) => email.trim())
        .filter(Boolean)
        .map((email) => ({
          email_address: { address: email },
        }));
    };

    const ccList = convertEmails(cc);
    const bccList = convertEmails(bcc);

    if (ccList?.length) payload.cc = ccList;
    if (bccList?.length) payload.bcc = bccList;

    // Optional inline images
    if (inlineImages?.length) {
      payload.inline_images = inlineImages;
    }

    const response = await client.sendMail(payload);

    return { success: true, response };
  } catch (error) {
    console.error("ZeptoMail Error Details:");
    console.dir(error, { depth: null });

    return {
      success: false,
      error:
        error.error?.message ||
        error.message ||
        "Email sending failed",
      details: error.error?.details || error.details || [],
      requestId: error.error?.request_id || null,
    };
  }
}

// import dotenv from "dotenv";
// import { SendMailClient } from "zeptomail";

// dotenv.config();

// const url = "https://api.zeptomail.in/v1.1/email";
// const token = process.env.ZEPTO_API_KEY;
// // const token = "Zoho-enczapikey PHtE6r0FROu632F+8RdR5P68RJamYdgp/Lg0L1JDsohAXvUGF00E/tF4xzK0rxcuUfBFQffJnd86s+6U4OKMI2e/NGxNVGqyqK3sx/VYSPOZsbq6x00btl8ScELfV4LrdtJu1CHWvduX";

// const client = new SendMailClient({ url, token });

// export async function mailSender(receiver, message, htmlContent = "Thank You") {
//     console.log("taoken is", token)
//   try {
//     const response = await client.sendMail({
//       from: {
//         address: "support@mpitup.in",
//         name: "noreply",
//       },
//       to: [
//         {
//           email_address: {
//             address: receiver,
//             name: "User",
//           },
//         },
//       ],
//       subject: "LMS Platform",
//       textbody: message,
//       htmlbody: htmlContent,
//     });

//     return { success: true, response };
//   } catch (error) {
//     console.error("Mail Error:", error);
//     return { success: false, error: error.message };
//   }
// }

// import dotenv from "dotenv";
// import nodemailer from "nodemailer";

// dotenv.config();

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_PASSWORD_KEY,
//   },
// });

// export async function mailSender(receiver, message, htmlContent = "Thank You") {
//   try {
//     const info = await transporter.sendMail({
//       from: process.env.GMAIL_USER,
//       to: receiver,
//       subject: "LMS Platform",
//       text: message,
//       html: htmlContent,
//     });

//     console.log("✅ Email sent:", info.response);
//     return { success: true };
//   } catch (error) {
//     console.error("❌ Email Error FULL:", error);
//     return { success: false, error: error.message };
//   }
// }
