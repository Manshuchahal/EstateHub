const bcrypt      = require("bcryptjs");
const jwt         = require("jsonwebtoken");
const db          = require("../config/db");
const { sendOTPEmail } = require("../utils/mailer");

// ── Helper: generate 6-digit OTP ─────────────────────
const generateOTP = () => String(Math.floor(100000 + Math.random() * 900000));

// ── Helper: save OTP to DB ────────────────────────────
const saveOTP = async (email, otp, type) => {
  // Remove any existing OTP for this email+type
  await db.query(
    "DELETE FROM otp_verifications WHERE email = ? AND type = ?",
    [email, type]
  );
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  await db.query(
    "INSERT INTO otp_verifications (email, otp, type, expires_at) VALUES (?, ?, ?, ?)",
    [email, otp, type, expiresAt]
  );
};

// ─────────────────────────────────────────────────────
//  POST /api/auth/register
// ─────────────────────────────────────────────────────
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required." });

  if (password.length < 6)
    return res.status(400).json({ message: "Password must be at least 6 characters." });

  try {
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0)
      return res.status(409).json({ message: "Email already registered." });

    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (name, email, password, role, is_verified) VALUES (?, ?, ?, 'user', 0)",
      [name, email, hashed]
    );

    // Send OTP
    const otp = generateOTP();
    await saveOTP(email, otp, "register");
    await sendOTPEmail(email, otp, "register");

    res.status(201).json({ message: "Account created. OTP sent to your email." });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
};

// ─────────────────────────────────────────────────────
//  POST /api/auth/send-otp
// ─────────────────────────────────────────────────────
const sendOTP = async (req, res) => {
  const { email, type = "register" } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required." });

  try {
    const [users] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (type === "register" && users.length === 0)
      return res.status(404).json({ message: "No account found with this email." });

    const otp = generateOTP();
    await saveOTP(email, otp, type);
    await sendOTPEmail(email, otp, type);

    res.json({ message: "OTP sent successfully." });
  } catch (err) {
    console.error("Send OTP error:", err.message);
    res.status(500).json({ message: "Failed to send OTP." });
  }
};

// ─────────────────────────────────────────────────────
//  POST /api/auth/verify-otp
// ─────────────────────────────────────────────────────
const verifyOTP = async (req, res) => {
  const { email, otp, type = "register" } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required." });

  try {
    const [rows] = await db.query(
      "SELECT * FROM otp_verifications WHERE email = ? AND type = ? ORDER BY created_at DESC LIMIT 1",
      [email, type]
    );

    if (rows.length === 0)
      return res.status(400).json({ message: "No OTP found. Please request a new one." });

    const record = rows[0];

    if (new Date() > new Date(record.expires_at))
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });

    if (record.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP. Please check and try again." });

    // Mark user as verified
    if (type === "register") {
      await db.query("UPDATE users SET is_verified = 1 WHERE email = ?", [email]);
    }

    // Clean up used OTP
    await db.query(
      "DELETE FROM otp_verifications WHERE email = ? AND type = ?",
      [email, type]
    );

    res.json({ message: "OTP verified successfully." });
  } catch (err) {
    console.error("Verify OTP error:", err.message);
    res.status(500).json({ message: "OTP verification failed." });
  }
};

// ─────────────────────────────────────────────────────
//  POST /api/auth/login
// ─────────────────────────────────────────────────────
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required." });

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0)
      return res.status(401).json({ message: "Invalid email or password." });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password." });

    if (!user.is_verified && user.role !== "admin")
      return res.status(403).json({
        message: "Email not verified. Please verify your email first.",
        requiresVerification: true,
        email: user.email,
      });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
};

// ─────────────────────────────────────────────────────
//  POST /api/auth/forgot-password
// ─────────────────────────────────────────────────────
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required." });

  try {
    const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (rows.length === 0)
      return res.status(404).json({ message: "No account found with this email." });

    const otp = generateOTP();
    await saveOTP(email, otp, "forgot_password");
    await sendOTPEmail(email, otp, "forgot_password");

    res.json({ message: "Password reset OTP sent to your email." });
  } catch (err) {
    console.error("Forgot password error:", err.message);
    res.status(500).json({ message: "Failed to send reset OTP." });
  }
};

// ─────────────────────────────────────────────────────
//  POST /api/auth/reset-password
// ─────────────────────────────────────────────────────
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword)
    return res.status(400).json({ message: "Email, OTP and new password are required." });

  if (newPassword.length < 6)
    return res.status(400).json({ message: "Password must be at least 6 characters." });

  try {
    // Verify OTP
    const [rows] = await db.query(
      "SELECT * FROM otp_verifications WHERE email = ? AND type = 'forgot_password' ORDER BY created_at DESC LIMIT 1",
      [email]
    );

    if (rows.length === 0)
      return res.status(400).json({ message: "No OTP found. Please request a new one." });

    const record = rows[0];

    if (new Date() > new Date(record.expires_at))
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });

    if (record.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP." });

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = ? WHERE email = ?", [hashed, email]);

    await db.query(
      "DELETE FROM otp_verifications WHERE email = ? AND type = 'forgot_password'",
      [email]
    );

    res.json({ message: "Password reset successfully. You can now log in." });
  } catch (err) {
    console.error("Reset password error:", err.message);
    res.status(500).json({ message: "Password reset failed." });
  }
};

module.exports = { register, sendOTP, verifyOTP, login, forgotPassword, resetPassword };
