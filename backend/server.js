// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
dotenv.config();

// App Init
const app = express();
app.use(cors());
app.use(express.json());

// Models
const Registration = require('./models/Registration');
const Invitation = require('./models/invitationModel');
const Admin = require('./models/Admin');

// Routes & Controllers
const invitationRoutes = require('./routes/invitationRoutes');
const adminRoutes = require('./routes/adminRoutes'); // ✅ New
const verifyAdminToken = require('./middleware/authMiddleware'); // ✅ New

// MongoDB URI from .env
const mongoURI = process.env.MONGODB_URI;

// ✅ MongoDB Connection
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ DB Error:', err));

// ✅ Registration Routes
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, company, contact } = req.body;
    const newEntry = new Registration({ fullName, email, company, contact });
    await newEntry.save();
    res.status(201).json({ message: 'Data saved successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/newusers', async (req, res) => {
  try {
    const newUsers = await Registration.find({});
    res.status(200).json(newUsers);
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/newusers/:id', async (req, res) => {
  try {
    await Registration.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

app.put('/api/newusers/:id', async (req, res) => {
  try {
    const updatedUser = await Registration.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('❌ Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// ✅ Invitation Routes
app.post("/api/invitation", async (req, res) => {
  try {
    const invitationData = req.body;
    const newInvitation = new Invitation(invitationData);
    await newInvitation.save();
    res.status(201).json({ message: "Invitation saved successfully!" });
  } catch (err) {
    console.error("❌ Error saving invitation:", err);
    res.status(500).json({ error: "Server error while saving invitation" });
  }
});

app.use('/api/invitations', invitationRoutes);

// ✅ Admin Routes & Middleware
app.use('/api/admin', adminRoutes);

app.get('/api/admin/protected', verifyAdminToken, (req, res) => {
  res.json({ msg: "You are authorized as Admin" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
