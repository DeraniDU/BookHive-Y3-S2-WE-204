const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a book title'],
    trim: true,
  },
  author: {
    type: String,
    required: [true, 'Please add an author'],
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: [
      'Fiction', 'Non-Fiction', 'Science', 'History', 
      'Fantasy', 'Mystery', 'Romance', 'Biography', 
      'Self-Help', 'Horror', 'Poetry', 'Children',
      'Travel', 'Cooking', 'Art', 'Philosophy'
    ],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [1, 'Price must be at least 1'],
  },
  year: {
    type: Number,
    required: [true, 'Please add a publication year'],
    min: [1900, 'Year must be at least 1900'],
  },
  condition: {
    type: String,
    required: [true, 'Please select a condition'],
    enum: ['New', 'Used', 'Damaged'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  photos: {
    type: [String],
    required: [true, 'Please add at least one photo'],
  },
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Book', BookSchema);