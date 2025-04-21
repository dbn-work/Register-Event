
// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const User = require('../models/userModel');

// Multer config
const upload = multer({ dest: 'uploads/' });

// 🟢 Get All Users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ _id: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 🟢 Update User by ID

router.put('/:id', async (req, res) => {
  try {
    // Make sure the ID exists in the database
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(updatedUser);  // Return the updated user
  } catch (err) {
    console.error("Error updating user:", err);  // Log error on the server
    res.status(500).json({ error: 'Update failed', message: err.message });
  }
});







// ✅ Route to delete ALL users (define this BEFORE dynamic routes)
router.delete('/deleteAll', async (req, res) => {
  try {
    const result = await User.deleteMany({});
    console.log("Deleted:", result);
    res.status(200).json({ message: 'All users deleted successfully' });
  } catch (error) {
    console.error('Error deleting all users:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to delete users', error: error.message });
  }
});

// ✅ Route to delete ONE user by ID
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed' });
  }
});






// 🟢 Import from Excel
router.post('/import', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    // Format the data to match your MongoDB schema
    const formattedData = data.map((item, index) => ({
      sno: item["Sr.No"] || index + 1,
      ideac: item["IDEAC"] || "--",
      name: item["Name"] || "--",
      companyName: item["Company"] || "--",
      phone: item["Phone"] || "--",
      email: item["Email"] || "--",
    }));

    await User.insertMany(formattedData);
    fs.unlinkSync(filePath); // Clean up uploaded file

    res.json({ message: "Excel imported successfully", count: formattedData.length });
  } catch (err) {
    console.error("❌ Import error:", err);
    res.status(500).json({ error: 'Import failed' });
  }
});


// 🟢 Export to Excel
router.get('/export', async (req, res) => {
  try {
    const users = await User.find();
    const exportData = users.map(u => ({
      "Sr.No": u.sno || "",
      "IDEAC": u.ideac || "",
      "Name": u.name || "",
      "Company": u.companyName || "",
      "Phone": u.phone || "",
      "Email": u.email || "",
    }));

    const worksheet = xlsx.utils.json_to_sheet(exportData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Users");

    const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(buffer);
  } catch (err) {
    console.error("❌ Export error:", err);
    res.status(500).json({ error: 'Export failed' });
  }
});

module.exports = router;


