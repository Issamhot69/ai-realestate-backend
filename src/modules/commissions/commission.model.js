const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema({
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  salePrice: { type: Number, required: true },
  commissionRate: { type: Number, default: 3 },
  commissionAmount: { type: Number },
  status: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
  paidAt: Date
}, { timestamps: true });

commissionSchema.pre('save', function(next) {
  this.commissionAmount = (this.salePrice * this.commissionRate) / 100;
  next();
});

module.exports = mongoose.model('Commission', commissionSchema);
