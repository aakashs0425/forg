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

import { MongoMemoryServer } from 'mongodb-memory-server';

// Database Connection
const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.log('No MONGO_URI provided. Setting up in-memory MongoDB...');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB at', mongoUri);
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
};

connectDB();
