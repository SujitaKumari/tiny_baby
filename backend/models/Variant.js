const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  size: { type: String, required: true }, // e.g., "0-3m", "3-6m"
  sku: { type: String, required: true, unique: true },
  price: { type: Number }, // If size overrides base price
  stock: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

// Middleware to automatically update isAvailable based on stock
variantSchema.pre('save', function(next) {
  this.isAvailable = this.stock > 0;
  next();
});

module.exports = mongoose.model('Variant', variantSchema);
