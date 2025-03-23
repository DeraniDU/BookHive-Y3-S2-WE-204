import express from 'express';  
import mongoose from 'mongoose'; 
import booksRoute from './Routes/booksRoute.js'; 
import cors from 'cors';

const app = express();

// Enable CORS with specific settings
app.use(
  cors({
    origin: 'http://localhost:3001', // Change this to match your frontend port
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type'], 
  })
);

// Middleware to parse JSON body
app.use(express.json());  

// Route for books
app.use('/books', booksRoute);  

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Book API!");
});

mongoose
  .connect(
    "mongodb+srv://bookHive:QVV5WiKkkXimH6a6@cluster0.oep85.mongodb.net/bookDB" // Add a database name
  )
  .then(() => {
<<<<<<< HEAD
    app.listen(3000);
=======
    console.log("Connected to MongoDB");
    app.listen(5000, () => console.log("Server running on port 5000")); // Change the port
>>>>>>> 082cafcd9ac46803df470bb0781c62b30777ab9a
  })
  .catch((err) => console.log(err));
