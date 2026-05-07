import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

const BASE = "http://localhost:5000";

// ── Styles ──────────────────────────────────────────────────────────────────
const s = {
  page: {
    fontFamily: "'DM Sans', sans-serif",
    background: "#0d0d0d",
    minHeight: "100vh",
    color: "#f0ece4",
  },

  // Topbar
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 48px",
    height: "64px",
    background: "rgba(13,13,13,0.92)",
    backdropFilter: "blur(12px)",
    borderBottom: "0.5px solid rgba(201,169,110,0.15)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  brand: { display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" },
  brandDot: { width: "8px", height: "8px", borderRadius: "50%", background: "#c9a96e" },
  brandName: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "18px", fontWeight: 500, color: "#f5f0e8",
  },
  backBtn: {
    display: "flex", alignItems: "center", gap: "8px",
    background: "rgba(255,255,255,0.04)",
    border: "0.5px solid rgba(240,236,228,0.12)",
    borderRadius: "8px", padding: "8px 16px",
    color: "rgba(240,236,228,0.6)", fontSize: "12px",
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.05em", transition: "border-color 0.2s",
  },

  // Layout
  body: {
    display: "grid",
    gridTemplateColumns: "1fr 380px",
    gap: "40px",
    padding: "48px",
    maxWidth: "1300px",
    margin: "0 auto",
  },
  left: { display: "flex", flexDirection: "column", gap: "32px" },
  right: { display: "flex", flexDirection: "column", gap: "20px" },

  // Slider
  sliderWrap: {
    borderRadius: "14px",
    overflow: "hidden",
    position: "relative",
    background: "#111",
    aspectRatio: "16/9",
  },
  sliderImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "opacity 0.4s ease",
  },
  sliderNoImg: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "56px",
    background: "linear-gradient(135deg, #1a1a1a, #2a2218)",
  },
  sliderOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)",
    pointerEvents: "none",
  },
  sliderCount: {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(6px)",
    borderRadius: "20px",
    padding: "4px 12px",
    fontSize: "12px",
    color: "#f0ece4",
    fontWeight: 500,
  },
  sliderPrev: {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(0,0,0,0.55)",
    backdropFilter: "blur(6px)",
    border: "0.5px solid rgba(255,255,255,0.15)",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#f0ece4",
    fontSize: "16px",
    zIndex: 2,
    transition: "background 0.2s",
  },
  sliderNext: {
    position: "absolute",
    right: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(0,0,0,0.55)",
    backdropFilter: "blur(6px)",
    border: "0.5px solid rgba(255,255,255,0.15)",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#f0ece4",
    fontSize: "16px",
    zIndex: 2,
    transition: "background 0.2s",
  },
  thumbsRow: {
    display: "flex",
    gap: "8px",
    overflowX: "auto",
    paddingBottom: "4px",
  },
  thumb: (active) => ({
    width: "72px",
    height: "52px",
    borderRadius: "6px",
    overflow: "hidden",
    flexShrink: 0,
    cursor: "pointer",
    border: active ? "2px solid #c9a96e" : "2px solid transparent",
    opacity: active ? 1 : 0.55,
    transition: "all 0.2s",
  }),
  thumbImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },

  // Property info
  infoCard: {
    background: "rgba(255,255,255,0.03)",
    border: "0.5px solid rgba(240,236,228,0.08)",
    borderRadius: "14px",
    padding: "32px",
  },
  eyebrow: {
    fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase",
    color: "#c9a96e", fontWeight: 500, margin: "0 0 12px",
  },
  propTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 500,
    color: "#f5f0e8", margin: "0 0 16px", lineHeight: 1.15,
  },
  metaRow: {
    display: "flex", alignItems: "center", gap: "20px",
    marginBottom: "20px", flexWrap: "wrap",
  },
  price: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "28px", fontWeight: 500, color: "#c9a96e",
  },
  locBadge: {
    display: "flex", alignItems: "center", gap: "6px",
    fontSize: "13px", color: "rgba(240,236,228,0.5)",
  },
  divider: {
    height: "0.5px",
    background: "rgba(240,236,228,0.08)",
    margin: "20px 0",
  },
  descLabel: {
    fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase",
    color: "rgba(240,236,228,0.3)", fontWeight: 500, margin: "0 0 12px",
  },
  desc: {
    fontSize: "14px", color: "rgba(240,236,228,0.6)",
    lineHeight: 1.8, margin: 0, fontWeight: 300,
  },

  // Contact card
  contactCard: {
    background: "rgba(255,255,255,0.03)",
    border: "0.5px solid rgba(240,236,228,0.08)",
    borderRadius: "14px",
    padding: "28px",
    position: "sticky",
    top: "84px",
  },
  contactLabel: {
    fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase",
    color: "#c9a96e", fontWeight: 500, margin: "0 0 6px",
  },
  contactTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "22px", fontWeight: 500, color: "#f5f0e8", margin: "0 0 24px",
  },
  field: { marginBottom: "14px" },
  fieldLabel: {
    display: "block", fontSize: "11px", letterSpacing: "0.1em",
    textTransform: "uppercase", color: "rgba(240,236,228,0.35)", marginBottom: "7px",
  },
  fieldInput: {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "0.5px solid rgba(240,236,228,0.12)",
    borderRadius: "8px", padding: "11px 14px",
    fontSize: "13px", color: "#f0ece4",
    fontFamily: "'DM Sans', sans-serif",
    outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  fieldTextarea: {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "0.5px solid rgba(240,236,228,0.12)",
    borderRadius: "8px", padding: "11px 14px",
    fontSize: "13px", color: "#f0ece4",
    fontFamily: "'DM Sans', sans-serif",
    outline: "none", boxSizing: "border-box",
    resize: "vertical", minHeight: "100px",
    transition: "border-color 0.2s",
  },
  sendBtn: {
    width: "100%",
    background: "#c9a96e", border: "none", borderRadius: "8px",
    padding: "14px", fontSize: "13px", fontWeight: 500,
    letterSpacing: "0.08em", textTransform: "uppercase",
    color: "#0d0d0d", fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer", marginTop: "4px",
    transition: "background 0.2s",
  },
  successMsg: {
    background: "rgba(110,189,142,0.1)",
    border: "0.5px solid rgba(110,189,142,0.3)",
    borderRadius: "8px", padding: "10px 14px",
    fontSize: "12px", color: "#6ebd8e", marginBottom: "14px",
  },
  errorMsg: {
    background: "rgba(220,80,80,0.1)",
    border: "0.5px solid rgba(220,80,80,0.3)",
    borderRadius: "8px", padding: "10px 14px",
    fontSize: "12px", color: "#f59595", marginBottom: "14px",
  },

  // States
  stateWrap: {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", minHeight: "60vh", gap: "12px",
    color: "rgba(240,236,228,0.3)",
  },
  stateIcon: { fontSize: "40px" },
  stateText: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "20px", color: "rgba(240,236,228,0.35)",
  },
};

