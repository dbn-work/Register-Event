const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // adjust path if needed
const Registration = require('../models/Registration'); // adjust path if needed

router.get('/counts', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const registrationCount = await Registration.countDocuments();

    res.json({
      userCount,
      registrationCount,
      total: userCount + registrationCount,
    });
  } catch (error) {
    console.error('Error fetching dashboard counts:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
