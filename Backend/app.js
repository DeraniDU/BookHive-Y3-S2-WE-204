import express from 'express';  
import mongoose from 'mongoose'; 
import booksRoute from './Routes/booksRoute.js'; 

const app = express();

// Middleware
app.use("/", (req, res, next) => {
  res.send("It is working");
});

app.use('/books', booksRoute);  

mongoose
  .connect(
    "mongodb+srv://bookHive:QVV5WiKkkXimH6a6@cluster0.oep85.mongodb.net/"
  )
  .then(() => console.log("connected to mongoDB"))
  .then(() => {
    app.listen(3001);
  })
  .catch((err) => console.log(err));
