const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  heroImage: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  isFeatured: { type: Boolean, default: false },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

module.exports = mongoose.model('Collection', collectionSchema);
