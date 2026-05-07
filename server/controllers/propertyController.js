const db   = require("../config/db");
const fs   = require("fs");
const path = require("path");

// GET /api/properties
const getProperties = async (req, res) => {
  try {
    const [properties] = await db.query("SELECT * FROM properties ORDER BY created_at DESC");
    if (properties.length === 0) return res.json([]);

    const ids = properties.map((p) => p.id);
    const [images] = await db.query(
      "SELECT * FROM property_images WHERE property_id IN (?)", [ids]
    );

    res.json(properties.map((p) => ({
      ...p,
      images: images.filter((i) => i.property_id === p.id).map((i) => i.image_url),
    })));
  } catch (err) {
    console.error("Get properties error:", err.message);
    res.status(500).json({ message: "Failed to fetch properties." });
  }
};

// GET /api/properties/:id
const getPropertyById = async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(id)) return res.status(400).json({ message: "Invalid property ID." });

  try {
    const [rows] = await db.query("SELECT * FROM properties WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Property not found." });

    const [images] = await db.query(
      "SELECT image_url FROM property_images WHERE property_id = ? ORDER BY id ASC", [id]
    );

    res.json({ ...rows[0], images: images.map((i) => i.image_url) });
  } catch (err) {
    console.error("Get property error:", err.message);
    res.status(500).json({ message: "Failed to fetch property." });
  }
};

// POST /api/properties  (admin only)
const addProperty = async (req, res) => {
  const { title, price, location, description } = req.body;
  const files = req.files;

  if (!title || !price || !location || !description)
    return res.status(400).json({ message: "All fields are required." });
  if (!files || files.length < 3)
    return res.status(400).json({ message: "Minimum 3 images are required." });
  if (files.length > 15)
    return res.status(400).json({ message: "Maximum 15 images are allowed." });

  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice) || parsedPrice <= 0)
    return res.status(400).json({ message: "Price must be a valid positive number." });

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [result] = await connection.query(
      "INSERT INTO properties (title, price, location, description) VALUES (?, ?, ?, ?)",
      [title, parsedPrice, location, description]
    );

    const propertyId = result.insertId;
    const imagePaths = files.map((f) => [propertyId, `/uploads/${f.filename}`]);
    await connection.query(
      "INSERT INTO property_images (property_id, image_url) VALUES ?", [imagePaths]
    );

    await connection.commit();
    res.status(201).json({ message: "Property added successfully.", propertyId });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error("Add property error:", err.message);
    res.status(500).json({ message: "Failed to add property." });
  } finally {
    if (connection) connection.release();
  }
};

// PUT /api/properties/:id  (admin only)
const updateProperty = async (req, res) => {
  const { id } = req.params;
  const { title, price, location, description } = req.body;

  if (!title || !price || !location || !description)
    return res.status(400).json({ message: "All fields are required." });

  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice) || parsedPrice <= 0)
    return res.status(400).json({ message: "Price must be a valid positive number." });

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [check] = await connection.query("SELECT id FROM properties WHERE id = ?", [id]);
    if (check.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Property not found." });
    }

    await connection.query(
      "UPDATE properties SET title = ?, price = ?, location = ?, description = ? WHERE id = ?",
      [title, parsedPrice, location, description, id]
    );

    // If new images uploaded, replace all existing images
    if (req.files && req.files.length > 0) {
      if (req.files.length < 3)
        return res.status(400).json({ message: "Minimum 3 images required." });

      // Delete old image files from disk
      const [oldImages] = await connection.query(
        "SELECT image_url FROM property_images WHERE property_id = ?", [id]
      );
      oldImages.forEach(({ image_url }) => {
        const filePath = path.join(__dirname, "..", image_url);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });

      await connection.query("DELETE FROM property_images WHERE property_id = ?", [id]);

      const newPaths = req.files.map((f) => [id, `/uploads/${f.filename}`]);
      await connection.query(
        "INSERT INTO property_images (property_id, image_url) VALUES ?", [newPaths]
      );
    }

    await connection.commit();
    res.json({ message: "Property updated successfully." });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error("Update property error:", err.message);
    res.status(500).json({ message: "Failed to update property." });
  } finally {
    if (connection) connection.release();
  }
};

// DELETE /api/properties/:id  (admin only)
const deleteProperty = async (req, res) => {
  const { id } = req.params;

  try {
    const [check] = await db.query("SELECT id FROM properties WHERE id = ?", [id]);
    if (check.length === 0)
      return res.status(404).json({ message: "Property not found." });

    // Delete image files from disk
    const [images] = await db.query(
      "SELECT image_url FROM property_images WHERE property_id = ?", [id]
    );
    images.forEach(({ image_url }) => {
      const filePath = path.join(__dirname, "..", image_url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    // Cascade deletes property_images too (FK ON DELETE CASCADE)
    await db.query("DELETE FROM properties WHERE id = ?", [id]);

    res.json({ message: "Property deleted successfully." });
  } catch (err) {
    console.error("Delete property error:", err.message);
    res.status(500).json({ message: "Failed to delete property." });
  }
};

module.exports = { getProperties, getPropertyById, addProperty, updateProperty, deleteProperty };
