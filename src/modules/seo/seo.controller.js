const Property = require('../properties/property.model');
const { generateCityPage, generateOpenGraph } = require('./seo.service');

const getCityPage = async (req, res) => {
  try {
    const { city } = req.params;
    const properties = await Property.find({ 'location.city': new RegExp(city, 'i'), status: 'active' })
      .select('title slug price roiScore riskScore photos location');
    const page = generateCityPage(city, properties);
    res.json(page);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getPropertyOG = async (req, res) => {
  try {
    const property = await Property.findOne({ slug: req.params.slug });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(generateOpenGraph(property));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getSitemap = async (req, res) => {
  try {
    const properties = await Property.find({ status: 'active' }).select('slug updatedAt');
    const urls = properties.map(p => ({
      url: `https://ai-realestate.com/property/${p.slug}`,
      lastmod: p.updatedAt
    }));
    res.json({ urls, total: urls.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getCityPage, getPropertyOG, getSitemap };