import mongoose from 'mongoose';

const bookListingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Book name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be greater than 0']
  },
  year: {
    type: Number,
    required: [true, 'Publication year is required'],
    min: [1900, 'Year must be at least 1900'],
    max: [new Date().getFullYear(), 'Year cannot be in the future']
  },
  condition: {
    type: String,
    required: [true, 'Book condition is required'],
    enum: ['New', 'Like New', 'Very Good', 'Good', 'Fair', 'Poor', 'Used', 'Damaged']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  photos: [{
    type: String, // URLs to stored images
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
bookListingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const BookListing = mongoose.model('BookListing', bookListingSchema);

export default BookListing;