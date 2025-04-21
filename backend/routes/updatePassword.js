// routes/updatePassword.js
const express = require('express');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const router = express.Router();

router.post('/', async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    // Find the admin (adjust query as needed)
    const admin = await Admin.findOne({ username: 'admin@example.com' }); // or use req.user if using auth
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

    // Hash new password and update
    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
