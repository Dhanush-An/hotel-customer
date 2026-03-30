const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  guest: { type: String, required: true },
  phone: { type: String },
  room: { type: String, required: true },
  type: { type: String },
  source: { type: String, default: 'Direct' },
  checkin: { type: String, required: true },
  checkout: { type: String, required: true },
  nights: { type: Number, default: 1 },
  amount: { type: Number, required: true },
  status: { type: String, default: 'Confirmed' },
  payment: { type: String, default: 'Pending' },
  method: { type: String, default: 'Cash' },
  address: { type: String },
  idType: { type: String },
  idNum: { type: String },
  purpose: { type: String },
  transport: { type: String },
  vehicleReg: { type: String },
  adults: { type: Number, default: 1 },
  children: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
