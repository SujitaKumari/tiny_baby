const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  sessionId: { type: String }, // For guest checkout
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    variant: { type: mongoose.Schema.Types.ObjectId, ref: 'Variant' },
    sku: { type: String },
    title: { type: String },
    color: { type: String },
    size: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    image: { type: String }
  }],
  shippingAddress: {
    name: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String
  },
  billingAddress: {
    name: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String
  },
  subtotal: { type: Number, required: true },
  shippingCost: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  orderNote: { type: String },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  paymentMethod: { type: String, default: 'razorpay' },
  paymentIntentId: { type: String }, // Razorpay order_id or payment_id
  fulfillmentStatus: { type: String, enum: ['unfulfilled', 'in-production', 'shipped', 'delivered', 'cancelled'], default: 'unfulfilled' },
  trackingNumber: { type: String },
  carrier: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
