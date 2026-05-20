const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  description: String,
  price: Number,
  surface: Number,
  rooms: Number,
  bathrooms: Number,
  furnished: Boolean,
  category: {
    type: String,
    enum: ['apartment', 'villa', 'terrain', 'commercial', 'office', 'warehouse', 'hotel', 'studio', 'duplex'],
    default: 'apartment'
  },
  transactionType: {
    type: String,
    enum: ['sale', 'rent', 'investment', 'colocation'],
    default: 'sale'
  },
  location: {
    city: String,
    country: String,
    address: String,
    coordinates: { lat: Number, lng: Number }
  },
  roiScore: Number,
  riskScore: Number,
  photos: [String],
  videoUrl: String,
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['active', 'sold', 'rented', 'pending'], default: 'active' },
  seo: {
    metaTitle: String,
    metaDescription: String,
    openGraph: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);