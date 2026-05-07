const s = {
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "0.5px solid rgba(240,236,228,0.1)",
    borderRadius: "12px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "border-color 0.25s, transform 0.2s",
  },
  imgBox: {
    width: "100%",
    height: "170px",
    background: "linear-gradient(135deg, #1a1a1a, #2a2218)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  imgFallback: {
    fontSize: "40px",
  },
  badge: {
    position: "absolute",
    top: "10px",
    left: "10px",
    background: "#c9a96e",
    color: "#0d0d0d",
    fontSize: "10px",
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    padding: "3px 8px",
    borderRadius: "4px",
  },
  body: {
    padding: "14px 16px 18px",
  },
  price: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "20px",
    color: "#f5f0e8",
    margin: "0 0 4px",
    fontWeight: 500,
  },
  location: {
    fontSize: "12px",
    color: "rgba(240,236,228,0.45)",
    margin: "0 0 12px",
  },
  meta: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  metaItem: {
    fontSize: "11px",
    color: "rgba(240,236,228,0.4)",
  },
  metaDot: {
    width: "3px",
    height: "3px",
    background: "#c9a96e",
    borderRadius: "50%",
    flexShrink: 0,
  },
  title: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#f0ece4",
    margin: "0 0 6px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};

const EMOJIS = ["🏛", "🌴", "🗼", "🏙", "⛩", "🗽", "🏡", "🌆"];

export default function PropertyCard({ property }) {
  const {
    title,
    location,
    price,
    bedrooms,
    bathrooms,
    area,
    image_url,
    type,
  } = property;

  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

  return (
    <div
      style={s.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(201,169,110,0.4)";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(240,236,228,0.1)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={s.imgBox}>
        {image_url ? (
          <img src={image_url} alt={title} style={s.img} />
        ) : (
          <span style={s.imgFallback}>{emoji}</span>
        )}
        {type && <span style={s.badge}>{type}</span>}
      </div>
      <div style={s.body}>
        {title && <p style={s.title}>{title}</p>}
        <p style={s.price}>
          {typeof price === "number"
            ? `₹${price.toLocaleString("en-IN")}`
            : price}
        </p>
        <p style={s.location}>{location}</p>
        <div style={s.meta}>
          {bedrooms != null && (
            <span style={s.metaItem}>{bedrooms} beds</span>
          )}
          {bedrooms != null && bathrooms != null && (
            <span style={s.metaDot} />
          )}
          {bathrooms != null && (
            <span style={s.metaItem}>{bathrooms} baths</span>
          )}
          {area && (
            <>
              <span style={s.metaDot} />
              <span style={s.metaItem}>{area}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
