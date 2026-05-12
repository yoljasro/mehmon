const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['booking_created', 'booking_updated', 'booking_cancelled', 'check_in', 'other'],
    default: 'other',
  },
  action: { type: String, required: true },
  details: { type: String },
  performedBy: { type: String }, // Staff name or 'System'
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
