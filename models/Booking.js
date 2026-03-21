const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  guestName: { type: String, required: true },
  phone: { type: String, required: true },
  tableId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Table', 
    required: true 
  },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true }, // e.g., '17:00'
  numberOfGuests: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'completed'], 
    default: 'confirmed' 
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', BookingSchema);
