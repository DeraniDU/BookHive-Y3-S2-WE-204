// MUST BE THE FIRST LINE!
import 'dotenv/config';

import express from "express";
import config from "./config/config.js";  // Changed from destructured import
import mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary';
import booksRoute from "./routes/bookRoutes.js";
import bookRequestRoutes from "./routes/bookRequestRoutes.js";
import exchangeRoutes from "./routes/exchangeRoutes.js";
import cors from 'cors';

const app = express();

// Configure Cloudinary
cloudinary.config(config.cloudinary);

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// Routes
app.get('/', (req, res) => {
    console.log("Received a request on '/' endpoint");
    return res.status(200).send('Welcome to the MERN Stack Tutorial');
});

app.use('/books', booksRoute);
app.use('/request', bookRequestRoutes);
app.use("/exchange", exchangeRoutes);


// Database connection
mongoose.connect(config.mongoDBURL)
    .then(() => {
        console.log(' App connected to database');
        app.listen(config.PORT, () => {
            console.log(` Server running on port ${config.PORT}`);
            console.log(' Cloudinary configured:', config.cloudinary.cloud_name ? true : false);
        });
    })
    .catch((error) => {
        console.error('Database connection failed:', error);
        process.exit(1); // Exit if DB connection fails
    });