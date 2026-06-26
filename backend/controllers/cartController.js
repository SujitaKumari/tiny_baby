const Cart = require('../models/Cart');

// @desc    Get user or session cart
// @route   GET /api/cart
// @access  Public (Guest or Logged in)
const getCart = async (req, res, next) => {
  try {
    let cart;
    if (req.user) {
      cart = await Cart.findOne({ user: req.user._id })
        .populate('items.product', 'title slug images')
        .populate('items.variant', 'size price stock');
    } else {
      const { sessionId } = req.query;
      cart = await Cart.findOne({ sessionId })
        .populate('items.product', 'title slug images')
        .populate('items.variant', 'size price stock');
    }

    if (!cart) {
      return res.json({ success: true, data: { items: [], subtotal: 0 } });
    }

    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Public
const addItemToCart = async (req, res, next) => {
  try {
    const { productId, variantId, sku, quantity, priceAtAdd, sessionId } = req.body;

    let cart;
    if (req.user) {
      cart = await Cart.findOne({ user: req.user._id });
    } else {
      cart = await Cart.findOne({ sessionId });
    }

    // Create cart if doesn't exist
    if (!cart) {
      cart = await Cart.create({
        user: req.user ? req.user._id : null,
        sessionId: req.user ? null : sessionId,
        items: []
      });
    }

    // Check if item already in cart
    const itemIndex = cart.items.findIndex(item => item.variant.toString() === variantId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        variant: variantId,
        sku,
        quantity,
        priceAtAdd
      });
    }

    await cart.save();

    res.status(201).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Public
const removeItemFromCart = async (req, res, next) => {
  try {
    let cart;
    if (req.user) {
      cart = await Cart.findOne({ user: req.user._id });
    } else {
      const { sessionId } = req.query;
      cart = await Cart.findOne({ sessionId });
    }

    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }

    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    await cart.save();

    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addItemToCart,
  removeItemFromCart
};
