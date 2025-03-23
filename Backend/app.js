console.log("hi");
const e = require("express");
//QVV5WiKkkXimH6a6

const express = require("express");
const mongoose = require("mongoose");

const app = express();

//Middlwere
app.use("/", (req, res, next) => {
  res.send("it is working");
});

mongoose
  .connect(
    "mongodb+srv://bookHive:QVV5WiKkkXimH6a6@cluster0.oep85.mongodb.net/"
  )
  .then(() => console.log("connected to mongoDB"))
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
