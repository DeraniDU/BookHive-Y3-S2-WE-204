import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Define schema inline
const borrowedBookSchema = new mongoose.Schema({
 bookId: String,
  title: String,
  author: String,
  cover: String,
  description: String,
  lenderId: { type: String, required: true },
  borrower: {
    id: { type: String, required: true },
    email: String,
  },
  daysLeft: { type: Number, default: 14 },
  borrowedAt: { type: Date, default: Date.now }
});

const BorrowedBook = mongoose.models.BorrowedBook || mongoose.model("BorrowedBook", borrowedBookSchema);


// POST /api/borrow
router.post("/borrow", async (req, res) => {
  try {
    const {
      borrowerId,
      borrowerEmail,
      bookId,
      lenderId,
      title,
      author,
      cover,
      description,
      daysLeft
    } = req.body;

    const newBorrow = new BorrowedBook({
      bookId,
      title,
      author,
      cover,
      description,
      lenderId,
      borrower: {
        id: borrowerId,
        email: borrowerEmail,
      },
      daysLeft
    });

    await newBorrow.save();
    res.status(201).json({ message: "Book borrowed successfully" });
  } catch (error) {
    console.error("Error borrowing book:", error);
    res.status(500).json({ message: "Failed to borrow book" });
  }
});

export default router;
