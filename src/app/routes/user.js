const express = require('express');
const router = express.Router();

// Example route for seller logic
router.get('/seller', (req, res) => {
  // Add seller-specific logic here
  res.status(200).json({ message: 'Seller route' });
});

// Example route for buyer logic
router.get('/buyer', (req, res) => {
  // Add buyer-specific logic here
  res.status(200).json({ message: 'Buyer route' });
});

module.exports = router;

