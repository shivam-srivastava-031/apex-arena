const express = require('express');
const { handleRazorpayWebhook } = require('../controllers/webhook.controller');

const router = express.Router();

// Razorpay sends raw JSON — no auth middleware needed, signature verification is done inside
router.post('/razorpay', express.json(), handleRazorpayWebhook);

module.exports = router;
