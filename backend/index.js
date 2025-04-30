// MUST BE THE FIRST LINE!
import 'dotenv/config';
import express from "express";
import config from "./config/config.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary';
import admin from './config/firebase-admin.js'; // NEW: Firebase Admin import
import booksRoute from "./routes/bookRoutes.js";
import bookRequestRoutes from "./routes/bookRequestRoutes.js";
import exchangeRoutes from "./routes/exchangeRoutes.js";
import userRoutes from "./routes/userRoutes.js"; // NEW: User routes
import cors from 'cors';
import authenticate from './middlewares/authMiddleware.js'; // NEW: Auth middleware

const app = express();

// Configure Cloudinary
cloudinary.config(config.cloudinary);

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Adjust as needed
  credentials: true
}));
app.use("/uploads", express.static("uploads"));

// Routes
app.get('/', (req, res) => {
    console.log("Received a request on '/' endpoint");
    return res.status(200).send('Welcome to BookHive API');
});

// Public routes
app.use('/books', booksRoute); // Consider making some book routes public

// Authenticated routes
app.use('/request', authenticate, bookRequestRoutes); // Protected
app.use("/exchange", authenticate, exchangeRoutes); // Protected
app.use("/users", userRoutes); // NEW: User routes (some may be public)

// NEW: Test Firebase connection endpoint (remove in production)
// Test Firebase Admin connection
app.get('/firebase-test', async (req, res) => {
  try {
      const projectId = admin.app().options.credential.projectId;
      const users = await admin.auth().listUsers(1);
      
      res.json({
          success: true,
          projectId,
          users: users.users.length
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          error: error.message
      });
  }
});

// Error handling middleware (NEW)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Database connection
mongoose.connect(config.mongoDBURL)
    .then(() => {
        console.log('App connected to database');
        // Verify Firebase connection
        admin.auth().listUsers(1)
          .then(() => console.log('Firebase Admin connection verified'))
          .catch(err => console.error('Firebase Admin connection failed:', err));
        
          app.listen(config.PORT, () => {
            console.log(`Server running on port ${config.PORT}`);
            console.log('Cloudinary configured:', config.cloudinary.cloud_name ? true : false);
            
            // Get the ACTUAL initialized Firebase project ID
            try {
              console.log('Firebase Project:', admin.app().options.credential.projectId); 
            } catch (error) {
                console.error('Error getting Firebase project:', error);
            }
        });
    })
    .catch((error) => {
        console.error('Database connection failed:', error);
        process.exit(1);
    });