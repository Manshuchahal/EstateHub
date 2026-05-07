const s = {
  page: {
    fontFamily: "'DM Sans', sans-serif",
    background: "#0d0d0d",
    minHeight: "100vh",
    color: "#f0ece4",
  },
  hero: {
    padding: "72px 56px 64px",
    borderBottom: "0.5px solid rgba(201,169,110,0.15)",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "48px",
    alignItems: "end",
  },
  eyebrow: {
    fontSize: "10px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#c9a96e",
    fontWeight: 500,
    margin: "0 0 16px",
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "clamp(40px, 5vw, 60px)",
    fontWeight: 500,
    lineHeight: 1.05,
    color: "#f5f0e8",
    margin: 0,
  },
  heroRight: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    gap: "20px",
  },
  tagline: {
    fontSize: "15px",
    color: "rgba(240,236,228,0.55)",
    fontWeight: 300,
    lineHeight: 1.75,
    margin: 0,
  },
  cta: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    background: "rgba(201,169,110,0.1)",
    border: "0.5px solid rgba(201,169,110,0.35)",
    borderRadius: "8px",
    padding: "12px 20px",
    color: "#c9a96e",
    fontSize: "12px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
    width: "fit-content",
    textDecoration: "none",
  },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    borderBottom: "0.5px solid rgba(201,169,110,0.1)",
  },
  stat: {
    padding: "32px 40px",
    borderRight: "0.5px solid rgba(201,169,110,0.1)",
  },
  statNum: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "38px",
    fontWeight: 500,
    color: "#f5f0e8",
    lineHeight: 1,
    margin: "0 0 6px",
  },
  statLabel: {
    fontSize: "11px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "rgba(240,236,228,0.3)",
    margin: 0,
  },
  mission: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    borderBottom: "0.5px solid rgba(201,169,110,0.1)",
  },
  missionLeft: {
    padding: "56px",
    borderRight: "0.5px solid rgba(201,169,110,0.1)",
  },
  sectionLabel: {
    fontSize: "10px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#c9a96e",
    fontWeight: 500,
    margin: "0 0 20px",
  },
  missionText: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "22px",
    fontWeight: 400,
    lineHeight: 1.6,
    color: "rgba(240,236,228,0.85)",
    margin: 0,
    fontStyle: "italic",
  },
  missionRight: {
    padding: "56px",
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },
  feature: { display: "flex", gap: "16px", alignItems: "flex-start" },
  featureDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#c9a96e",
    marginTop: "6px",
    flexShrink: 0,
  },
  featureTitle: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#f0ece4",
    margin: "0 0 4px",
  },
  featureBody: {
    fontSize: "13px",
    color: "rgba(240,236,228,0.4)",
    fontWeight: 300,
    lineHeight: 1.65,
    margin: 0,
  },
  team: {
    padding: "56px",
    borderBottom: "0.5px solid rgba(201,169,110,0.1)",
  },
  teamGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    marginTop: "28px",
  },
  teamCard: {
    background: "rgba(255,255,255,0.03)",
    border: "0.5px solid rgba(240,236,228,0.08)",
    borderRadius: "12px",
    padding: "24px 20px",
  },
  avatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "rgba(201,169,110,0.12)",
    border: "0.5px solid rgba(201,169,110,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "16px",
    color: "#c9a96e",
    marginBottom: "14px",
  },
  teamName: { fontSize: "14px", fontWeight: 500, color: "#f0ece4", margin: "0 0 3px" },
  teamRole: {
    fontSize: "11px",
    color: "rgba(240,236,228,0.35)",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    margin: "0 0 12px",
  },
  teamBio: {
    fontSize: "12px",
    color: "rgba(240,236,228,0.4)",
    lineHeight: 1.65,
    margin: 0,
    fontWeight: 300,
  },
  tech: { padding: "56px" },
  techGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
    gap: "12px",
    marginTop: "28px",
  },
  techPill: {
    background: "rgba(255,255,255,0.03)",
    border: "0.5px solid rgba(240,236,228,0.08)",
    borderRadius: "8px",
    padding: "14px 16px",
    textAlign: "center",
  },
  techName: { fontSize: "13px", color: "#f0ece4", margin: "0 0 3px", fontWeight: 400 },
  techType: {
    fontSize: "10px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "rgba(240,236,228,0.25)",
    margin: 0,
  },
};

