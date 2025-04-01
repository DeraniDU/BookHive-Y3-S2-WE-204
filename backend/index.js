import express from "express";
import { PORT,mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import booksRoute from "./routes/bookRoutes.js";
import bookRequestRoutes from "./routes/bookRequestRoutes.js";
import exchangeRoutes from "./routes/exchangeRoutes.js";

import cors from 'cors';
const app = express();

//middeleware for passing request body
app.use(express.json());

app.use(cors());

// Serve static files (uploaded images)
app.use("/uploads", express.static("uploads"));

//app.use(
   // cors({
     //   origin:"http://localhost:3000",
     //   methods:['GET','POST','PUT','DELETE'],
     //   allowedHeaders:['content-Type'],
    //})
//)

app.get('/', (req, res) => {
    console.log("Received a request on '/' endpoint");
    return res.status(200).send('Welcome to the MERN Stack Tutorial');
});

app.use('/books',booksRoute);
app.use('/request', bookRequestRoutes);
app.use("/exchange", exchangeRoutes);


mongoose
    .connect(mongoDBURL)
    .then(()  =>{
        console.log('app connected to database');
        app.listen(PORT, () => {
            console.log(`App is listening on port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);

    });