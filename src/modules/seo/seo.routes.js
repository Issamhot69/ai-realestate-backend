const express = require('express');
const router = express.Router();
const { getCityPage, getPropertyOG, getSitemap } = require('./seo.controller');

router.get('/city/:city', getCityPage);
router.get('/og/:slug', getPropertyOG);
router.get('/sitemap', getSitemap);

module.exports = router;