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

import rateLimit, { ipKeyGenerator } from "express-rate-limit";

const windowMinutes = Number(
  process.env.REGISTRATION_RATE_LIMIT_WINDOW_MINUTES,
);

const maxAttempts = Number(
  process.env.REGISTRATION_RATE_LIMIT_MAX_ATTEMPTS,
);

export const registrationLimiter = rateLimit({
  windowMs: windowMinutes * 60 * 1000,

  limit: maxAttempts,

  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
    const email =
      req.body?.email?.trim().toLowerCase() || "missing-email";

    const ip = req.ip
      ? ipKeyGenerator(req.ip)
      : "unknown-ip";

    return `${email}:${ip}`;
  },

  handler: (req, res) => {
    console.warn(
      `🚨 Registration rate limit exceeded | Email: ${
        req.body?.email
      } | IP: ${req.ip} | Time: ${new Date().toISOString()}`,
    );

    return res.status(429).json({
      success: false,
      message: "Too many registration attempts. Please try again later.",
    });
  },
});