const STATS = [
  { num: "2,400+", label: "Properties listed" },
  { num: "142", label: "Cities covered" },
  { num: "98%", label: "Client satisfaction" },
  { num: "12k", label: "Active users" },
];

const FEATURES = [
  { title: "Smart property discovery", body: "Browse curated listings with rich media, detailed specs, and location insights — all in one place." },
  { title: "Secure authentication", body: "JWT-based auth keeps your account and listings protected from end to end." },
  { title: "Seamless image uploads", body: "Cloudinary-powered uploads let sellers showcase properties with high-quality photos instantly." },
  { title: "Direct seller connect", body: "Buyers and sellers communicate directly — no middlemen, no delays." },
];

const TEAM = [
  { initials: "MC", name: "Manshu Chahal", role: "Founder & Lead Dev", bio: "Full-stack architect behind EstateHub. Passionate about clean code and great user experiences." },
  { initials: "PS", name: "Priya Sharma", role: "UI / UX Designer", bio: "Crafts every pixel with intention. Believes good design is invisible — until it isn't." },
  { initials: "RK", name: "Rahul Kumar", role: "Backend Engineer", bio: "Node.js specialist keeping the API fast, secure, and scalable as the platform grows." },
];

const TECH = [
  { name: "React", type: "Frontend" },
  { name: "Node.js", type: "Backend" },
  { name: "Express", type: "API" },
  { name: "MySQL", type: "Database" },
  { name: "JWT", type: "Auth" },
  { name: "Axios", type: "HTTP" },
];

export default function About() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap"
      />
      <div style={s.page}>

        {/* Hero */}
        <div style={s.hero}>
          <div>
            <p style={s.eyebrow}>Est. 2024</p>
            <h1 style={s.title}>
              Real estate,{" "}
              <em style={{ fontStyle: "italic", color: "#c9a96e" }}>reimagined.</em>
            </h1>
          </div>
          <div style={s.heroRight}>
            <p style={s.tagline}>
              EstateHub is a modern platform that simplifies how people buy,
              sell, and explore properties — built for the way people actually
              live and move today.
            </p>
            <a href="/" style={s.cta}>
              <span>Explore listings</span>
              <span>→</span>
            </a>
          </div>
        </div>

        {/* Stats */}
        <div style={s.stats}>
          {STATS.map(({ num, label }, i) => (
            <div
              key={label}
              style={{
                ...s.stat,
                ...(i === STATS.length - 1 ? { borderRight: "none" } : {}),
              }}
            >
              <p style={s.statNum}>{num}</p>
              <p style={s.statLabel}>{label}</p>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div style={s.mission}>
          <div style={s.missionLeft}>
            <p style={s.sectionLabel}>Our mission</p>
            <p style={s.missionText}>
              "We believe finding a home should feel as extraordinary as the
              home itself — transparent, effortless, and deeply personal."
            </p>
          </div>
          <div style={s.missionRight}>
            <p style={s.sectionLabel}>What we offer</p>
            {FEATURES.map(({ title, body }) => (
              <div key={title} style={s.feature}>
                <div style={s.featureDot} />
                <div>
                  <p style={s.featureTitle}>{title}</p>
                  <p style={s.featureBody}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div style={s.team}>
          <p style={s.sectionLabel}>The team</p>
          <div style={s.teamGrid}>
            {TEAM.map(({ initials, name, role, bio }) => (
              <div key={name} style={s.teamCard}>
                <div style={s.avatar}>{initials}</div>
                <p style={s.teamName}>{name}</p>
                <p style={s.teamRole}>{role}</p>
                <p style={s.teamBio}>{bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div style={s.tech}>
          <p style={s.sectionLabel}>Built with</p>
          <div style={s.techGrid}>
            {TECH.map(({ name, type }) => (
              <div key={name} style={s.techPill}>
                <p style={s.techName}>{name}</p>
                <p style={s.techType}>{type}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
