// const express = require("express");
// const router = express.Router();
// const Invitation = require("../models/invitationModel");
// const { getAllInvitations, deleteInvitation } = require("../controllers/invitationController");

// // POST /api/invitations -> Save a new invitation
// router.post("/", async (req, res) => {
//   try {
//     const newInvitation = new Invitation(req.body);
//     await newInvitation.save();
//     res.status(201).json(newInvitation);
//   } catch (err) {
//     console.error("Error saving invitation:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // GET /api/invitations -> Fetch all invitations
// router.get("/", getAllInvitations);

// // DELETE /api/invitations/:id -> Delete invitation by ID
// router.delete("/:id", deleteInvitation);

// // routes/invitationRoutes.js



// module.exports = router;


const express = require("express");
const router = express.Router();
const Invitation = require("../models/invitationModel");

// ✅ Import the missing updateInvitation function here
const {
  getAllInvitations,
  deleteInvitation,
  updateInvitation, // <-- this was missing
} = require("../controllers/invitationController");

// POST /api/invitations -> Save a new invitation
router.post("/", async (req, res) => {
  try {
    const newInvitation = new Invitation(req.body);
    await newInvitation.save();
    res.status(201).json(newInvitation);
  } catch (err) {
    console.error("Error saving invitation:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/invitations -> Fetch all invitations
router.get("/", getAllInvitations);

// PUT /api/invitations/:id -> Update invitation by ID
router.put("/:id", updateInvitation); // ✅ Added this

// DELETE /api/invitations/:id -> Delete invitation by ID
router.delete("/:id", deleteInvitation);

module.exports = router;
