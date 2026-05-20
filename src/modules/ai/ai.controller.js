const { calculateROI, calculateRiskScore, getInvestmentRanking, generateRecommendations } = require('./ai.service');
const Property = require('../properties/property.model');

const analyzeProperty = async (req, res) => {
  try {
    const { price, monthlyRent, expenses } = req.body;
    const roiScore = calculateROI({ price, monthlyRent, expenses });
    const riskScore = calculateRiskScore({ price, roiScore });
    const recommendations = generateRecommendations({ roiScore, riskScore });
    res.json({ roiScore, riskScore, recommendations });
  } catch (err) {
    res.status(500).json({ message: 'AI error', error: err.message });
  }
};

const getTopInvestments = async (req, res) => {
  try {
    const properties = await Property.find({ status: 'active' }).lean();
    const ranked = getInvestmentRanking(properties);
    res.json(ranked.slice(0, 10));
  } catch (err) {
    res.status(500).json({ message: 'AI error', error: err.message });
  }
};

module.exports = { analyzeProperty, getTopInvestments };
