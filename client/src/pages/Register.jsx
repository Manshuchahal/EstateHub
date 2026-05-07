import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const s = {
  page: { fontFamily: "'DM Sans', sans-serif", background: "#0d0d0d", minHeight: "100vh", color: "#f0ece4" },
  center: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px)", padding: "40px 24px" },
  card: { width: "100%", maxWidth: "440px", background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(240,236,228,0.08)", borderRadius: "16px", padding: "40px" },
  eyebrow: { fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a96e", fontWeight: 500, marginBottom: "6px" },
  title: { fontFamily: "'Cormorant Garamond', serif", fontSize: "30px", fontWeight: 500, color: "#f5f0e8", margin: "0 0 28px" },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" },
  field: { marginBottom: "16px" },
  label: { display: "block", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,236,228,0.35)", marginBottom: "7px" },
  input: { width: "100%", background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(240,236,228,0.12)", borderRadius: "8px", padding: "12px 16px", fontSize: "13px", color: "#f0ece4", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" },
  pwWrap: { position: "relative" },
  pwToggle: { position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(240,236,228,0.3)", cursor: "pointer", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", padding: 0 },
  strengthBars: { display: "flex", gap: "4px", marginTop: "8px" },
  bar: { flex: 1, height: "2px", borderRadius: "2px", background: "rgba(240,236,228,0.1)", transition: "background 0.3s" },
  terms: { display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "20px" },
  termsText: { fontSize: "12px", color: "rgba(240,236,228,0.3)", lineHeight: 1.5, margin: 0 },
  btn: { width: "100%", background: "#c9a96e", border: "none", borderRadius: "8px", padding: "14px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#0d0d0d", fontFamily: "'DM Sans', sans-serif", cursor: "pointer" },
  divider: { display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" },
  divLine: { flex: 1, height: "0.5px", background: "rgba(240,236,228,0.1)" },
  divText: { fontSize: "11px", color: "rgba(240,236,228,0.25)" },
  bottomLink: { textAlign: "center", fontSize: "12px", color: "rgba(240,236,228,0.3)" },
  errorBox: { background: "rgba(220,80,80,0.1)", border: "0.5px solid rgba(220,80,80,0.3)", borderRadius: "8px", padding: "10px 14px", fontSize: "12px", color: "#f59595", marginBottom: "16px" },
};

const STRENGTH_COLORS = ["#e25555","#e28b45","#c9a96e","#6ebd8e"];
const STRENGTH_LABELS = ["Weak","Fair","Good","Strong"];

function getStrength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export default function Register() {
  const [form, setForm]     = useState({ fname: "", lname: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const navigate = useNavigate();

  const set   = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const focus = (e) => (e.target.style.borderColor = "rgba(201,169,110,0.5)");
  const blur  = (e) => (e.target.style.borderColor = "rgba(240,236,228,0.12)");
  const strength = form.password ? getStrength(form.password) : 0;

  const handleSubmit = async () => {
    if (!form.fname || !form.email || !form.password || !form.confirm) {
      setError("Please fill in all required fields."); return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match."); return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters."); return;
    }
    if (!agreed) {
      setError("Please accept the Terms of Service."); return;
    }
    setError(""); setLoading(true);
    try {
      await API.post("/auth/register", {
        name: `${form.fname} ${form.lname}`.trim(),
        email: form.email,
        password: form.password,
      });
      navigate("/verify-otp", { state: { email: form.email, type: "register" } });
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.center}>
        <div style={s.card}>
          <p style={s.eyebrow}>Join EstateHub</p>
          <h2 style={s.title}>Create account</h2>

          {error && <div style={s.errorBox}>{error}</div>}

          <div style={s.row2}>
            <div style={s.field}>
              <label style={s.label}>First name *</label>
              <input style={s.input} placeholder="Arjun" value={form.fname} onChange={set("fname")} onFocus={focus} onBlur={blur} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Last name</label>
              <input style={s.input} placeholder="Sharma" value={form.lname} onChange={set("lname")} onFocus={focus} onBlur={blur} />
            </div>
          </div>

          <div style={s.field}>
            <label style={s.label}>Email address *</label>
            <input style={s.input} type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} onFocus={focus} onBlur={blur} />
          </div>

          <div style={s.field}>
            <label style={s.label}>Password *</label>
            <div style={s.pwWrap}>
              <input style={{ ...s.input, paddingRight: "52px" }}
                type={showPw ? "text" : "password"} placeholder="••••••••"
                value={form.password} onChange={set("password")} onFocus={focus} onBlur={blur} />
              <button style={s.pwToggle} onClick={() => setShowPw(!showPw)}>
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
            {form.password && (
              <>
                <div style={s.strengthBars}>
                  {[0,1,2,3].map((i) => (
                    <div key={i} style={{ ...s.bar, background: i < strength ? STRENGTH_COLORS[strength - 1] : "rgba(240,236,228,0.1)" }} />
                  ))}
                </div>
                <span style={{ fontSize: "11px", color: STRENGTH_COLORS[strength - 1], marginTop: "5px", display: "block" }}>
                  {STRENGTH_LABELS[strength - 1]}
                </span>
              </>
            )}
          </div>

          <div style={s.field}>
            <label style={s.label}>Confirm password *</label>
            <input style={s.input} type="password" placeholder="••••••••"
              value={form.confirm} onChange={set("confirm")} onFocus={focus} onBlur={blur} />
          </div>

          <div style={s.terms}>
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
              style={{ accentColor: "#c9a96e", flexShrink: 0, marginTop: "2px" }} />
            <p style={s.termsText}>
              I agree to the <a href="/terms" style={{ color: "#c9a96e", textDecoration: "none" }}>Terms of Service</a> and{" "}
              <a href="/privacy" style={{ color: "#c9a96e", textDecoration: "none" }}>Privacy Policy</a>
            </p>
          </div>

          <button
            style={{ ...s.btn, ...(loading ? { opacity: 0.7, cursor: "default" } : {}) }}
            onClick={handleSubmit} disabled={loading}
          >
            {loading ? "Creating account…" : "Create account"}
          </button>

          <div style={s.divider}>
            <div style={s.divLine} />
            <span style={s.divText}>Already have an account?</span>
            <div style={s.divLine} />
          </div>

          <p style={s.bottomLink}>
            <Link to="/login" style={{ color: "#c9a96e", textDecoration: "none", fontWeight: 500 }}>
              Sign in instead →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
