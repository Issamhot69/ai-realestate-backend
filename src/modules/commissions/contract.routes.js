const express = require('express');
const router = express.Router();
const { generateContract } = require('./contract.controller');
const { protect } = require('../../middleware/auth.middleware');

router.post('/generate', protect, generateContract);

module.exports = router;