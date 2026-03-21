const mongoose = require('mongoose');

const TableSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['available', 'occupied', 'booked'], 
    default: 'available' 
  },
  location: { type: String }, // e.g., 'window', 'center', 'outdoor'
});

module.exports = mongoose.model('Table', TableSchema);
