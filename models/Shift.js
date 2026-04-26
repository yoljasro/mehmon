const mongoose = require('mongoose');

const ShiftSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  staffName: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  date: { type: String, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Shift', ShiftSchema);
