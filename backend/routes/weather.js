import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import axios from 'axios';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const { lat, lon } = req.query;
  try {
    if (!process.env.OPENWEATHER_API_KEY) {
      // Fallback
      return res.json({
        temperature: 25,
        condition: 'Clear',
        recommendation: 'It\'s a pleasant day. Keep up your regular hydration schedule.'
      });
    }

    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`);
    
    const temp = response.data.main.temp;
    let recommendation = 'Keep up your regular hydration schedule.';
    
    if (temp > 30) {
      recommendation = 'It is very hot today! We recommend adding at least 500ml to your daily goal.';
    } else if (temp > 25) {
      recommendation = 'It is warm today. Remember to drink extra water if you are active.';
    }

    res.json({
      temperature: temp,
      condition: response.data.weather[0].main,
      recommendation
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch weather data' });
  }
});

export default router;
