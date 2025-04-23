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
          <div style="max-width:500px;margin:0 auto;background:#f8fafc;border-radius:12px;box-shadow:0 2px 12px #e0e7ef;padding:32px 24px;font-family:'Segoe UI',Arial,sans-serif;">
            <div style="text-align:center;">
              <h2 style="color:#6366f1;margin-bottom:8px;">${invitation.title}</h2>
              <p style="font-size:1.1rem;color:#64748b;margin-bottom:16px;"><em>${invitation.tagline}</em></p>
            </div>
            <hr style="border:none;border-top:1px solid #e0e7ef;margin:16px 0;">
            <div style="font-size:1rem;color:#334155;">
              <p><span style="font-weight:600;color:#6366f1;">Date:</span> ${invitation.date}</p>
              <p><span style="font-weight:600;color:#6366f1;">Time:</span> ${invitation.time}</p>
              <p><span style="font-weight:600;color:#6366f1;">Venue:</span> ${invitation.venue}</p>
            </div>
            <div style="margin:24px 0;text-align:center;">
              <a href="${invitation.website}" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:600;font-size:1.1rem;box-shadow:0 2px 8px #c7d2fe;">View Event</a>
            </div>
            <hr style="border:none;border-top:1px solidrgb(22, 70, 126);margin:16px 0;">
            <p style="text-align:center;color:#64748b;font-size:1rem;">Thank you for registering!<br>We look forward to seeing you at the event.</p>
          </div>
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
