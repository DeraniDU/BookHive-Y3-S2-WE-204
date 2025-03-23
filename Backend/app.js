<<<<<<< HEAD
console.log("hi")
const e = require("express")
//QVV5WiKkkXimH6a6

const express = require ("express")
const mongoose = require ("mongoose")

const app = express();

//Middlwere
app.use("/",(req , res , next) => {
    res.send("it is working");
=======
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
>>>>>>> parent of 2824f21 (commit)

})

<<<<<<< HEAD
mongoose.connect("mongodb+srv://bookHive:QVV5WiKkkXimH6a6@cluster0.oep85.mongodb.net/")
.then(()=> console.log("connected to mongoDB"))
.then(()=> {
    app.listen(5000);
})
.catch((err)=> console.log((err)));
=======
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
    console.log("Connected to MongoDB");
    app.listen(5000, () => console.log("Server running on port 5000")); // Change the port
  })
  .catch((err) => console.log(err));
>>>>>>> parent of 2824f21 (commit)
