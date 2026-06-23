import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import WaterLog from '../models/WaterLog.js';
import User from '../models/User.js';

const router = express.Router();

// Add water log
router.post('/', protect, async (req, res) => {
  const { amount } = req.body;
  try {
    const log = await WaterLog.create({
      user: req.user._id,
      amount
    });
    
    // Simple gamification logic: update score based on amount added
    const user = await User.findById(req.user._id);
    user.score += Math.floor(amount / 10);
    await user.save();

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get today's logs
router.get('/today', protect, async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const logs = await WaterLog.find({
      user: req.user._id,
      timestamp: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ timestamp: -1 });

    const total = logs.reduce((acc, log) => acc + log.amount, 0);

    res.json({ logs, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete water log
router.delete('/:id', protect, async (req, res) => {
  try {
    const log = await WaterLog.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }
    if (log.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await log.deleteOne();
    
    // Decrement score
    const user = await User.findById(req.user._id);
    user.score -= Math.floor(log.amount / 10);
    if (user.score < 0) user.score = 0;
    await user.save();
    
    res.json({ message: 'Log removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
