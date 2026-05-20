const Commission = require('./commission.model');
const Property = require('../properties/property.model');

const createCommission = async (req, res) => {
  try {
    const { propertyId, salePrice, commissionRate } = req.body;
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    const commission = await Commission.create({
      agent: req.user.id,
      property: propertyId,
      salePrice,
      commissionRate: commissionRate || 3
    });
    await Property.findByIdAndUpdate(propertyId, { status: 'sold' });
    res.status(201).json(commission);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAgentCommissions = async (req, res) => {
  try {
    const commissions = await Commission.find({ agent: req.user.id })
      .populate('property', 'title price location')
      .sort({ createdAt: -1 });
    const totalEarned = commissions
      .filter(c => c.status === 'paid')
      .reduce((sum, c) => sum + c.commissionAmount, 0);
    const totalPending = commissions
      .filter(c => c.status === 'pending')
      .reduce((sum, c) => sum + c.commissionAmount, 0);
    res.json({ commissions, totalEarned, totalPending });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateCommissionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const commission = await Commission.findByIdAndUpdate(
      req.params.id,
      { status, paidAt: status === 'paid' ? new Date() : null },
      { new: true }
    );
    res.json(commission);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllCommissions = async (req, res) => {
  try {
    const commissions = await Commission.find()
      .populate('agent', 'name email')
      .populate('property', 'title price')
      .sort({ createdAt: -1 });
    res.json(commissions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createCommission, getAgentCommissions, updateCommissionStatus, getAllCommissions };
