const Property = require('../properties/property.model');

const getPropertiesGeoJSON = async (req, res) => {
  try {
    const properties = await Property.find({ status: 'active' })
      .select('title slug price roiScore riskScore location photos');

    const geojson = {
      type: 'FeatureCollection',
      features: properties
        .filter(p => p.location?.coordinates?.lat && p.location?.coordinates?.lng)
        .map(p => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [p.location.coordinates.lng, p.location.coordinates.lat]
          },
          properties: {
            id: p._id,
            title: p.title,
            slug: p.slug,
            price: p.price,
            roiScore: p.roiScore,
            riskScore: p.riskScore,
            photo: p.photos?.[0] || '',
            city: p.location.city,
            country: p.location.country
          }
        }))
    };

    res.json(geojson);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getHeatmapData = async (req, res) => {
  try {
    const properties = await Property.find({ status: 'active' })
      .select('roiScore riskScore location price');

    const heatmap = properties
      .filter(p => p.location?.coordinates?.lat && p.location?.coordinates?.lng)
      .map(p => ({
        lat: p.location.coordinates.lat,
        lng: p.location.coordinates.lng,
        intensity: p.roiScore || 0,
        price: p.price,
        risk: p.riskScore
      }));

    res.json({ heatmap, total: heatmap.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getInvestmentZones = async (req, res) => {
  try {
    const properties = await Property.find({ status: 'active', roiScore: { $gte: 8 } })
      .select('title location roiScore price');

    const zones = properties
      .filter(p => p.location?.coordinates?.lat)
      .map(p => ({
        lat: p.location.coordinates.lat,
        lng: p.location.coordinates.lng,
        title: p.title,
        roiScore: p.roiScore,
        price: p.price,
        zone: p.roiScore >= 12 ? 'premium' : 'good'
      }));

    res.json({ zones, total: zones.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getPropertiesGeoJSON, getHeatmapData, getInvestmentZones };