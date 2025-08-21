const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getPaymentDetails } = require('../controller/paymentController');

// Create a new Razorpay order
router.post('/create-order', createOrder);

// Verify payment signature
router.post('/verify-payment', verifyPayment);

// Get payment details
router.get('/payment/:paymentId', getPaymentDetails);

module.exports = router;
