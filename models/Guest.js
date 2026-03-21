const mongoose = require('mongoose');

const GuestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String },
  visitCount: { type: Number, default: 1 },
  lastVisit: { type: Date, default: Date.now },
  notes: { type: String },
  isVIP: { type: Boolean, default: false },
});

module.exports = mongoose.model('Guest', GuestSchema);
