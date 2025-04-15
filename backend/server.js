const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const verifyToken = require('./middleware/auth');
const adminRoutes = require('./routes/adminRoutes');
const invitationRoutes = require('./routes/invitationRoutes');
const invitationController= require('./controllers/invitationController');
const cron = require('node-cron');

// Models
const Registration = require('./models/Registration');
const Invitation = require("./models/invitationModel"); // <-- This is your imported variable

// App Init
const app = express();
app.use(cors());
app.use(express.json());

//.env mongodb URI 
const mongoURI = process.env.MONGODB_URI


// ✅ MongoDB Connection
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ DB Error:', err));

// ✅ Registration Route (User)
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

//get the data from db to diplay on admin dashboard
app.get('/api/newusers',async (req, res) => {
  try {
    const newUsers = await Registration.find({});
    res.status(200).json(newUsers);
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE a user
app.delete('/api/newusers/:id',async (req, res) => {
  try {
    await Registration.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// UPDATE a user
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

// POST route for saving invitation data
app.post("/api/invitation", async (req, res) => {
  try {
    // Expecting invitation fields: title, tagline, date, time, venue, registrationTime, website
    const invitationData = req.body;
    // ⬇️ Changed EInvitation to Invitation to match your import!
    const newInvitation = new Invitation(invitationData); 
    await newInvitation.save();
    res.status(201).json({ message: "Invitation saved successfully!" });
  } catch (err) {
    console.error("❌ Error saving invitation:", err);
    res.status(500).json({ error: "Server error while saving invitation" });
  }
});

// ✅ Admin Login Routes
app.use('/api/admin',adminRoutes);

// Admin Login Routes
app.use('/api/invitations', invitationRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 5000;

if (PORT === 5000 || PORT === '5000') {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
} else {
  console.error('❌ Error: Invalid PORT. Server can only run on port 5000.');
  process.exit(1); // Exit the process with a failure code
}
