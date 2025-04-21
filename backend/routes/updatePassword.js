// routes/updatePassword.js
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
require('dotenv').config();

router.post('/', async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const storedHashedPassword = process.env.ADMIN_PASSWORD_HASH;
  try {
    const isMatch = await bcrypt.compare(oldPassword, storedHashedPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Old password is incorrect' });
    }
    // Optionally hash the new password (if saving it somewhere)
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    // For now just return success with the new hashed password
    return res.status(200).json({ 
      message: 'Password updated successfully!', 
      newHash: newHashedPassword 
    });
  } catch (err) {
    console.error('Password update error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
