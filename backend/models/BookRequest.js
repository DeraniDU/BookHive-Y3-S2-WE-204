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
  },
  { timestamps: true } 
);

const BookRequest = mongoose.model('BookRequest', bookRequestSchema);

export default BookRequest; // Exporting the model
