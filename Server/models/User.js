const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, lowercase: true, unique: true, sparse: true },
  address: String,
  phoneNumber: { type: String, required: true, unique: true },
  otpCode: String,
  otpExpiresAt: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
