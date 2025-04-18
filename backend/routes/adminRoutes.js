const express = require("express");
const router = express.Router();
const { login } = require("../controllers/adminController");
const verifyAdminToken = require("../middleware/authMiddleware");

router.post("/login", login);

// Example protected route
router.get("/protected", verifyAdminToken, (req, res) => {
  res.json({ msg: "You are authorized", user: req.user });
});

module.exports = router;
