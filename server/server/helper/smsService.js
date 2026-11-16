import axios from "axios";
import http from "http";

const agent = new http.Agent({
  family: 4, // ✅ FORCE IPv4
});

export const sendOtpSMS = async (mobile, otp) => {
  try {
    const message = `Your OTP for verification is ${otp}. Do not share this OTP with anyone. - Global Infoventures Pvt Ltd`;

    const url = `http://foxxsms.net/sms/submitsms.jsp?user=GIINDIA&key=9f52e53a22XX&mobile=${mobile}&message=${encodeURIComponent(message)}&senderid=GIVINF&accusage=1`;

    const response = await axios.get(url, {
      httpAgent: agent,   // 🔥 THIS LINE FIXES EVERYTHING
      timeout: 5000,
    });

    console.log("SMS Response:", response.data);
    return response.data;

  } catch (error) {
    console.error("SMS ERROR:", error.message);
    return null;
  }
};