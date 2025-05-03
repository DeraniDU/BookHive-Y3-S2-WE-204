// models/Book.js

import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  bookType: {
    type: String,
    required: true,
    trim: true
  },
  availableArea: {
    type: String,
    required: true,
    trim: true
  },
  review: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: String,
    required: true // Firebase UID
  },
  imageUrl: {
    type: String,
    required: true // Optional - populated only if image is uploaded
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Book = mongoose.model("book", bookSchema,"lendbooks");

export default Book;
