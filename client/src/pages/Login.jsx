import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const s = {
  page: { fontFamily: "'DM Sans', sans-serif", background: "#0d0d0d", minHeight: "100vh", color: "#f0ece4" },
  center: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px)", padding: "40px 24px" },
  card: {
    width: "100%", maxWidth: "440px",
    background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(240,236,228,0.08)",
    borderRadius: "16px", padding: "40px",
  },
  eyebrow: { fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a96e", fontWeight: 500, marginBottom: "6px" },
  title: { fontFamily: "'Cormorant Garamond', serif", fontSize: "30px", fontWeight: 500, color: "#f5f0e8", margin: "0 0 28px" },
  field: { marginBottom: "16px" },
  label: { display: "block", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,236,228,0.35)", marginBottom: "7px" },
  input: {
    width: "100%", background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(240,236,228,0.12)",
    borderRadius: "8px", padding: "12px 16px", fontSize: "13px", color: "#f0ece4",
    fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
  },
  pwWrap: { position: "relative" },
  pwToggle: {
    position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
    background: "none", border: "none", color: "rgba(240,236,228,0.3)",
    cursor: "pointer", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", padding: 0,
  },
  forgotLink: { display: "block", textAlign: "right", fontSize: "12px", color: "#c9a96e", textDecoration: "none", marginTop: "6px" },
  btn: {
    width: "100%", background: "#c9a96e", border: "none", borderRadius: "8px",
    padding: "14px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.08em",
    textTransform: "uppercase", color: "#0d0d0d", fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer", marginTop: "20px",
  },
  divider: { display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" },
  divLine: { flex: 1, height: "0.5px", background: "rgba(240,236,228,0.1)" },
  divText: { fontSize: "11px", color: "rgba(240,236,228,0.25)" },
  bottomLink: { textAlign: "center", fontSize: "12px", color: "rgba(240,236,228,0.3)" },
  errorBox: { background: "rgba(220,80,80,0.1)", border: "0.5px solid rgba(220,80,80,0.3)", borderRadius: "8px", padding: "10px 14px", fontSize: "12px", color: "#f59595", marginBottom: "16px" },
};

export default function Login() {
  const [form, setForm]     = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const navigate = useNavigate();

  const set   = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const focus = (e) => (e.target.style.borderColor = "rgba(201,169,110,0.5)");
  const blur  = (e) => (e.target.style.borderColor = "rgba(240,236,228,0.12)");

  // No <form> tag at all — just a div wrapper
// Button must be type="button" to prevent any accidental submit

const handleLogin = async () => {         // ← no 'e' parameter needed
  if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
  setError(""); setLoading(true);
  try {
    const res = await API.post("/auth/login", form);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    navigate(res.data.user.role === "admin" ? "/admin" : "/");
  } catch (err) {
    setError(err?.response?.data?.message || "Login failed.");
  } finally {
    setLoading(false);
  }
};

// In JSX:
<div>                                     {/* ← div, NOT form */}
  ...
  <button type="button" onClick={handleLogin}>Sign in</button>
</div>

  return (
    <div style={s.page}>
      <div style={s.center}>
        <div style={s.card}>
          <p style={s.eyebrow}>Welcome back</p>
          <h2 style={s.title}>Sign in</h2>

          {error && <div style={s.errorBox}>{error}</div>}

          <div style={s.field}>
            <label style={s.label}>Email address</label>
            <input style={s.input} type="email" placeholder="you@example.com"
              value={form.email} onChange={set("email")} onFocus={focus} onBlur={blur} />
          </div>

          <div style={s.field}>
            <label style={s.label}>Password</label>
            <div style={s.pwWrap}>
              <input style={{ ...s.input, paddingRight: "52px" }}
                type={showPw ? "text" : "password"} placeholder="••••••••"
                value={form.password} onChange={set("password")} onFocus={focus} onBlur={blur} />
              <button style={s.pwToggle} onClick={() => setShowPw(!showPw)}>
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
            <Link to="/forgot-password" style={s.forgotLink}>Forgot password?</Link>
          </div>

          <button
            style={{ ...s.btn, ...(loading ? { opacity: 0.7, cursor: "default" } : {}) }}
            onClick={handleLogin} disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <div style={s.divider}>
            <div style={s.divLine} />
            <span style={s.divText}>New to EstateHub?</span>
            <div style={s.divLine} />
          </div>

          <p style={s.bottomLink}>
            <Link to="/register" style={{ color: "#c9a96e", textDecoration: "none", fontWeight: 500 }}>
              Create a free account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
