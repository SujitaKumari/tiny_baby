const express = require('express');
const router = express.Router();
const { getCart, addItemToCart, removeItemFromCart } = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

// Note: Using a custom middleware could conditionally apply protect if a user token is provided, 
// allowing both guest and logged-in users. For simplicity, we assume the controller handles the difference
// by checking `req.user` if we make the route public, but if we pass a token, we should attach it.

// To allow optional auth, we use a custom middleware
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.get('/', optionalAuth, getCart);
router.post('/items', optionalAuth, addItemToCart);
router.delete('/items/:itemId', optionalAuth, removeItemFromCart);

module.exports = router;
