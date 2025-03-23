import express from 'express';  
import mongoose from 'mongoose'; 
import cors from 'cors';

const app = express();

// Enable CORS with specific settings

// Middleware to parse JSON body
app.use(express.json());  


// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Book API!");
});

mongoose
  .connect(
    "mongodb+srv://bookHive:QVV5WiKkkXimH6a6@cluster0.oep85.mongodb.net/bookDB" // Add a database name
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => console.log(err));
