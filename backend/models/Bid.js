import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  bookListing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BookListing',
    required: [true, 'Book listing reference is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    validate: {
      validator: function(value) {
        return value >= new Date();
      },
      message: 'Start date cannot be in the past'
    }
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(value) {
        // End date must be after start date
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Not Started', 'Active', 'Expired'],
    default: 'Not Started'
  },
  bids: [{
    bidder: {
      type: String, // In a real app, this would be a user ID
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Bid amount must be greater than 0']
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
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
bidSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Update bid status based on dates
bidSchema.pre('save', function(next) {
  const now = new Date();
  if (now < this.startDate) {
    this.status = 'Not Started';
  } else if (now >= this.startDate && now <= this.endDate) {
    this.status = 'Active';
  } else {
    this.status = 'Expired';
  }
  next();
});

const Bid = mongoose.model('Bid', bidSchema);

export default Bid;