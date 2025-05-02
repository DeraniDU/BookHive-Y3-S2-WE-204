import express from 'express';
import { 
  getAllUserResponses, 
  getUserResponseById, 
  createUserResponse, 
  updateUserResponse, 
  deleteUserResponse,
  getUserResponsesByBid,
  getUserResponsesByBookListing
} from '../controllers/userResponseController.js';

const router = express.Router();

// GET all user responses
router.get('/', getAllUserResponses);

// GET a single user response by ID
router.get('/:id', getUserResponseById);

// GET all user responses for a specific bid
router.get('/bid/:bidId', getUserResponsesByBid);

// GET all user responses for a specific book listing
router.get('/book/:bookListingId', getUserResponsesByBookListing);

// POST a new user response
router.post('/', createUserResponse);

// PUT (update) a user response
router.put('/:id', updateUserResponse);

// DELETE a user response
router.delete('/:id', deleteUserResponse);

export default router;