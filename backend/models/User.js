import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    age: { type: Number, default: 25 },
    weight: { type: Number, default: 70 }, // in kg
    activityLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
  },
  dailyGoal: { type: Number, default: 2000 }, // in ml
  streak: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
