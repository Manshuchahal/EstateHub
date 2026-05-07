import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const BASE = "http://localhost:5000";

const s = {
  page: { fontFamily: "'DM Sans', sans-serif", background: "#0d0d0d", minHeight: "100vh", color: "#f0ece4" },
  hero: { padding: "72px 48px 40px", borderBottom: "0.5px solid rgba(240,236,228,0.07)" },
  eyebrow: { fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a96e", fontWeight: 500, marginBottom: "12px" },
  title: { fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 500, lineHeight: 1.1, color: "#f5f0e8", margin: "0 0 12px" },
  sub: { fontSize: "14px", color: "rgba(240,236,228,0.4)", fontWeight: 300, margin: "0 0 32px" },
  searchInput: { background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(201,169,110,0.3)", borderRadius: "8px", padding: "13px 20px", fontSize: "14px", color: "#f0ece4", fontFamily: "'DM Sans', sans-serif", outline: "none", width: "360px" },
  statsRow: { padding: "20px 48px", display: "flex", gap: "40px", borderBottom: "0.5px solid rgba(240,236,228,0.07)" },
  statNum: { fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", color: "#f5f0e8", display: "block" },
  statLabel: { fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,236,228,0.35)" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "28px 48px 0" },
  sectionLabel: { fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,236,228,0.35)" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px", padding: "24px 48px 56px" },
  card: { background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(240,236,228,0.08)", borderRadius: "14px", overflow: "hidden", cursor: "pointer", transition: "border-color 0.22s, transform 0.22s, box-shadow 0.22s" },
  galleryWrap: { position: "relative", height: "220px", overflow: "hidden" },
  galleryImg: { width: "100%", height: "220px", objectFit: "cover", display: "block" },
  noImg: { width: "100%", height: "220px", background: "linear-gradient(135deg, #1a1a1a, #2a2218)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" },
  imgCount: { position: "absolute", top: "10px", right: "10px", background: "rgba(0,0,0,0.6)", borderRadius: "4px", padding: "3px 8px", fontSize: "11px", color: "#f0ece4" },
  galleryDots: { position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "5px" },
  dot: (active) => ({ width: active ? "16px" : "6px", height: "6px", borderRadius: "3px", background: active ? "#c9a96e" : "rgba(255,255,255,0.35)", transition: "all 0.2s" }),
  cardBody: { padding: "16px 20px 20px" },
  cardType: { display: "inline-block", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#c9a96e", background: "rgba(201,169,110,0.1)", border: "0.5px solid rgba(201,169,110,0.25)", borderRadius: "4px", padding: "3px 8px", marginBottom: "10px" },
  cardTitle: { fontSize: "16px", fontWeight: 500, color: "#f5f0e8", margin: "0 0 6px" },
  cardLoc: { fontSize: "12px", color: "rgba(240,236,228,0.4)", margin: "0 0 10px" },
  cardPrice: { fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", color: "#f5f0e8", margin: "0 0 10px" },
  cardDesc: { fontSize: "12px", color: "rgba(240,236,228,0.4)", lineHeight: 1.65, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  viewBtn: { display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "12px", fontSize: "12px", color: "#c9a96e", letterSpacing: "0.06em" },
  stateBox: { textAlign: "center", padding: "80px 0", color: "rgba(240,236,228,0.3)" },
  stateIcon: { fontSize: "32px", marginBottom: "12px" },
  stateText: { fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", color: "rgba(240,236,228,0.35)" },
};

function PropertyCard({ property, onClick }) {
  const [imgIndex, setImgIndex] = useState(0);
  const images = property.images || [];

  return (
    <div
      style={s.card} onClick={onClick}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(201,169,110,0.35)"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.4)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(240,236,228,0.08)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={s.galleryWrap}>
        {images.length > 0 ? (
          <img src={`${BASE}${images[imgIndex]}`} alt={property.title} style={s.galleryImg} />
        ) : (
          <div style={s.noImg}>🏠</div>
        )}
        {images.length > 1 && (
          <>
            <span style={s.imgCount}>{images.length} photos</span>
            <div style={s.galleryDots}>
              {images.slice(0, 5).map((_, i) => (
                <div key={i} style={s.dot(i === imgIndex)}
                  onClick={(e) => { e.stopPropagation(); setImgIndex(i); }} />
              ))}
            </div>
          </>
        )}
      </div>
      <div style={s.cardBody}>
        <span style={s.cardType}>Property</span>
        <p style={s.cardTitle}>{property.title}</p>
        <p style={s.cardLoc}>◎ &nbsp;{property.location}</p>
        <p style={s.cardPrice}>₹{Number(property.price).toLocaleString("en-IN")}</p>
        <p style={s.cardDesc}>{property.description}</p>
        <span style={s.viewBtn}>View details →</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [filter, setFilter]         = useState("");
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/properties");
        setProperties(res.data);
      } catch {
        setError("Failed to load properties. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = properties.filter(
    (p) =>
      (p.title || "").toLowerCase().includes(filter.toLowerCase()) ||
      (p.location || "").toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <p style={s.eyebrow}>Premium Listings</p>
        <h1 style={s.title}>Find Your Perfect Space</h1>
        <p style={s.sub}>Curated properties across the finest addresses</p>
        <input
          style={s.searchInput} placeholder="Search by title or location…"
          value={filter} onChange={(e) => setFilter(e.target.value)}
          onFocus={(e) => (e.target.style.borderColor = "rgba(201,169,110,0.7)")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(201,169,110,0.3)")}
        />
      </div>

      <div style={s.statsRow}>
        {[
          { num: properties.length || "—", label: "Listings" },
          { num: "142", label: "Cities" },
          { num: "98%", label: "Satisfaction" },
        ].map(({ num, label }) => (
          <div key={label}>
            <span style={s.statNum}>{num}</span>
            <span style={s.statLabel}>{label}</span>
          </div>
        ))}
      </div>

      <div style={s.sectionHeader}>
        <span style={s.sectionLabel}>
          {loading ? "Loading…" : filter
            ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`
            : "All properties"}
        </span>
      </div>

      {loading && <div style={s.stateBox}><p style={s.stateText}>Loading properties…</p></div>}
      {!loading && error && <div style={s.stateBox}><p style={{ color: "#f59595", fontSize: "13px" }}>{error}</p></div>}
      {!loading && !error && filtered.length === 0 && (
        <div style={s.stateBox}>
          <div style={s.stateIcon}>◎</div>
          <p style={s.stateText}>{filter ? `No results for "${filter}"` : "No properties listed yet"}</p>
        </div>
      )}
      {!loading && filtered.length > 0 && (
        <div style={s.grid}>
          {filtered.map((p) => (
            <PropertyCard key={p.id} property={p} onClick={() => navigate(`/property/${p.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}
