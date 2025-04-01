import express from "express";
import ExchangeModel from "../models/exchangeModel.js"; 

const router = express.Router();

// Add a new exchange book
router.post("/", async (req, res) => {
  try {
    const { title, author, genre, description, condition, ownerName, contactInfo, available, location } = req.body;

    const newBook = new ExchangeModel({
      title,
      author,
      genre,
      description,
      condition,
      ownerName,
      contactInfo,
      available,
      location
    });

    await newBook.save();
    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all exchange books
router.get("/", async (req, res) => {
  try {
    const books = await ExchangeModel.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single exchange book by ID
router.get("/:id", async (req, res) => {
  try {
    const book = await ExchangeModel.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update exchange book details
router.put("/:id", async (req, res) => {
  try {
    const updatedBook = await ExchangeModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Added `runValidators: true`
    );

    if (!updatedBook) return res.status(404).json({ message: "Book not found" });

    res.status(200).json({ message: "Book updated successfully", book: updatedBook });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an exchange book
router.delete("/:id", async (req, res) => {
  try {
    const deletedBook = await ExchangeModel.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: "Book not found" });
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
