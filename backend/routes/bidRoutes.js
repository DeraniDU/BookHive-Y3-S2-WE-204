import express from 'express';
import { 
  getAllBids, 
  getBidById, 
  createBid, 
  updateBid, 
  deleteBid,
  placeBid,
  getBidsByBookListing,
  getHighestBid
} from '../controllers/bidController.js';

const router = express.Router();

// GET all bids
router.get('/', getAllBids);

// GET a single bid by ID
router.get('/:id', getBidById);

// GET all bids for a specific book listing
router.get('/book/:bookListingId', getBidsByBookListing);

// GET highest bid for a specific bid
router.get('/:id/highest', getHighestBid);

// POST a new bid
router.post('/', createBid);

// PUT (update) a bid
router.put('/:id', updateBid);

// DELETE a bid
router.delete('/:id', deleteBid);

// POST place a bid on an existing bid
router.post('/:id/place', placeBid);

export default router;