import { Link, useLocation, useNavigate } from "react-router-dom";

const s = {
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 48px", height: "64px",
    background: "rgba(13,13,13,0.92)", backdropFilter: "blur(12px)",
    borderBottom: "0.5px solid rgba(201,169,110,0.15)",
    position: "sticky", top: 0, zIndex: 100,
    fontFamily: "'DM Sans', sans-serif",
  },
  brand: {
    display: "flex", alignItems: "center", gap: "10px", textDecoration: "none",
  },
  brandDot: { width: "8px", height: "8px", borderRadius: "50%", background: "#c9a96e" },
  brandName: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "18px", fontWeight: 500, color: "#f5f0e8",
  },
  links: { display: "flex", alignItems: "center", gap: "32px" },
  right: { display: "flex", alignItems: "center", gap: "12px" },
  userGreet: {
    fontSize: "12px", color: "rgba(240,236,228,0.45)",
    fontFamily: "'DM Sans', sans-serif",
  },
  adminLink: {
    fontSize: "12px", color: "#c9a96e", textDecoration: "none",
    fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em",
    background: "rgba(201,169,110,0.1)", border: "0.5px solid rgba(201,169,110,0.3)",
    borderRadius: "6px", padding: "6px 12px",
  },
  loginBtn: {
    fontSize: "12px", color: "rgba(240,236,228,0.5)",
    textDecoration: "none", fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.05em",
  },
  registerBtn: {
    fontSize: "12px", color: "#0d0d0d", background: "#c9a96e",
    textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase",
    fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
    padding: "8px 16px", borderRadius: "6px",
  },
  logoutBtn: {
    fontSize: "12px", color: "rgba(240,236,228,0.4)",
    background: "none", border: "0.5px solid rgba(240,236,228,0.15)",
    borderRadius: "6px", padding: "7px 14px", cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em",
  },
};

function NavLink({ to, children }) {
  const location = useLocation();
  const active   = location.pathname === to;
  return (
    <Link to={to} style={{
      fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase",
      textDecoration: "none", fontFamily: "'DM Sans', sans-serif",
      color: active ? "#c9a96e" : "rgba(240,236,228,0.45)",
      borderBottom: active ? "0.5px solid #c9a96e" : "0.5px solid transparent",
      paddingBottom: "2px", transition: "color 0.2s",
    }}>
      {children}
    </Link>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const token    = localStorage.getItem("token");
  const user     = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav style={s.nav}>
      <Link to="/" style={s.brand}>
        <div style={s.brandDot} />
        <span style={s.brandName}>EstateHub</span>
      </Link>

      <div style={s.links}>
        <NavLink to="/">Properties</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </div>

      <div style={s.right}>
        {token && user ? (
          <>
            <span style={s.userGreet}>Hi, {user.name?.split(" ")[0]}</span>
            {user.role === "admin" && (
              <Link to="/admin" style={s.adminLink}>Dashboard</Link>
            )}
            <button style={s.logoutBtn} onClick={handleLogout}>Sign out</button>
          </>
        ) : (
          <>
            <Link to="/login"    style={s.loginBtn}>Sign in</Link>
            <Link to="/register" style={s.registerBtn}>Get started</Link>
          </>
        )}
      </div>
    </nav>
  );
}
