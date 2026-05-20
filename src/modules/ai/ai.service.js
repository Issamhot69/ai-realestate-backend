const calculateROI = ({ price, monthlyRent, expenses = 0 }) => {
  if (!price || !monthlyRent) return 0;
  const annualIncome = (monthlyRent - expenses) * 12;
  return parseFloat(((annualIncome / price) * 100).toFixed(2));
};

const calculateRiskScore = ({ location, price, roiScore }) => {
  let risk = 50;
  if (roiScore > 10) risk -= 10;
  if (roiScore > 15) risk -= 10;
  if (price > 1000000) risk += 10;
  if (price < 100000) risk += 5;
  return Math.min(Math.max(risk, 0), 100);
};

const getInvestmentRanking = (properties) => {
  return properties
    .map(p => ({
      ...p,
      score: (p.roiScore * 0.6) + ((100 - p.riskScore) * 0.4)
    }))
    .sort((a, b) => b.score - a.score);
};

const generateRecommendations = (property) => {
  const tips = [];
  if (property.roiScore > 10) tips.push('High ROI — strong investment opportunity');
  if (property.roiScore < 5) tips.push('Low ROI — consider negotiating price');
  if (property.riskScore > 70) tips.push('High risk — due diligence recommended');
  if (property.riskScore < 30) tips.push('Low risk — stable investment');
  return tips;
};

module.exports = { calculateROI, calculateRiskScore, getInvestmentRanking, generateRecommendations };
