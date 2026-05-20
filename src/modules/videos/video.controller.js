const { transcribeAudio, translateText, detectLanguage } = require('./video.service');

const transcribeAndTranslate = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No audio file uploaded' });
    const { targetLang = 'EN' } = req.body;
    const transcription = await transcribeAudio(req.file.buffer, req.file.mimetype);
    const detectedLang = await detectLanguage(transcription);
    const translation = await translateText(transcription, targetLang);
    res.json({ transcription, translation, detectedLang, targetLang });
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
};

const translateOnly = async (req, res) => {
  try {
    const { text, targetLang = 'EN' } = req.body;
    if (!text) return res.status(400).json({ message: 'No text provided' });
    const translation = await translateText(text, targetLang);
    res.json({ original: text, translation, targetLang });
  } catch (err) {
    res.status(500).json({ message: 'Error', error: err.message });
  }
};

module.exports = { transcribeAndTranslate, translateOnly };