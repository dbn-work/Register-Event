

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  sno: { type: Number, default: 0 },
  ideac: { type: String, default: "--" },
  name: { type: String, default: "--" },
  companyName: { type: String, default: "--" },
  email: { type: String, default: "--", unique: true, sparse: true },
  phone: { type: String, default: "--", unique: true, sparse: true },
}, { timestamps: true });

const UserModel = mongoose.models.User || mongoose.model('User', userSchema, 'users');
//module.exports = mongoose.model('User', userSchema);

module.exports = UserModel;