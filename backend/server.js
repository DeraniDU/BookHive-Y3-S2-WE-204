import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { default as bookListingRoutes } from './routes/bookListingRoutes.js';
import bidRoutes from './routes/bidRoutes.js';
import userResponseRoutes from './routes/userResponseRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://samadi:Samadi%401214@bookhive.kyrmgyi.mongodb.net/books-collection?retryWrites=true&w=majority')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/booklistings', bookListingRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/responses', userResponseRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Book Bidding API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log('Server setup complete. Now creating models and routes...');