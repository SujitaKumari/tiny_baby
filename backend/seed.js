require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Collection = require('./models/Collection');
const Product = require('./models/Product');
const Variant = require('./models/Variant');

const connectDB = require('./config/db');

const importData = async () => {
  try {
    await connectDB();

    await Category.deleteMany();
    await Collection.deleteMany();
    await Product.deleteMany();
    await Variant.deleteMany();

    // 1. Categories
    const catOnesies = await Category.create({ name: 'Onesies & Sleepsuits', slug: 'onesies-sleepsuits', description: 'Cozy and soft essentials' });
    const catSwaddles = await Category.create({ name: 'Swaddles & Blankets', slug: 'swaddles-blankets', description: 'Breathable organic cotton' });

    // 2. Collections
    const colNewborn = await Collection.create({ name: 'Newborn Essentials', slug: 'newborn-essentials', isFeatured: true });

    // 3. Products (Shopify-style Sibling colors)
    const productGroupId = new mongoose.Types.ObjectId();

    // Product A: Sage Onesie
    const onesieSage = await Product.create({
      title: 'Organic Cotton Ribbed Sleepsuit - Sage',
      baseTitle: 'Organic Cotton Ribbed Sleepsuit',
      slug: 'organic-cotton-ribbed-sleepsuit-sage',
      description: 'The softest organic cotton ribbed sleepsuit for your little one.',
      features: ['100% GOTS Organic Cotton', 'Nickel-free poppers', 'Fold-over scratch mitts'],
      careInstructions: 'Machine wash warm with like colors.',
      basePrice: 1500,
      categories: [catOnesies._id],
      collections: [colNewborn._id],
      productGroupId,
      color: 'Sage',
      colorHex: '#8A9A5B',
      images: ['/images/onesie-sage-1.jpg', '/images/onesie-sage-2.jpg']
    });

    // Product B: Oat Onesie
    const onesieOat = await Product.create({
      title: 'Organic Cotton Ribbed Sleepsuit - Oat',
      baseTitle: 'Organic Cotton Ribbed Sleepsuit',
      slug: 'organic-cotton-ribbed-sleepsuit-oat',
      description: 'The softest organic cotton ribbed sleepsuit for your little one.',
      features: ['100% GOTS Organic Cotton', 'Nickel-free poppers', 'Fold-over scratch mitts'],
      careInstructions: 'Machine wash warm with like colors.',
      basePrice: 1500,
      categories: [catOnesies._id],
      collections: [colNewborn._id],
      productGroupId,
      color: 'Oat',
      colorHex: '#E5D3B3',
      images: ['/images/onesie-oat-1.jpg']
    });

    // Link Siblings
    const sageSiblings = [{ product: onesieOat._id, color: 'Oat', slug: 'organic-cotton-ribbed-sleepsuit-oat', image: '/images/onesie-oat-1.jpg' }];
    const oatSiblings = [{ product: onesieSage._id, color: 'Sage', slug: 'organic-cotton-ribbed-sleepsuit-sage', image: '/images/onesie-sage-1.jpg' }];

    onesieSage.colorSiblings = sageSiblings;
    onesieOat.colorSiblings = oatSiblings;
    
    // Create Variants (Sizes)
    const sizes = ['Newborn', '0-3m', '3-6m', '6-12m'];
    const variantsSage = [];
    const variantsOat = [];

    for (const size of sizes) {
      const vSage = await Variant.create({ product: onesieSage._id, size, sku: `SLEEP-SAGE-${size.toUpperCase().replace('-', '')}`, stock: 10 });
      const vOat = await Variant.create({ product: onesieOat._id, size, sku: `SLEEP-OAT-${size.toUpperCase().replace('-', '')}`, stock: 5 });
      variantsSage.push(vSage._id);
      variantsOat.push(vOat._id);
    }

    onesieSage.variants = variantsSage;
    onesieOat.variants = variantsOat;

    await onesieSage.save();
    await onesieOat.save();

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
