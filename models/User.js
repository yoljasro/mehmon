const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  cafeName: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' }, // For business owners/managers
  imageUrl: { type: String },
  institutionType: { type: String },
  address: { type: String },
  openingTime: { type: String },
  closingTime: { type: String },
  zones: [{ type: String }], // e.g., ['Terrassa', 'Main Hall', 'VIP']
  isSetupCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);
