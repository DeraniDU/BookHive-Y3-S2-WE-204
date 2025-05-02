// MUST BE THE FIRST LINE!
import 'dotenv/config';

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import config from './config/config.js';

// Import all routes
import bookListingRoutes from './routes/bookListingRoutes.js';
import bidRoutes from './routes/bidRoutes.js';
import userResponseRoutes from './routes/userResponseRoutes.js';
import booksRoute from './routes/bookRoutes.js';
import bookRequestRoutes from './routes/bookRequestRoutes.js';
import exchangeRoutes from './routes/exchangeRoutes.js';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Configure Cloudinary
cloudinary.config(config.cloudinary);

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Database connection
const connectToMongoDB = async () => {
  const mongoURI = process.env.MONGODB_URI || config.mongoDBURL || 'mongodb+srv://samadi:Samadi%401214@bookhive.kyrmgyi.mongodb.net/books-collection?retryWrites=true&w=majority';
  
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if DB connection fails
  }
};

// Connect to MongoDB
connectToMongoDB();

// Routes
app.get('/', (req, res) => {
  res.send('BookHive API is running');
});

// API Routes
app.use('/api/booklistings', bookListingRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/responses', userResponseRoutes);
app.use('/books', booksRoute);
app.use('/request', bookRequestRoutes);
app.use("/exchange", exchangeRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Cloudinary configured:', config.cloudinary.cloud_name ? true : false);
});

console.log('Server setup complete');