const express = require('express');
const router = express.Router();
const { analyzeProperty, getTopInvestments } = require('./ai.controller');
const { protect } = require('../../middleware/auth.middleware');

router.post('/analyze', protect, analyzeProperty);
router.get('/top-investments', protect, getTopInvestments);

module.exports = router;
