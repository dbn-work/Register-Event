// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const verifyToken = require('./middleware/auth');
// const adminRoutes = require('./routes/adminRoutes');
// const invitationRoutes = require('./routes/invitationRoutes');
// const invitationController= require('./controllers/invitationController');
// const cron = require('node-cron');

// // Models
// const Registration = require('./models/Registration');
// const Invitation = require("./models/invitationModel"); // <-- This is your imported variable

// // App Init
// const app = express();
// app.use(cors());
// app.use(express.json());

// // ✅ MongoDB Connection
// mongoose.connect('mongodb://127.0.0.1:27017/registrationDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('✅ MongoDB Connected'))
// .catch((err) => console.error('❌ DB Error:', err));

// // ✅ Registration Route (User)
// app.post('/api/register', async (req, res) => {
//   try {
//     const { fullName, email, company, contact } = req.body;
//     const newEntry = new Registration({ fullName, email, company, contact });
//     await newEntry.save();
//     res.status(201).json({ message: 'Data saved successfully!' });
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// //get the data from db to diplay on admin dashboard
// app.get('/api/newusers',async (req, res) => {
//   try {
//     const newUsers = await Registration.find({});
//     res.status(200).json(newUsers);
//   } catch (error) {
//     console.error('❌ Error fetching users:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // DELETE a user
// app.delete('/api/newusers/:id',async (req, res) => {
//   try {
//     await Registration.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: 'User deleted successfully' });
//   } catch (error) {
//     console.error('❌ Error deleting user:', error);
//     res.status(500).json({ error: 'Failed to delete user' });
//   }
// });

// // UPDATE a user
// app.put('/api/newusers/:id', async (req, res) => {
//   try {
//     const updatedUser = await Registration.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     res.status(200).json(updatedUser);
//   } catch (error) {
//     console.error('❌ Error updating user:', error);
//     res.status(500).json({ error: 'Failed to update user' });
//   }
// });

// // POST route for saving invitation data
// app.post("/api/invitation", async (req, res) => {
//   try {
//     // Expecting invitation fields: title, tagline, date, time, venue, registrationTime, website
//     const invitationData = req.body;
//     // ⬇️ Changed EInvitation to Invitation to match your import!
//     const newInvitation = new Invitation(invitationData); 
//     await newInvitation.save();
//     res.status(201).json({ message: "Invitation saved successfully!" });
//   } catch (err) {
//     console.error("❌ Error saving invitation:", err);
//     res.status(500).json({ error: "Server error while saving invitation" });
//   }
// });

// // ✅ Admin Login Routes
// app.use('/api/admin',adminRoutes);

// // Admin Login Routes
// app.use('/api/invitations', invitationRoutes);

// // ✅ Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const XLSX = require("xlsx");
const path = require("path"); // ✅ FIX: Required for using path.join()

require('dotenv').config();

const verifyToken = require('./middleware/auth');
const adminRoutes = require('./routes/adminRoutes');
const invitationRoutes = require('./routes/invitationRoutes');
const invitationController = require('./controllers/invitationController');
const cron = require('node-cron');
// Models
const Registration = require('./models/Registration');
const Invitation = require("./models/invitationModel");

const mongoURI = process.env.MONGODB_URI

// App Init
const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ DB Error:', err));

// ✅ Load the Excel file and process it
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

  const cleanedResult = result.map((entry) => {
    return {
      "Customer Name": cleanValue(entry["Customer Name"]),
      "Company Name": cleanValue(entry["Company Name"]),
    };
  });

  setTimeout(() => {
    console.log("✅ Matched Result:", cleanedResult);
    res.json(cleanedResult);
  }, 5000);
});

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

// ✅ Fetch All Users for Admin Dashboard
app.get('/api/newusers', async (req, res) => {
  try {
    const newUsers = await Registration.find({});
    res.status(200).json(newUsers);
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ DELETE a user
app.delete('/api/newusers/:id', async (req, res) => {
  try {
    await Registration.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// ✅ UPDATE a user
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

// ✅ Save Invitation
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

// ✅ Admin Login Routes
app.use('/api/admin', adminRoutes);

// ✅ Invitation Routes
app.use('/api/invitations', invitationRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

