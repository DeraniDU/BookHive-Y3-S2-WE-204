import mongoose from 'mongoose';

const bookRequestSchema = new mongoose.Schema(
  {
    bookOffered: { type: String, required: true },
    bookWanted: { type: String, required: true },
    condition: { type: String, required: true },
    notes: { type: String },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    requestedBy: {  // NEW: Track who made the request
      type: String,  // Firebase UID
      required: true
    },
    ownerId: {      // NEW: Track who owns the book being requested
      type: String,  // Firebase UID
      required: true
    }
  },
  { timestamps: true } 
);

const BookRequest = mongoose.model('BookRequest', bookRequestSchema);

export default BookRequest;