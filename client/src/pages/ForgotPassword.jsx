import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import API from "../services/api";

const s = {
  page: { fontFamily: "'DM Sans', sans-serif", background: "#0d0d0d", minHeight: "100vh", color: "#f0ece4" },
  center: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px)", padding: "40px 24px" },
  card: { width: "100%", maxWidth: "420px", background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(240,236,228,0.08)", borderRadius: "16px", padding: "40px" },
  eyebrow: { fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a96e", fontWeight: 500, marginBottom: "6px" },
  title: { fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 500, color: "#f5f0e8", margin: "0 0 10px" },
  sub: { fontSize: "13px", color: "rgba(240,236,228,0.4)", lineHeight: 1.6, margin: "0 0 28px" },
  field: { marginBottom: "16px" },
  label: { display: "block", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,236,228,0.35)", marginBottom: "7px" },
  input: { width: "100%", background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(240,236,228,0.12)", borderRadius: "8px", padding: "12px 16px", fontSize: "13px", color: "#f0ece4", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" },
  pwWrap: { position: "relative" },
  pwToggle: { position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(240,236,228,0.3)", cursor: "pointer", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", padding: 0 },
  btn: { width: "100%", background: "#c9a96e", border: "none", borderRadius: "8px", padding: "14px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#0d0d0d", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", marginTop: "8px" },
  backLink: { display: "block", textAlign: "center", marginTop: "20px", fontSize: "12px", color: "rgba(240,236,228,0.3)", textDecoration: "none" },
  successBox: { background: "rgba(110,189,142,0.1)", border: "0.5px solid rgba(110,189,142,0.3)", borderRadius: "8px", padding: "10px 14px", fontSize: "12px", color: "#6ebd8e", marginBottom: "16px" },
  errorBox: { background: "rgba(220,80,80,0.1)", border: "0.5px solid rgba(220,80,80,0.3)", borderRadius: "8px", padding: "10px 14px", fontSize: "12px", color: "#f59595", marginBottom: "16px" },
  stepIndicator: { display: "flex", gap: "8px", marginBottom: "28px" },
  stepDot: (active, done) => ({
    width: done ? "24px" : active ? "24px" : "8px", height: "8px", borderRadius: "4px",
    background: done ? "#6ebd8e" : active ? "#c9a96e" : "rgba(240,236,228,0.15)",
    transition: "all 0.3s",
  }),
};

export default function ForgotPassword() {
  const navigate    = useNavigate();
  const { state }   = useLocation();
  const [step, setStep]     = useState(state?.otpVerified ? 2 : 0);
  const [email, setEmail]   = useState(state?.email || "");
  const [otp, setOtp]       = useState("");
  const [newPw, setNewPw]   = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError]   = useState("");

  const focus = (e) => (e.target.style.borderColor = "rgba(201,169,110,0.5)");
  const blur  = (e) => (e.target.style.borderColor = "rgba(240,236,228,0.12)");

  // Step 0: Enter email → send OTP
  const handleSendOTP = async () => {
    if (!email) { setError("Please enter your email."); return; }
    setError(""); setLoading(true);
    try {
      await API.post("/auth/forgot-password", { email });
      setSuccess("OTP sent! Check your email.");
      setStep(1);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 6) { setError("Enter the 6-digit OTP."); return; }
    setError(""); setLoading(true);
    try {
      await API.post("/auth/verify-otp", { email, otp, type: "forgot_password" });
      setSuccess("OTP verified!");
      setStep(2);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset password
  const handleReset = async () => {
    if (!newPw || !confirmPw) { setError("Please fill in both fields."); return; }
    if (newPw !== confirmPw) { setError("Passwords do not match."); return; }
    if (newPw.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError(""); setLoading(true);
    try {
      await API.post("/auth/reset-password", { email, otp, newPassword: newPw });
      setSuccess("Password reset successfully! Redirecting to login…");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err?.response?.data?.message || "Reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const STEPS = ["Email", "Verify OTP", "New password"];

  return (
    <div style={s.page}>
      <div style={s.center}>
        <div style={s.card}>
          <p style={s.eyebrow}>Password recovery</p>
          <h2 style={s.title}>
            {step === 0 ? "Forgot password?" : step === 1 ? "Enter OTP" : "Reset password"}
          </h2>
          <p style={s.sub}>
            {step === 0 && "Enter your email and we'll send you a reset code."}
            {step === 1 && `We sent a 6-digit code to ${email}`}
            {step === 2 && "Choose a strong new password for your account."}
          </p>

          <div style={s.stepIndicator}>
            {STEPS.map((_, i) => (
              <div key={i} style={s.stepDot(i === step, i < step)} />
            ))}
          </div>

          {success && <div style={s.successBox}>✓ &nbsp;{success}</div>}
          {error   && <div style={s.errorBox}>{error}</div>}

          {step === 0 && (
            <div style={s.field}>
              <label style={s.label}>Email address</label>
              <input style={s.input} type="email" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)} onFocus={focus} onBlur={blur} />
              <button style={{ ...s.btn, ...(loading ? { opacity: 0.7, cursor: "default" } : {}) }}
                onClick={handleSendOTP} disabled={loading}>
                {loading ? "Sending…" : "Send reset code"}
              </button>
            </div>
          )}

          {step === 1 && (
            <div style={s.field}>
              <label style={s.label}>6-digit OTP</label>
              <input style={s.input} type="text" inputMode="numeric" maxLength={6}
                placeholder="000000" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g,"").slice(0,6))}
                onFocus={focus} onBlur={blur} />
              <button style={{ ...s.btn, ...(loading ? { opacity: 0.7, cursor: "default" } : {}) }}
                onClick={handleVerifyOTP} disabled={loading}>
                {loading ? "Verifying…" : "Verify OTP"}
              </button>
            </div>
          )}

          {step === 2 && (
            <>
              <div style={s.field}>
                <label style={s.label}>New password</label>
                <div style={s.pwWrap}>
                  <input style={{ ...s.input, paddingRight: "52px" }}
                    type={showPw ? "text" : "password"} placeholder="••••••••"
                    value={newPw} onChange={(e) => setNewPw(e.target.value)} onFocus={focus} onBlur={blur} />
                  <button style={s.pwToggle} onClick={() => setShowPw(!showPw)}>
                    {showPw ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div style={s.field}>
                <label style={s.label}>Confirm new password</label>
                <input style={s.input} type="password" placeholder="••••••••"
                  value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} onFocus={focus} onBlur={blur} />
              </div>
              <button style={{ ...s.btn, ...(loading ? { opacity: 0.7, cursor: "default" } : {}) }}
                onClick={handleReset} disabled={loading}>
                {loading ? "Resetting…" : "Reset password"}
              </button>
            </>
          )}

          <Link to="/login" style={s.backLink}>← Back to sign in</Link>
        </div>
      </div>
    </div>
  );
}
