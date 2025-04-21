const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

const login = async (req, res) => {
  const { username, password } = req.body;
  try {

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Can increase later
    );

    res.json({ token, role: admin.role });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { login };
