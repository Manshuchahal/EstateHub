const express = require("express");
const router  = express.Router();
const {
  register, sendOTP, verifyOTP,
  login, forgotPassword, resetPassword,
} = require("../controllers/authController");

router.post("/register",         register);
router.post("/send-otp",         sendOTP);
router.post("/verify-otp",       verifyOTP);
router.post("/login",            login);
router.post("/forgot-password",  forgotPassword);
router.post("/reset-password",   resetPassword);

module.exports = router;
