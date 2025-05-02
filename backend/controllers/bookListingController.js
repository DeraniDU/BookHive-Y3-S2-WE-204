import BookListing from '../models/BookListing.js';

// Get all book listings
export const getAllBookListings = async (req, res) => {
  try {
    const bookListings = await BookListing.find();
    res.status(200).json(bookListings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single book listing by ID
export const getBookListingById = async (req, res) => {
  try {
    const bookListing = await BookListing.findById(req.params.id);
    if (!bookListing) {
      return res.status(404).json({ message: 'Book listing not found' });
    }
    res.status(200).json(bookListing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new book listing
export const createBookListing = async (req, res) => {
  try {
    const newBookListing = new BookListing(req.body);
    const savedBookListing = await newBookListing.save();
    res.status(201).json(savedBookListing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a book listing
export const updateBookListing = async (req, res) => {
  try {
    const updatedBookListing = await BookListing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedBookListing) {
      return res.status(404).json({ message: 'Book listing not found' });
    }
    
    res.status(200).json(updatedBookListing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a book listing
export const deleteBookListing = async (req, res) => {
  try {
    const bookListing = await BookListing.findByIdAndDelete(req.params.id);
    
    if (!bookListing) {
      return res.status(404).json({ message: 'Book listing not found' });
    }
    
    res.status(200).json({ message: 'Book listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};