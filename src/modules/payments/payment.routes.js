const express = require('express');
const router = express.Router();
const { createCheckoutSession, stripeWebhook, getUserPlan } = require('./payment.controller');
const { protect } = require('../../middleware/auth.middleware');

router.post('/checkout', protect, createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
router.get('/my-plan', protect, getUserPlan);

module.exports = router;