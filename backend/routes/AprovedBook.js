import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Shared BorrowedBook schema (safe model creation to avoid OverwriteModelError)
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
  borrowedAt: { type: Date, default: Date.now },
});

// ✅ Use existing model if already registered
const BorrowedBook = mongoose.models.BorrowedBook || mongoose.model("BorrowedBook", borrowedBookSchema);

// GET /api/approved-books?lenderId=...
router.get("/approved-books", async (req, res) => {
  try {
    const { lenderId } = req.query;

    // Check for missing lenderId
    if (!lenderId || lenderId.trim() === "") {
      return res.status(400).json({ message: "Missing lenderId" });
    }

    // Query borrowed books where current user is the lender
    const books = await BorrowedBook.find({ lenderId });

    return res.status(200).json({ approvedBooks: books });
  } catch (error) {
    console.error("❌ Error fetching approved books:", error);
    return res.status(500).json({ message: "Failed to get approved books" });
  }
});

export default router;
