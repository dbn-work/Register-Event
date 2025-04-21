const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const User = require('../models/userModel'); // Assuming User model is correct

// Controller to get users from DB
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Controller to import users from Excel file
exports.importUsers = async (req, res) => {
  try {
    const filePath = req.file.path;  // Get file path
    const workbook = XLSX.readFile(filePath);  // Read the Excel file
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const usersData = XLSX.utils.sheet_to_json(sheet);  // Parse the data

    // Optional: Delete existing users before importing new ones
    await User.deleteMany();
    await User.insertMany(usersData);  // Insert data into the database

    fs.unlinkSync(filePath);  // Clean up temp file
    res.status(200).json({ message: 'Users imported successfully' });
  } catch (err) {
    console.error("Import Error:", err);
    res.status(500).json({ message: 'Error importing users', error: err.message });
  }
};

// Controller to export users to Excel
exports.exportUsers = async (req, res) => {
  try {
    const users = await User.find();
    const ws = XLSX.utils.json_to_sheet(users.map(({ _id, __v, ...rest }) => rest)); // Exclude unnecessary fields (_id, __v)
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');

    // Dynamically generate the export path in a safe folder (e.g., "exports")
    const exportDir = path.join(__dirname, '../exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir); // Create the folder if it doesn't exist
    }

    const filePath = path.join(exportDir, `UsersExport_${Date.now()}.xlsx`);
    XLSX.writeFile(wb, filePath);

    // Send the file to the client and remove it after download
    res.download(filePath, 'UsersExport.xlsx', (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).send('Error exporting users');
      }

      // Clean up after download
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting temporary file:', unlinkErr);
        }
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error exporting users' });
  }
};

// Controller to delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// Controller to edit a user
exports.editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error editing user' });
  }
};
