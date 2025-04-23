const express = require("express");
const router = express.Router();
const Invitation = require("../models/invitationModel");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");

const {
  getAllInvitations,
  deleteInvitation,
  updateInvitation,
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

// POST /api/invitations/send/:invitationId -> Send invitation emails to all users
router.post('/send/:invitationId', async (req, res) => {
  try {
    const invitation = await Invitation.findById(req.params.invitationId);
    if (!invitation) return res.status(404).json({ message: 'Invitation not found' });
    const users = await User.find();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASS }
    });

    const emailPromises = users.map(user =>
      transporter.sendMail({
        from: `"Event Team" <${process.env.EMAIL}>`,
        to: user.email,
        subject: `You're Invited: ${invitation.title}`,
        html: `
          <h2>${invitation.title}</h2>
          <p><strong>Date:</strong> ${invitation.date}</p>
          <p><strong>Time:</strong> ${invitation.time}</p>
          <p><strong>Venue:</strong> ${invitation.venue}</p>
          <p><em>${invitation.tagline}</em></p>
          <p>Visit us: <a href="${invitation.website}" target="_blank">${invitation.website}</a></p>
          <br />
          <p>Thank you for registering!</p>
        `
      })
    );

    await Promise.all(emailPromises);

    res.json({ message: 'Emails sent successfully!' });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ message: 'Error sending emails' });
  }
});

// GET /api/invitations -> Fetch all invitations
router.get("/", getAllInvitations);
// PUT /api/invitations/:id -> Update invitation by ID
router.put("/:id", updateInvitation);
// DELETE /api/invitations/:id -> Delete invitation by ID
router.delete("/:id", deleteInvitation);

module.exports = router;
