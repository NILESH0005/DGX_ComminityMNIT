import axios from "axios";

export const sendOtpSMS = async (mobile, otp) => {
  const message = `Your OTP is ${otp}. Do not share it.`;

//   const url = `http://foxxsms.net/sms//submitsms.jsp?user=${process.env.SMS_USER}&key=9f52e53a22XX&mobile=${mobile}&message=${encodeURIComponent(message)}&senderid=${process.env.SMS_SENDER_ID}&accusage=1`;

 const url = `http://foxxsms.net/sms//submitsms.jsp?user=GIINDIA&key=9f52e53a22XX&mobile=+919811649071&message=Your OTP for verification is 12345. Do not share this OTP with anyone. - Global Infoventures Pvt Ltd&senderid=GIVINF&accusage=1`;
  const response = await axios.get(url);
  console.log("teh usrl is", url)
  console.log("teh usrl response is", response)


  return response.data;
};
