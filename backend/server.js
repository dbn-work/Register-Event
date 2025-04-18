const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const XLSX = require("xlsx");
const path = require("path");
const cron = require('node-cron');

dotenv.config();

// Middleware & Routes
const verifyAdminToken = require('./middleware/authMiddleware');
const adminRoutes = require('./routes/adminRoutes');
const invitationRoutes = require('./routes/invitationRoutes');

// Models
const Registration = require('./models/Registration');
const Invitation = require('./models/invitationModel');

// App Init
const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ DB Error:', err));

// ✅ Load Excel File
const workbook = XLSX.readFile(path.join(__dirname, "Registration Data Chennai.xlsx"));
const sheetName = workbook.SheetNames[0];
const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

// ✅ Clean keys (trim spaces)
const cleanObjectKeys = (obj) => {
  const cleaned = {};
  Object.keys(obj).forEach((key) => {
    cleaned[key.trim()] = obj[key];
  });
  return cleaned;
};

const data = rawData.map(cleanObjectKeys);
console.log("✅ Excel loaded. Sample entries:", data.slice(0, 5));

// ✅ Search API
app.post("/api/search", (req, res) => {
  const { keyword } = req.body;
  const searchTerm = keyword.trim().toLowerCase();
  console.log("🔍 Searching for:", searchTerm);
  const cleanValue = (value) => (value && value !== "—" ? value : "--");

  const result = data.filter((entry) => {
    return (
      (entry["Customer Name"] && entry["Customer Name"].toLowerCase().includes(searchTerm)) ||
      (entry["Company Name"] && entry["Company Name"].toLowerCase().includes(searchTerm))
    );
  });

  const cleanedResult = result.map((entry) => ({
    "Customer Name": cleanValue(entry["Customer Name"]),
    "Company Name": cleanValue(entry["Company Name"]),
  }));

  setTimeout(() => {
    console.log("✅ Matched Result:", cleanedResult);
    res.json(cleanedResult);
  }, 5000);
});

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

// ✅ Admin Routes
app.use('/api/admin', adminRoutes);

// ✅ Protected Admin Test Route
app.get('/api/admin/protected', verifyAdminToken, (req, res) => {
  res.json({ msg: "You are authorized as Admin" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
