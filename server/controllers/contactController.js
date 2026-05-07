const db = require("../config/db");

// POST /api/contact
const create = async (req, res) => {
  const { name, email, subject, message, propertyId } = req.body;

  if (!name || !email || !message)
    return res.status(400).json({ message: "Name, email, and message are required." });

  try {
    const [result] = await db.query(
      "INSERT INTO contacts (name, email, subject, message, property_id) VALUES (?, ?, ?, ?, ?)",
      [name, email, subject || null, message, propertyId || null]
    );
    res.status(201).json({ message: "Message sent successfully.", id: result.insertId });
  } catch (err) {
    console.error("Contact error:", err.message);
    res.status(500).json({ message: "Failed to send message. Please try again." });
  }
};

// GET /api/contact
const getAll = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM contacts ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("Fetch contacts error:", err.message);
    res.status(500).json({ message: "Failed to fetch messages." });
  }
};

module.exports = { create, getAll };
