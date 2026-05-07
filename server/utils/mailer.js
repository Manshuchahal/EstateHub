const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

const sendOTPEmail = async (to, otp, type = "register") => {
  const subject =
    type === "forgot_password"
      ? "EstateHub — Reset Your Password"
      : "EstateHub — Verify Your Email";

  const action =
    type === "forgot_password"
      ? "reset your password"
      : "verify your email address";

  const html = `
    <div style="font-family:'DM Sans',sans-serif;background:#0d0d0d;padding:40px;color:#f0ece4;max-width:480px;margin:0 auto;border-radius:12px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:32px;">
        <div style="width:10px;height:10px;border-radius:50%;background:#c9a96e;"></div>
        <span style="font-family:Georgia,serif;font-size:20px;font-weight:500;color:#f5f0e8;">EstateHub</span>
      </div>
      <h2 style="font-family:Georgia,serif;font-size:28px;font-weight:500;color:#f5f0e8;margin:0 0 12px;">
        ${type === "forgot_password" ? "Password Reset" : "Verify your email"}
      </h2>
      <p style="font-size:14px;color:rgba(240,236,228,0.5);margin:0 0 32px;line-height:1.6;">
        Use the code below to ${action}. This code expires in <strong style="color:#c9a96e;">10 minutes</strong>.
      </p>
      <div style="background:rgba(201,169,110,0.1);border:1px solid rgba(201,169,110,0.3);border-radius:10px;padding:24px;text-align:center;margin-bottom:32px;">
        <span style="font-family:Georgia,serif;font-size:42px;font-weight:600;letter-spacing:12px;color:#c9a96e;">${otp}</span>
      </div>
      <p style="font-size:12px;color:rgba(240,236,228,0.25);margin:0;line-height:1.6;">
        If you did not request this, please ignore this email. Do not share this code with anyone.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"EstateHub" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = { sendOTPEmail };
