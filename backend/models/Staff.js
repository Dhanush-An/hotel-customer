const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  photo: { type: String },
  dob: { type: String },
  gender: { type: String },
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: String },
  role: { type: String, required: true },
  dept: { type: String, required: true },
  shift: { type: String },
  joinedDate: { type: String },
  basic: { type: Number, default: 0 },
  net: { type: Number, default: 0 },
  status: { type: String, default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);
