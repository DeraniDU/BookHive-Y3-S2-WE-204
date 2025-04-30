import mongoose from 'mongoose';

const exchangeSchema = new mongoose.Schema({
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
  ownerId: {  // NEW: Track the Firebase UID of the owner
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

const Exchange = mongoose.model('Exchange', exchangeSchema);

export default Exchange;  // Fixed: Changed from 'Book' to 'Exchange'