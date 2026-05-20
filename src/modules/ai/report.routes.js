const express = require('express');
const router = express.Router();
const { generateReport } = require('./report.controller');
const { protect } = require('../../middleware/auth.middleware');

router.get('/:propertyId', protect, generateReport);

module.exports = router;