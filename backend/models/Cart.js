const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Null for guest carts
  sessionId: { type: String }, // For guest checkout
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variant: { type: mongoose.Schema.Types.ObjectId, ref: 'Variant', required: true },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtAdd: { type: Number, required: true }
  }],
  orderNote: { type: String },
  currency: { type: String, default: 'INR' },
  country: { type: String, default: 'IN' }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
