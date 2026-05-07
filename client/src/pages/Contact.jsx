import { useState } from "react";
import API from "../services/api";

const s = {
  page: { fontFamily: "'DM Sans', sans-serif", background: "#0d0d0d", minHeight: "100vh", color: "#f0ece4" },
  split: { display: "grid", gridTemplateColumns: "1fr 1.4fr", minHeight: "calc(100vh - 64px)" },
  left: { background: "#161310", padding: "60px 48px", borderRight: "0.5px solid rgba(201,169,110,0.15)", display: "flex", flexDirection: "column", justifyContent: "space-between" },
  label: { fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a96e", fontWeight: 500, marginBottom: "14px" },
  heading: { fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 500, lineHeight: 1.1, color: "#f5f0e8", margin: "0 0 20px" },
  tagline: { fontSize: "13px", color: "rgba(240,236,228,0.38)", fontWeight: 300, lineHeight: 1.7, margin: "0 0 48px" },
  infoList: { display: "flex", flexDirection: "column", gap: "20px" },
  infoItem: { display: "flex", alignItems: "flex-start", gap: "14px" },
  infoIcon: { width: "36px", height: "36px", borderRadius: "8px", background: "rgba(201,169,110,0.1)", border: "0.5px solid rgba(201,169,110,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "14px", color: "#c9a96e" },
  infoMeta: { fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,236,228,0.3)", margin: "0 0 3px" },
  infoVal: { fontSize: "13px", color: "#f0ece4", margin: 0 },
  hours: { marginTop: "40px", paddingTop: "24px", borderTop: "0.5px solid rgba(201,169,110,0.1)" },
  hoursLabel: { fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(240,236,228,0.25)", marginBottom: "10px" },
  hoursRow: { display: "flex", justifyContent: "space-between", fontSize: "12px", color: "rgba(240,236,228,0.45)", padding: "4px 0" },
  right: { padding: "60px 52px" },
  formLabel: { fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#c9a96e", fontWeight: 500, marginBottom: "28px" },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  field: { marginBottom: "20px" },
  fieldLabel: { display: "block", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,236,228,0.35)", marginBottom: "8px" },
  input: { width: "100%", background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(240,236,228,0.12)", borderRadius: "8px", padding: "13px 16px", fontSize: "13px", color: "#f0ece4", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" },
  sendBtn: { width: "100%", marginTop: "8px", background: "#c9a96e", border: "none", borderRadius: "8px", padding: "15px", fontSize: "13px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#0d0d0d", fontFamily: "'DM Sans', sans-serif", cursor: "pointer" },
  successBox: { background: "rgba(110,189,142,0.1)", border: "0.5px solid rgba(110,189,142,0.3)", borderRadius: "8px", padding: "12px 16px", fontSize: "13px", color: "#6ebd8e", marginBottom: "20px" },
  errorBox: { background: "rgba(220,80,80,0.1)", border: "0.5px solid rgba(220,80,80,0.3)", borderRadius: "8px", padding: "10px 14px", fontSize: "12px", color: "#f59595", marginBottom: "16px" },
  successState: { textAlign: "center", padding: "60px 0" },
  successIcon: { width: "52px", height: "52px", borderRadius: "50%", background: "rgba(201,169,110,0.12)", border: "0.5px solid rgba(201,169,110,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "22px", color: "#c9a96e" },
  successHeading: { fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", color: "#f5f0e8", margin: "0 0 8px", fontWeight: 500 },
  successSub: { fontSize: "13px", color: "rgba(240,236,228,0.4)", lineHeight: 1.6, margin: 0 },
};

const INFO = [
  { icon: "✉", label: "Email", value: "support@estatehub.com" },
  { icon: "☎", label: "Phone", value: "+91 98765 43210" },
  { icon: "◎", label: "Office", value: "Connaught Place, New Delhi" },
];

const HOURS = [
  ["Monday – Friday", "9:00 – 18:00"],
  ["Saturday", "10:00 – 14:00"],
  ["Sunday", "Closed"],
];

export default function Contact() {
  const [form, setForm] = useState({ fname: "", lname: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const set   = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const focus = (e) => (e.target.style.borderColor = "rgba(201,169,110,0.5)");
  const blur  = (e) => (e.target.style.borderColor = "rgba(240,236,228,0.12)");

  const inputStyle = (key) => ({
    ...s.input,
    ...(error && !form[key] ? { borderColor: "rgba(220,80,80,0.4)" } : {}),
  });

  const handleSubmit = async () => {
    if (!form.fname || !form.email || !form.message) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await API.post("/contact", {
        name:    `${form.fname} ${form.lname}`.trim(),
        email:   form.email,
        subject: form.subject || null,
        message: form.message,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.split}>

        {/* Left */}
        <div style={s.left}>
          <div>
            <p style={s.label}>Get in touch</p>
            <h1 style={s.heading}>Let's talk<br />about your<br />next home.</h1>
            <p style={s.tagline}>Our advisors are available to guide you through every step of your property journey.</p>
            <div style={s.infoList}>
              {INFO.map(({ icon, label, value }) => (
                <div key={label} style={s.infoItem}>
                  <div style={s.infoIcon}>{icon}</div>
                  <div>
                    <p style={s.infoMeta}>{label}</p>
                    <p style={s.infoVal}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={s.hours}>
            <p style={s.hoursLabel}>Office hours</p>
            {HOURS.map(([day, time]) => (
              <div key={day} style={s.hoursRow}>
                <span>{day}</span><span>{time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div style={s.right}>
          <p style={s.formLabel}>Send a message</p>

          {submitted ? (
            <div style={s.successState}>
              <div style={s.successIcon}>✓</div>
              <h3 style={s.successHeading}>Message sent</h3>
              <p style={s.successSub}>
                Thank you for reaching out. One of our advisors<br />will be in touch within 24 hours.
              </p>
            </div>
          ) : (
            <>
              {error && <div style={s.errorBox}>{error}</div>}

              <div style={s.row2}>
                <div style={s.field}>
                  <label style={s.fieldLabel}>First name *</label>
                  <input style={inputStyle("fname")} placeholder="Arjun"
                    value={form.fname} onChange={set("fname")} onFocus={focus} onBlur={blur} />
                </div>
                <div style={s.field}>
                  <label style={s.fieldLabel}>Last name</label>
                  <input style={s.input} placeholder="Sharma"
                    value={form.lname} onChange={set("lname")} onFocus={focus} onBlur={blur} />
                </div>
              </div>

              <div style={s.field}>
                <label style={s.fieldLabel}>Email address *</label>
                <input style={inputStyle("email")} type="email" placeholder="arjun@example.com"
                  value={form.email} onChange={set("email")} onFocus={focus} onBlur={blur} />
              </div>

              <div style={s.field}>
                <label style={s.fieldLabel}>I'm interested in</label>
                <select style={s.input} value={form.subject} onChange={set("subject")}>
                  <option value="">Select a topic…</option>
                  <option>Buying a property</option>
                  <option>Renting a property</option>
                  <option>Selling my property</option>
                  <option>Investment advisory</option>
                  <option>General enquiry</option>
                </select>
              </div>

              <div style={s.field}>
                <label style={s.fieldLabel}>Message *</label>
                <textarea
                  style={{ ...inputStyle("message"), resize: "none" }}
                  rows={4} placeholder="Tell us what you're looking for…"
                  value={form.message} onChange={set("message")}
                  onFocus={focus} onBlur={blur}
                />
              </div>

              <button
                style={{ ...s.sendBtn, ...(loading ? { opacity: 0.7, cursor: "default" } : {}) }}
                onClick={handleSubmit} disabled={loading}
              >
                {loading ? "Sending…" : "Send message"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
