// MUST BE THE FIRST LINE!
import 'dotenv/config';

import express from "express";
import config from "./config.js";  // Changed from destructured import
import mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary';

import cors from 'cors';

const app = express();

// Configure Cloudinary
cloudinary.config(config.cloudinary);




// Database connection
mongoose.connect(config.mongoDBURL)
    .then(() => {
        console.log('✅ App connected to database');
        app.listen(config.PORT, () => {
            console.log(`🚀 Server running on port ${config.PORT}`);
            console.log('☁️ Cloudinary configured:', config.cloudinary.cloud_name ? true : false);
        });
    })
    .catch((error) => {
        console.error('❌ Database connection failed:', error);
        process.exit(1); // Exit if DB connection fails
    });