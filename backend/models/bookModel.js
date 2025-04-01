import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema
    (
        {
          bookTitle: {
            type: String,
            required: true,
            trim: true,
          },
          bookGenre: {
            type: String,
            required: true,
            enum: ["Fiction", "Non-Fiction", "Biography", "Sci-Fi", "Fantasy", "Mystery"],
          },
          condition: {
            type: String,
            required: true,
            enum: ["New", "Like New", "Used", "Damaged"],
          },
          availableDate: {
            type: Date,
            required: true,
          },
          comments: {
            type: String,
            trim: true,
          },
        },
        {
          timestamps: true, // Adds createdAt and updatedAt timestamps
        }
      );
export const Book = mongoose.model('Book', bookSchema);
