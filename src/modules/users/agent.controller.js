const cloudinary = require('../../config/cloudinary');
const Property = require('../properties/property.model');

const uploadMedia = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const isVideo = req.file.mimetype.startsWith('video');
    const folder = isVideo ? 'ai-realestate/videos' : 'ai-realestate/photos';

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: isVideo ? 'video' : 'image' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    res.json({
      url: result.secure_url,
      type: isVideo ? 'video' : 'image',
      publicId: result.public_id
    });
  } catch (err) {
    res.status(500).json({ message: 'Upload error', error: err.message });
  }
};

const getAgentProperties = async (req, res) => {
  try {
    const properties = await Property.find({ agent: req.user.id }).sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAgentStats = async (req, res) => {
  try {
    const total = await Property.countDocuments({ agent: req.user.id });
    const active = await Property.countDocuments({ agent: req.user.id, status: 'active' });
    const sold = await Property.countDocuments({ agent: req.user.id, status: 'sold' });
    res.json({ total, active, sold });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { uploadMedia, getAgentProperties, getAgentStats };
