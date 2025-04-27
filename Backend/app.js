const express = require("express");
const mongoose = require("mongoose");
const bookRoutes = require("./Routes/bookRoutes");


const app = express();

app.use(express.json());

app.use("/api/books", bookRoutes);

mongoose
  .connect(
    "mongodb+srv://bookHive:QVV5WiKkkXimH6a6@cluster0.oep85.mongodb.net/"
  )
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, () =>
      console.log("Server running on http://localhost:5000")
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));
