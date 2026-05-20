const Favorite = require('./favorite.model');

const addFavorite = async (req, res) => {
  try {
    const existing = await Favorite.findOne({ user: req.user.id, property: req.params.propertyId });
    if (existing) {
      await Favorite.findByIdAndDelete(existing._id);
      return res.json({ message: 'Removed from favorites', favorite: false });
    }
    await Favorite.create({ user: req.user.id, property: req.params.propertyId });
    res.json({ message: 'Added to favorites', favorite: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id })
      .populate('property', 'title slug price roiScore riskScore location photos category transactionType');
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const checkFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({ user: req.user.id, property: req.params.propertyId });
    res.json({ favorite: !!favorite });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { addFavorite, getFavorites, checkFavorite };