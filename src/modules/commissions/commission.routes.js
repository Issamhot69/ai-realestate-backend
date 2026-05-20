const express = require('express');
const router = express.Router();
const { createCommission, getAgentCommissions, updateCommissionStatus, getAllCommissions } = require('./commission.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');

router.post('/', protect, authorize('agent', 'developer', 'admin'), createCommission);
router.get('/my', protect, authorize('agent', 'developer', 'admin'), getAgentCommissions);
router.put('/:id', protect, authorize('admin'), updateCommissionStatus);
router.get('/all', protect, authorize('admin'), getAllCommissions);

module.exports = router;
