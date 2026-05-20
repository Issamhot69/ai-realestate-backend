const express = require('express');
const router = express.Router();
const { transcribeAndTranslate, translateOnly } = require('./video.controller');
const { protect } = require('../../middleware/auth.middleware');
const upload = require('../../middleware/upload.middleware');

router.post('/transcribe', protect, upload.single('audio'), transcribeAndTranslate);
router.post('/translate', protect, translateOnly);

module.exports = router;