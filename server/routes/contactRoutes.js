const express = require("express");
const router = express.Router();

const {
  addContact,
  getContacts
} = require("../controllers/contactController");

// GET all messages
router.get("/", getContacts);

// POST new message
router.post("/", addContact);

module.exports = router;