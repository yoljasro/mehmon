const mongoose = require('mongoose');

const TableSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['available', 'occupied', 'booked'], 
    default: 'available' 
  },
  location: { type: String }, // General description
  zone: { type: String }, // e.g., 'Terrassa', 'Main Hall'
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
});

module.exports = mongoose.model('Table', TableSchema);
