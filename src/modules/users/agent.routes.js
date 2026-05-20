const express = require('express');
const router = express.Router();
const { uploadMedia, getAgentProperties, getAgentStats } = require('./agent.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');
const upload = require('../../middleware/upload.middleware');

router.post('/upload', protect, authorize('agent', 'developer', 'admin'), upload.single('file'), uploadMedia);
router.get('/properties', protect, authorize('agent', 'developer', 'admin'), getAgentProperties);
router.get('/stats', protect, authorize('agent', 'developer', 'admin'), getAgentStats);

module.exports = router;
