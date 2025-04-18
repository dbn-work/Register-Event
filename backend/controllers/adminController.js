const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const admin = {
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD_HASH, // Hashed version
  role: "admin", // Add role here
};
const login = async (req, res) => {
  const { username, password } = req.body;
  if (username !== admin.username) {
    return res.status(401).json({ msg: "Invalid credentials" });
  }
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });
  // Include role in the JWT payload
  const token = jwt.sign(
    { username, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: "20s" } // Token expires in 10 seconds
  );

  // Optionally, return the role in the response as well
  res.json({ token, role: admin.role });
};

module.exports = { login };
