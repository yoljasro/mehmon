const mongoose = require('mongoose');

const GuestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String },
  visitCount: { type: Number, default: 1 },
  lastVisit: { type: Date, default: Date.now },
  avatarUrl: { type: String, default: null },
  visits: [
    {
      date: { type: Date, default: Date.now },
      tableNumber: { type: String },
      numberOfGuests: { type: Number },
    }
  ],
  notes: { type: String },
  isVIP: { type: Boolean, default: false },
});

module.exports = mongoose.model('Guest', GuestSchema);
