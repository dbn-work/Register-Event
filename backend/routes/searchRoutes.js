const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

// Autocomplete endpoint
router.get("/autocomplete", async (req, res) => {
  const { q, type } = req.query;
  if (!q || !type) return res.status(400).json({ error: "Missing query or type" });

  const searchField = {
    fullName: "name",
    email: "email",
    companyName: "companyName",
    contactNo: "phone"
  }[type];

  if (!searchField) return res.status(400).json({ error: "Invalid type" });

  try {
    const regex = new RegExp(q, "i"); // case-insensitive
    const users = await User.find({ [searchField]: regex }).limit(10);
    res.json(users);
  } catch (err) {
    console.error("Autocomplete error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
