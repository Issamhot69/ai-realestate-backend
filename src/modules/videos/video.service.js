const axios = require('axios');

const translateText = async (text, targetLang = 'en', sourceLang = 'fr') => {
  try {
    const response = await axios.get('https://api.mymemory.translated.net/get', {
      params: { q: text, langpair: sourceLang + '|' + targetLang }
    });
    return response.data.responseData.translatedText;
  } catch (err) {
    throw new Error('Translation error: ' + err.message);
  }
};

const detectLanguage = async (text) => { return 'fr'; };

const transcribeAudio = async (audioBuffer, mimeType = 'audio/webm') => {
  try {
    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const file = new File([audioBuffer], 'audio.webm', { type: mimeType });
    const transcription = await openai.audio.transcriptions.create({ file, model: 'whisper-1', response_format: 'text' });
    return transcription;
  } catch (err) {
    throw new Error('Transcription error: ' + err.message);
  }
};

module.exports = { transcribeAudio, translateText, detectLanguage };