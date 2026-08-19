// import rateLimit from "express-rate-limit";

// export const registrationLimiter = rateLimit({
//   windowMs: 10 * 60 * 1000, // 10 minutes

//   limit: 5, // 5 registration requests per email

//   standardHeaders: true,
//   legacyHeaders: false,

//   keyGenerator: (req) => {
//     const email = req.body?.email;

//     if (!email) {
//       return "missing-email";
//     }

//     return email.trim().toLowerCase();
//   },

//   handler: (req, res) => {
//     console.warn(
//       `🚨 Registration rate limit exceeded | Email: ${req.body?.email} | Time: ${new Date().toISOString()}`
//     );

//     return res.status(429).json({
//       success: false,
//       message:
//         "Too many registration attempts for this email. Please try again later.",
//     });
//   },
// });

import rateLimit from "express-rate-limit";

export const registrationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 3, // only 3 requests for testing

  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
    const email = req.body?.email?.trim().toLowerCase();

    return email || "missing-email";
  },

  handler: (req, res) => {
    console.warn(
      `🚨 Registration rate limit exceeded | Email: ${req.body?.email} | Time: ${new Date().toISOString()}`,
    );

    return res.status(429).json({
      success: false,
      message:
        "Too many registration attempts for this email. Please try again later.",
    });
  },
});
