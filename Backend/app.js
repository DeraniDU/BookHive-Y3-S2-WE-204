import express from 'express';  
import mongoose from 'mongoose'; 
import booksRoute from './Routes/booksRoute.js'; 

const app = express();

// Middleware to parse JSON body
app.use(express.json());  

// Route for books
app.use('/books', booksRoute);  

// Default route (optional, place it at the end)
app.get("/", (req, res) => {
  res.send("Welcome to the Book API!");
});

mongoose
  .connect(
    "mongodb+srv://bookHive:QVV5WiKkkXimH6a6@cluster0.oep85.mongodb.net/"
  )
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3001, () => console.log("Server running on port 3001"));
  })
  .catch((err) => console.log(err));

