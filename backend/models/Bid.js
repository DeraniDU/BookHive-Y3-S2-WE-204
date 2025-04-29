const mongoose = require('mongoose');

const BidSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.ObjectId,
    ref: 'Book',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: [true, 'Please add a bid amount'],
  },
  status: {
    type: String,
    enum: ['active', 'won', 'lost', 'expired'],
    default: 'active',
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date'],
  },
  endDate: {
    type: Date,
    required: [true, 'Please add an end date'],
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure end date is after start date
BidSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    throw new Error('End date must be after start date');
  }
  next();
});

module.exports = mongoose.model('Bid', BidSchema);