// ── Image Slider ─────────────────────────────────────────────────────────────
function ImageSlider({ images }) {
  const [current, setCurrent] = useState(0);
  const [fade, setFade]       = useState(true);
  const total = images.length;

  const goTo = useCallback((index) => {
    setFade(false);
    setTimeout(() => {
      setCurrent((index + total) % total);
      setFade(true);
    }, 180);
  }, [total]);

  const prev = () => goTo(current - 1);
  const next = () => goTo(current + 1);

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => goTo(current + 1), 4000);
    return () => clearInterval(timer);
  }, [current, total, goTo]);

  if (total === 0) {
    return (
      <div style={s.sliderWrap}>
        <div style={s.sliderNoImg}>🏠</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={s.sliderWrap}>
        <img
          src={`${BASE}${images[current]}`}
          alt={`Property image ${current + 1}`}
          style={{ ...s.sliderImg, opacity: fade ? 1 : 0 }}
        />
        <div style={s.sliderOverlay} />
        <span style={s.sliderCount}>{current + 1} / {total}</span>

        {total > 1 && (
          <>
            <button
              style={s.sliderPrev}
              onClick={prev}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(201,169,110,0.4)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.55)")}
            >‹</button>
            <button
              style={s.sliderNext}
              onClick={next}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(201,169,110,0.4)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.55)")}
            >›</button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {total > 1 && (
        <div style={s.thumbsRow}>
          {images.map((img, i) => (
            <div key={i} style={s.thumb(i === current)} onClick={() => goTo(i)}>
              <img src={`${BASE}${img}`} alt={`Thumb ${i + 1}`} style={s.thumbImg} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Contact Form ─────────────────────────────────────────────────────────────
function ContactForm({ propertyId }) {
  const [form, setForm]       = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError]     = useState("");

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const focus = (e) => (e.target.style.borderColor = "rgba(201,169,110,0.5)");
  const blur  = (e) => (e.target.style.borderColor = "rgba(240,236,228,0.12)");

  const handleSubmit = async () => {
    setSuccess("");
    setError("");

    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      await API.post("/contact", { ...form, propertyId });
      setSuccess("Your inquiry has been sent! We'll be in touch soon.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.contactCard}>
      <p style={s.contactLabel}>Interested in this property?</p>
      <h3 style={s.contactTitle}>Contact Seller</h3>

      {success && <div style={s.successMsg}>✓ &nbsp;{success}</div>}
      {error   && <div style={s.errorMsg}>{error}</div>}

      <div style={s.field}>
        <label style={s.fieldLabel}>Your name</label>
        <input style={s.fieldInput} placeholder="Arjun Sharma"
          value={form.name} onChange={set("name")} onFocus={focus} onBlur={blur} />
      </div>

      <div style={s.field}>
        <label style={s.fieldLabel}>Email address</label>
        <input style={s.fieldInput} type="email" placeholder="arjun@example.com"
          value={form.email} onChange={set("email")} onFocus={focus} onBlur={blur} />
      </div>

      <div style={s.field}>
        <label style={s.fieldLabel}>Message</label>
        <textarea style={s.fieldTextarea} rows={4}
          placeholder={`Hi, I'm interested in this property and would like to know more…`}
          value={form.message} onChange={set("message")} onFocus={focus} onBlur={blur} />
      </div>

      <button
        style={{ ...s.sendBtn, ...(loading ? { opacity: 0.7, cursor: "default" } : {}) }}
        onClick={handleSubmit}
        disabled={loading}
        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#dabb88"; }}
        onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#c9a96e"; }}
      >
        {loading ? "Sending…" : "Send inquiry"}
      </button>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function PropertyDetails() {
  const { id }          = useParams();
  const navigate        = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await API.get(`/properties/${id}`);
        setProperty(res.data);
      } catch (err) {
        if (err?.response?.status === 404) {
          setError("Property not found.");
        } else {
          setError("Failed to load property. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  // Scroll to top on load
  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap" />
      <div style={s.page}>

        {/* Navbar */}
        {/* <nav style={s.nav}>
          <div style={s.brand}>
            <div style={s.brandDot} />
            <span style={s.brandName}>EstateHub</span>
          </div>
          <button
            style={s.backBtn}
            onClick={() => navigate(-1)}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.4)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(240,236,228,0.12)")}
          >
            ← Back to listings
          </button>
        </nav> */}
       
<div style={{ padding: "16px 48px 0" }}>
  <button
    style={s.backBtn}
    onClick={() => navigate(-1)}
    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.4)")}
    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(240,236,228,0.12)")}
  >
    ← Back to listings
  </button>
</div>

        {/* Loading */}
        {loading && (
          <div style={s.stateWrap}>
            <div style={s.stateIcon}>⟳</div>
            <p style={s.stateText}>Loading property…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={s.stateWrap}>
            <div style={s.stateIcon}>◎</div>
            <p style={s.stateText}>{error}</p>
            <button
              style={{ ...s.backBtn, marginTop: "8px" }}
              onClick={() => navigate("/")}
            >← Back to homepage</button>
          </div>
        )}

        {/* Content */}
        {!loading && property && (
          <div style={s.body}>

            {/* Left column */}
            <div style={s.left}>
              <ImageSlider images={property.images || []} />

              <div style={s.infoCard}>
                <p style={s.eyebrow}>Property Details</p>
                <h1 style={s.propTitle}>{property.title}</h1>

                <div style={s.metaRow}>
                  <span style={s.price}>
                    ₹{Number(property.price).toLocaleString("en-IN")}
                  </span>
                  <span style={s.locBadge}>
                    ◎ &nbsp;{property.location}
                  </span>
                </div>

                <div style={s.divider} />

                <p style={s.descLabel}>Description</p>
                <p style={s.desc}>{property.description}</p>
              </div>
            </div>

            {/* Right column */}
            <div style={s.right}>
              <ContactForm propertyId={property.id} />
            </div>

          </div>
        )}

      </div>
    </>
  );
}
