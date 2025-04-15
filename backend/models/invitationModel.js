 const mongoose = require("mongoose");

 const invitationSchema = new mongoose.Schema({
  title: String,
  tagline: String,
  date: String,
  time: String,
  venue: String,
  registrationTime: String,
  website: String,
}, { timestamps: true }); // <-- add this line

module.exports = mongoose.model("Invitation", invitationSchema);


