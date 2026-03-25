import dotenv from "dotenv";
import { SendMailClient } from "zeptomail";

dotenv.config();

const url = "https://api.zeptomail.in/v1.1/email";
const token = process.env.ZEPTO_API_KEY;
// const token = "Zoho-enczapikey PHtE6r0FROu632F+8RdR5P68RJamYdgp/Lg0L1JDsohAXvUGF00E/tF4xzK0rxcuUfBFQffJnd86s+6U4OKMI2e/NGxNVGqyqK3sx/VYSPOZsbq6x00btl8ScELfV4LrdtJu1CHWvduX";


const client = new SendMailClient({ url, token });


export async function mailSender(receiver, message, htmlContent = "Thank You") {
    console.log("taoken is", token)
  try {
    const response = await client.sendMail({
      from: {
        address: "support@mpitup.in",
        name: "noreply",
      },
      to: [
        {
          email_address: {
            address: receiver,
            name: "User",
          },
        },
      ],
      subject: "AI Awareness for All",
      textbody: message,
      htmlbody: htmlContent,
    });

    return { success: true, response };
  } catch (error) {
    console.error("Mail Error:", error);
    return { success: false, error: error.message };
  }
}
