import mongoose from 'mongoose';

const userResponseSchema = new mongoose.Schema({
  bid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bid',
    required: [true, 'Bid reference is required']
  },
  bookListing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BookListing',
    required: [true, 'Book listing reference is required']
  },
  user: {
    name: {
      type: String,
      required: [true, 'User name is required']
    },
    email: {
      type: String,
      required: [true, 'User email is required'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phone: {
      type: String,
      required: false
    }
  },
  bidAmount: {
    type: Number,
    required: [true, 'Bid amount is required'],
    min: [0, 'Bid amount must be greater than 0']
  },
  message: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'Withdrawn'],
    default: 'Pending'
  },
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
userResponseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const UserResponse = mongoose.model('UserResponse', userResponseSchema);

export default UserResponse;