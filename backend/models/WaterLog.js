import mongoose from 'mongoose';

const waterLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true // in ml
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('WaterLog', waterLogSchema);
