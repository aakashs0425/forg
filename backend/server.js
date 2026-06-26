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

// Allow CORS for all domains (or you can specify the frontend URL here)
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/weather', weatherRoutes);

import { MongoMemoryServer } from 'mongodb-memory-server';

// Database Connection
const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (!mongoUri || mongoUri === '<your_mongodb_connection_string>') {
      if (process.env.NODE_ENV === 'production') {
        console.error('CRITICAL ERROR: MONGO_URI environment variable is not set in production!');
        process.exit(1);
      } else {
        console.warn('WARNING: MONGO_URI is not set or is a placeholder. Using MongoMemoryServer for development.');
        const mongoServer = await MongoMemoryServer.create();
        mongoUri = mongoServer.getUri();
      }
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

connectDB();
