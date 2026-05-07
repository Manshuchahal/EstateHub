import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import API from "../services/api";

const s = {
  page: { fontFamily: "'DM Sans', sans-serif", background: "#0d0d0d", minHeight: "100vh", color: "#f0ece4" },
  center: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px)", padding: "40px 24px" },
  card: { width: "100%", maxWidth: "420px", background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(240,236,228,0.08)", borderRadius: "16px", padding: "40px", textAlign: "center" },
  icon: { fontSize: "36px", marginBottom: "16px" },
  eyebrow: { fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a96e", fontWeight: 500, marginBottom: "6px" },
  title: { fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 500, color: "#f5f0e8", margin: "0 0 10px" },
  sub: { fontSize: "13px", color: "rgba(240,236,228,0.4)", lineHeight: 1.6, margin: "0 0 32px" },
  otpRow: { display: "flex", gap: "10px", justifyContent: "center", marginBottom: "24px" },
  otpInput: {
    width: "48px", height: "56px", textAlign: "center",
    background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(240,236,228,0.15)",
    borderRadius: "8px", fontSize: "22px", fontWeight: 600, color: "#f5f0e8",
    fontFamily: "'Cormorant Garamond', serif", outline: "none",
    transition: "border-color 0.2s",
  },
  btn: { width: "100%", background: "#c9a96e", border: "none", borderRadius: "8px", padding: "14px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#0d0d0d", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", marginBottom: "16px" },
  resendRow: { fontSize: "12px", color: "rgba(240,236,228,0.3)", marginTop: "4px" },
  resendBtn: { color: "#c9a96e", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", padding: 0 },
  successBox: { background: "rgba(110,189,142,0.1)", border: "0.5px solid rgba(110,189,142,0.3)", borderRadius: "8px", padding: "10px 14px", fontSize: "12px", color: "#6ebd8e", marginBottom: "16px" },
  errorBox: { background: "rgba(220,80,80,0.1)", border: "0.5px solid rgba(220,80,80,0.3)", borderRadius: "8px", padding: "10px 14px", fontSize: "12px", color: "#f59595", marginBottom: "16px" },
};

export default function VerifyOTP() {
  const navigate  = useNavigate();
  const { state } = useLocation();
  const email     = state?.email || "";
  const type      = state?.type || "register";

  const [digits, setDigits]   = useState(["","","","","",""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError]     = useState("");
  const [countdown, setCountdown] = useState(60);
  const refs = useRef([]);

  useEffect(() => {
    if (!email) { navigate("/register"); return; }
    const timer = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleDigit = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(""));
      refs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const otp = digits.join("");
    if (otp.length < 6) { setError("Please enter the complete 6-digit code."); return; }
    setError(""); setLoading(true);
    try {
      await API.post("/auth/verify-otp", { email, otp, type });
      setSuccess(type === "register"
        ? "Email verified! Redirecting to login…"
        : "OTP verified! Redirecting…"
      );
      setTimeout(() => {
        if (type === "register") navigate("/login");
        else navigate("/forgot-password", { state: { email, otpVerified: true } });
      }, 1500);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setResending(true); setError(""); setSuccess("");
    try {
      await API.post("/auth/send-otp", { email, type });
      setSuccess("New OTP sent to your email.");
      setCountdown(60);
      setDigits(["","","","","",""]);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.center}>
        <div style={s.card}>
          <div style={s.icon}>📬</div>
          <p style={s.eyebrow}>Verification</p>
          <h2 style={s.title}>Check your email</h2>
          <p style={s.sub}>
            We sent a 6-digit code to<br />
            <strong style={{ color: "#c9a96e" }}>{email}</strong>
          </p>

          {success && <div style={s.successBox}>✓ &nbsp;{success}</div>}
          {error   && <div style={s.errorBox}>{error}</div>}

          <div style={s.otpRow} onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => (refs.current[i] = el)}
                style={{ ...s.otpInput, ...(d ? { borderColor: "#c9a96e" } : {}) }}
                type="text" inputMode="numeric" maxLength={1}
                value={d}
                onChange={(e) => handleDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onFocus={(e) => (e.target.style.borderColor = "rgba(201,169,110,0.7)")}
                onBlur={(e) => (e.target.style.borderColor = d ? "#c9a96e" : "rgba(240,236,228,0.15)")}
              />
            ))}
          </div>

          <button
            style={{ ...s.btn, ...(loading ? { opacity: 0.7, cursor: "default" } : {}) }}
            onClick={handleVerify} disabled={loading}
          >
            {loading ? "Verifying…" : "Verify email"}
          </button>

          <div style={s.resendRow}>
            Didn't receive it?{" "}
            {countdown > 0 ? (
              <span style={{ color: "rgba(240,236,228,0.25)" }}>Resend in {countdown}s</span>
            ) : (
              <button style={s.resendBtn} onClick={handleResend} disabled={resending}>
                {resending ? "Sending…" : "Resend code"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
