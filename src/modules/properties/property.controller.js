const Property = require('./property.model');

const generateSlug = (title) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
};

const createProperty = async (req, res) => {
  try {
    const slug = generateSlug(req.body.title);
    const property = await Property.create({ ...req.body, slug, agent: req.user.id });
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllProperties = async (req, res) => {
  try {
    const { city, minRoi, maxPrice, page = 1, limit = 12 } = req.query;
    const filter = { status: 'active' };
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (minRoi) filter.roiScore = { $gte: Number(minRoi) };
    if (maxPrice) filter.price = { $lte: Number(maxPrice) };
    const properties = await Property.find(filter)
      .populate('agent', 'name email')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    const total = await Property.countDocuments(filter);
    res.json({ properties, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getPropertyBySlug = async (req, res) => {
  try {
    const property = await Property.findOne({ slug: req.params.slug }).populate('agent', 'name email');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createProperty, getAllProperties, getPropertyBySlug, updateProperty, deleteProperty };