
// const Invitation = require('../models/invitationModel');

// // ✅ Create a new invitation
// exports.createInvitation = async (req, res) => {
//   try {
//     const newInvitation = new Invitation(req.body);
//     await newInvitation.save();
//     res.status(201).json(newInvitation);
//   } catch (error) {
//     res.status(500).json({ error: 'Error creating invitation' });
//   }
// };

// // ✅ Update an existing invitation
// exports.updateInvitation = async (req, res) => {
//   try {
//     const updated = await Invitation.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     res.status(200).json(updated);
//   } catch (error) {
//     res.status(500).json({ error: 'Error updating invitation' });
//   }
// };

// // ✅ Get all invitations
// exports.getAllInvitations = async (req, res) => {
//   try {
//     const invitations = await Invitation.find();
//     res.status(200).json(invitations);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching invitations', error });
//   }
// };

// // ✅ Delete an invitation
// exports.deleteInvitation = async (req, res) => {
//   try {
//     await Invitation.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "Invitation deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Error deleting invitation" });
//   }
// };



// // controllers/invitationController.js
// const updateInvitation = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedInvitation = await Invitation.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });

//     if (!updatedInvitation) {
//       return res.status(404).json({ message: 'Invitation not found' });
//     }

//     res.status(200).json(updatedInvitation);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating invitation', error });
//   }
// };


const Invitation = require('../models/invitationModel');
const { getAllInvitations, deleteInvitation, updateInvitation } = require("../controllers/invitationController");

// ✅ Create a new invitation
exports.createInvitation = async (req, res) => {
  try {
    const newInvitation = new Invitation(req.body);
    await newInvitation.save();
    res.status(201).json(newInvitation);
  } catch (error) {
    res.status(500).json({ error: 'Error creating invitation' });
  }
};

// ✅ Update an existing invitation
exports.updateInvitation = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedInvitation = await Invitation.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedInvitation) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    res.status(200).json(updatedInvitation);
  } catch (error) {
    res.status(500).json({ message: 'Error updating invitation', error });
  }
};

// ✅ Get all invitations
exports.getAllInvitations = async (req, res) => {
  try {
    const invitations = await Invitation.find();
    res.status(200).json(invitations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invitations', error });
  }
};

// ✅ Delete an invitation
exports.deleteInvitation = async (req, res) => {
  try {
    await Invitation.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Invitation deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting invitation" });
  }
};



const cron = require('node-cron');


// This cron job runs every day at midnight (you can adjust the time)
cron.schedule('0 0 * * *', async () => {
  try {
    // Get the current date
    const currentDate = new Date();

    // Find invitations where the expiry date is before the current date and delete them
    const result = await Invitation.deleteMany({
      createdAt: { $lt: new Date(currentDate - 15 * 24 * 60 * 60 * 1000) }, // 15 days ago
    });

    console.log(`Deleted ${result.deletedCount} expired invitations.`);
  } catch (error) {
    console.error('Error deleting expired invitations:', error);
  }
});
