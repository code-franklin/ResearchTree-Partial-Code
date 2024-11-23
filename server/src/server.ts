import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import multer  from 'multer';
import cors from 'cors';
import path from 'path';
import advicerRoutes from './routes/advicerRoutes';
import adminRoutes from './routes/adminRoutes';
import studentRoutes from './routes/studentRoutes';


import { LanguageServiceClient } from '@google-cloud/language';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
const client = new LanguageServiceClient({
  keyFilename: process.env.GOOGLE_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
// app.use("/public/files", express.static("public/files"));
app.use('/public/files', express.static(path.join(__dirname, 'public', 'files')));

// Middleware to set CORS headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  next();
});

// Routes for Users
app.use('/api/student', studentRoutes);
app.use('/api/advicer', advicerRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI || 'your_default_mongo_uri';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });  
