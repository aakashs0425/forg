import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key' });

router.post('/chat', protect, async (req, res) => {
  const { message } = req.body;
  try {
    if (!process.env.GEMINI_API_KEY) {
      // Fallback response if no API key is provided
      return res.json({ 
        reply: "This is a placeholder response because the Gemini API key is not configured. Remember to drink 8 glasses of water a day!" 
      });
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an AI hydration assistant. The user says: "${message}". Respond helpfully and concisely.`
    });
    
    res.json({ reply: response.text });
  } catch (error) {
    res.status(500).json({ message: 'Failed to communicate with AI', error: error.message });
  }
});

export default router;
