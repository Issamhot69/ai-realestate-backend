const express = require('express');
const router = express.Router();
const { createProperty, getAllProperties, getPropertyBySlug, updateProperty, deleteProperty } = require('./property.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');

router.get('/', getAllProperties);
router.get('/:slug', getPropertyBySlug);
router.post('/', protect, authorize('agent', 'developer', 'admin'), createProperty);
router.put('/:id', protect, authorize('agent', 'developer', 'admin'), updateProperty);
router.delete('/:id', protect, authorize('admin'), deleteProperty);

module.exports = router;
