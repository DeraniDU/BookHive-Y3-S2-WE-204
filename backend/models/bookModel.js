import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  genre: {
    type: String,
    required: true,
    enum: ["Fiction", "Non-Fiction", "Biography", "Sci-Fi", "Fantasy", "Mystery"],
  },
  description: {
    type: String,
    trim: true,
  },
  condition: {
    type: String,
    required: true,
    enum: ["New", "Like New", "Good", "Fair", "Worn", "Used", "Damaged"],
  },
  ownerName: {
    type: String,
    required: true,
    trim: true,
  },
  contactInfo: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  available: {
    type: Boolean,
    default: true,
  },
  location: {
    type: String,
    trim: true,
  },
  bookImage: {
    public_id: String,
    url: String
  },
  ownerId: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

const Book = mongoose.model('Book', bookSchema, 'books'); // Explicitly use 'books' collection

export default Book;