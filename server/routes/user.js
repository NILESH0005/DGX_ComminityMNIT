import express from "express";
import { body } from "express-validator";
import { fetchUser } from "../middleware/fetchUser.js";

import {
  login,
  registration,
  getUser,
  databaseUserVerification,
  changePassword,
  sendInvite,
  passwordRecovery,
  resetPassword,
  getAllUser,
  deleteUser,
  addUser,
  sendContactEmail,
  addRole,
  getRoles,
  getPages,
  assignPagesToRole,
  getRolePageAccess,
  getUserRole,
  assignSingleRole,
  getPagesByRole,
  registerationUser,
  resendOtp,
  verifyOtpController,
  uploadUsersCsvController,
  uploadCsvController,
  getUserCsvUploadsController,
  checkDuplicateEmailsController,
  resendOtpController,
} from "../controllers/user.js";
import { removeUserRole } from "../services/userService.js";
import { upload } from "../config/multerConfig.js";

const router = express.Router();

router.post(
  "/verify",
  [body("email", "Enter a valid email").isEmail()],
  databaseUserVerification,
);

router.post(
  "/registration",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password at least 5 character").isLength({ min: 5 }),
  ],
  registration,
);

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password can not be blank").exists(),
  ],
  login,
);

router.post(
  "/changePassword",
  [
    body("currentPassword", "Password can not be blank").exists(),
    body("newPassword", "New Password can not be blank").exists(),
  ],
  fetchUser,
  changePassword,
);

router.post("/getuser", fetchUser, getUser);
router.get("/users", fetchUser, getAllUser);

router.post(
  "/sendinvite",
  [body("email", "Enter a valid email").isEmail()],
  fetchUser,
  sendInvite,
);

router.post(
  "/sendContactEmail",
  [body("email", "Enter a valid email").isEmail()],
  fetchUser,
  sendContactEmail,
);

router.post(
  "/passwordrecovery",
  [body("email", "Enter a valid email").isEmail()],
  passwordRecovery,
);

router.post(
  "/resetpassword",
  [
    body("email", "Enter a valid email").isEmail(),
    body("signature", "Signature is required").exists(),
    body("password", "New Password can not be blank").exists(),
  ],
  resetPassword,
);

router.post("/deleteUser", fetchUser, deleteUser);
router.post("/addUser", addUser);
router.post("/addRole", fetchUser, addRole);
router.get("/getRoles", fetchUser, getRoles);
router.get("/getPages", fetchUser, getPages);
router.post("/assignPagesToRole", fetchUser, assignPagesToRole);
router.get("/rolePageAccess", fetchUser, getRolePageAccess);
router.post("/assignRoles", fetchUser, assignSingleRole);
router.get("/getUserRoles", fetchUser, getUserRole);
router.post("/removeUserRole", fetchUser, removeUserRole);
router.get("/pages-by-role", fetchUser, getPagesByRole);
router.post("/register", registerationUser);
router.post("/verify-otp", verifyOtpController);
router.post("/resend-otp", resendOtp);

// router.post("/upload-csv", upload.single("file"), uploadUsersCsvController);
router.post("/upload-csv", upload.single("file"), uploadCsvController);
router.get("/uploads/:userId", getUserCsvUploadsController);
router.post("/check-duplicate-emails", checkDuplicateEmailsController);
router.post("/resend-otpAttempts", resendOtpController);

export default router;
