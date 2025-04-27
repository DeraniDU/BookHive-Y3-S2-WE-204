const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  bookType: { type: String, required: true },
  availableArea: { type: String, required: true },
  review: { type: String,required: true  },
  userId: { type: String, required: true }, // Firebase UID
  imageUrl: { type: String }, // optional if you handle image uploads later
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Book", bookSchema);
