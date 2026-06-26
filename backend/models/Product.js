const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  baseTitle: { type: String, required: true }, // For grouping products logically
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  features: [{ type: String }],
  careInstructions: { type: String },
  brand: { type: String, default: 'Baby Auruas' },
  basePrice: { type: Number, required: true },
  compareAtPrice: { type: Number },
  productType: { type: String, enum: ['made-to-order', 'ready-to-ship'], default: 'ready-to-ship' },
  isLimitedEdition: { type: Boolean, default: false },
  
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  collections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }],
  tags: [{ type: String }],
  images: [{ type: String }],
  
  // Shopify Style Color Grouping
  productGroupId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Shared by all color siblings
  color: { type: String },
  colorHex: { type: String },
  colorSiblings: [{ // Cached siblings for fast fetching on PDP
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    color: { type: String },
    slug: { type: String },
    image: { type: String }
  }],
  
  variants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Variant' }],
  sizeChart: [{ 
    size: String, 
    length: String, 
    chest: String, 
    ageRange: String 
  }],
  relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
  ratingAvg: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  metaTitle: { type: String },
  metaDescription: { type: String }
}, { timestamps: true });

// Text indices for search functionality
productSchema.index({ title: 'text', baseTitle: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
