import express from 'express';
import { 
  getAllBookListings, 
  getBookListingById, 
  createBookListing, 
  updateBookListing, 
  deleteBookListing 
} from '../controllers/bookListingController.js';

const router = express.Router();

// GET all book listings
router.get('/', getAllBookListings);

// GET a single book listing by ID
router.get('/:id', getBookListingById);

// POST a new book listing
router.post('/', createBookListing);

// PUT (update) a book listing
router.put('/:id', updateBookListing);

// DELETE a book listing
router.delete('/:id', deleteBookListing);

export default router;