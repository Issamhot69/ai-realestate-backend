const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['investor', 'owner', 'broker', 'agent', 'notary', 'admin'],
    default: 'investor'
  },
  plan: { type: String, enum: ['free', 'pro', 'elite'], default: 'free' },
  phone: String,
  company: String,
  bio: String,
  avatar: String,
  verified: { type: Boolean, default: false },
  stripeCustomerId: String,
  commissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Commission' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);