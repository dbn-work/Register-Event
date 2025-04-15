
const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String, required: true },
  contact: { type: String, required: true },
});

module.exports = mongoose.model('Registration', RegistrationSchema);
