import Bid from '../models/Bid.js';
import BookListing from '../models/BookListing.js';

// Get all bids
export const getAllBids = async (req, res) => {
  try {
    const bids = await Bid.find().populate('bookListing');
    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single bid by ID
export const getBidById = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id).populate('bookListing');
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }
    res.status(200).json(bid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new bid
export const createBid = async (req, res) => {
  try {
    // Check if the book listing exists
    const bookListing = await BookListing.findById(req.body.bookListing);
    if (!bookListing) {
      return res.status(404).json({ message: 'Book listing not found' });
    }

    const newBid = new Bid(req.body);
    const savedBid = await newBid.save();
    
    // Populate the book listing details in the response
    const populatedBid = await Bid.findById(savedBid._id).populate('bookListing');
    
    res.status(201).json(populatedBid);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a bid
export const updateBid = async (req, res) => {
  try {
    const updatedBid = await Bid.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('bookListing');
    
    if (!updatedBid) {
      return res.status(404).json({ message: 'Bid not found' });
    }
    
    res.status(200).json(updatedBid);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a bid
export const deleteBid = async (req, res) => {
  try {
    const bid = await Bid.findByIdAndDelete(req.params.id);
    
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }
    
    res.status(200).json({ message: 'Bid deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Place a bid on an existing bid
export const placeBid = async (req, res) => {
  try {
    const { bidder, amount } = req.body;
    
    if (!bidder || !amount) {
      return res.status(400).json({ message: 'Bidder and amount are required' });
    }
    
    const bid = await Bid.findById(req.params.id);
    
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }
    
    // Check if bid is active
    if (bid.status !== 'Active') {
      return res.status(400).json({ 
        message: `Bid is ${bid.status.toLowerCase()}, cannot place new bids`,
        status: bid.status
      });
    }
    
    // Add the new bid with timestamp
    const newBidEntry = {
      bidder,
      amount,
      timestamp: new Date()
    };
    
    bid.bids.push(newBidEntry);
    
    // Save the updated bid
    const updatedBid = await bid.save();
    
    // Populate the book listing details in the response
    const populatedBid = await Bid.findById(updatedBid._id).populate('bookListing');
    
    res.status(200).json(populatedBid);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all bids for a specific book listing
export const getBidsByBookListing = async (req, res) => {
  try {
    const bookListingId = req.params.bookListingId;
    
    // Validate if the book listing exists
    const bookListing = await BookListing.findById(bookListingId);
    if (!bookListing) {
      return res.status(404).json({ message: 'Book listing not found' });
    }
    
    // Find all bids for this book listing
    const bids = await Bid.find({ bookListing: bookListingId }).populate('bookListing');
    
    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get highest bid for a specific bid
export const getHighestBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);
    
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }
    
    if (bid.bids.length === 0) {
      return res.status(200).json({ 
        message: 'No bids placed yet',
        highestBid: null
      });
    }
    
    // Find the highest bid
    const highestBid = bid.bids.reduce((prev, current) => {
      return (prev.amount > current.amount) ? prev : current;
    });
    
    res.status(200).json({
      message: 'Highest bid retrieved successfully',
      highestBid
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};