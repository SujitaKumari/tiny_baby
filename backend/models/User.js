const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  phone: { type: String },
  addresses: [{
    label: { type: String, enum: ['home', 'work', 'other'], default: 'home' },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
  }],
  role: { type: String, enum: ['customer', 'admin', 'superadmin'], default: 'customer' },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  isVerified: { type: Boolean, default: false },
  refreshTokens: [{ type: String }],
  country: { type: String },
  currency: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
