import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import waterRoutes from './routes/water.js';
import aiRoutes from './routes/ai.js';
import weatherRoutes from './routes/weather.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/weather', weatherRoutes);

import { MongoMemoryServer } from 'mongodb-memory-server'; // Removing memory server later if needed

// Database Connection
const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri || mongoUri === '<your_mongodb_connection_string>') {
      console.warn('WARNING: MONGO_URI is not set or is a placeholder. Please configure it in .env');
      // Intentionally not failing immediately so they can see the warning, but mongoose connect will fail if it's invalid.
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB at', mongoUri);
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

connectDB();
