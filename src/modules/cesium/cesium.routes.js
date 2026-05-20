const express = require('express');
const router = express.Router();
const { getPropertiesGeoJSON, getHeatmapData, getInvestmentZones } = require('./cesium.controller');
const { protect } = require('../../middleware/auth.middleware');

router.get('/geojson', getPropertiesGeoJSON);
router.get('/heatmap', protect, getHeatmapData);
router.get('/zones', protect, getInvestmentZones);

module.exports = router;