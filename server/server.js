require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const path    = require("path");

const authRoutes     = require("./routes/auth");
const propertyRoutes = require("./routes/properties");
const contactRoutes  = require("./routes/contact");

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth",       authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/contact",    contactRoutes);

app.get("/api/health", (_, res) => res.json({ status: "ok" }));
app.use((_, res) => res.status(404).json({ message: "Route not found." }));
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: "Internal server error." });
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
// Run in your server folder:

