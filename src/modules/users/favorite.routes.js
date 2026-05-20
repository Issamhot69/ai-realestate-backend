const express = require('express');
const router = express.Router();
const { addFavorite, getFavorites, checkFavorite } = require('./favorite.controller');
const { protect } = require('../../middleware/auth.middleware');

router.post('/:propertyId', protect, addFavorite);
router.get('/', protect, getFavorites);
router.get('/check/:propertyId', protect, checkFavorite);

module.exports = router;