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

// Update a bid - Improved implementation
export const updateBid = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Validate if bid exists first
    const existingBid = await Bid.findById(id);
    if (!existingBid) {
      return res.status(404).json({ message: 'Bid not found' });
    }
    
    // Handle case where no data is provided
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Update data is required' });
    }
    
    // Make sure updates are allowed (e.g., don't update expired bids)
    const now = new Date();
    const endDate = new Date(existingBid.endDate);
    
    if (now > endDate) {
      return res.status(400).json({ 
        message: 'Cannot update expired bid',
        status: 'Expired' 
      });
    }
    
    // Validate the location field if it's being updated
    if (req.body.location !== undefined && req.body.location.trim() === '') {
      return res.status(400).json({ message: 'Location cannot be empty' });
    }
    
    // Create a sanitized update object with only allowed fields
    const allowedUpdates = ['location', 'startDate', 'endDate'];
    const updateData = {};
    
    for (const field of allowedUpdates) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }
    
    // If updating dates, validate them
    if (updateData.startDate || updateData.endDate) {
      const startDate = new Date(updateData.startDate || existingBid.startDate);
      const endDate = new Date(updateData.endDate || existingBid.endDate);
      
      // Ensure start date is before end date
      if (startDate >= endDate) {
        return res.status(400).json({ 
          message: 'Start date must be before end date' 
        });
      }
      
      // For active bids, don't allow changing start date to future
      if (now > new Date(existingBid.startDate) && 
          updateData.startDate && 
          startDate > now) {
        return res.status(400).json({ 
          message: 'Cannot change start date to future for an active bid' 
        });
      }
    }
    
    // Update the bid with validated data
    const updatedBid = await Bid.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('bookListing');
    
    // Return the updated bid
    res.status(200).json(updatedBid);
  } catch (error) {
    // Handle MongoDB/Mongoose errors
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid bid ID format' });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    
    // Handle other errors
    res.status(500).json({ message: error.message });
  }
};

// Delete a bid
export const deleteBid = async (req, res) => {
  try {
    // First check if bid exists and is not expired
    const bid = await Bid.findById(req.params.id);
    
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }
    
    // Check if bid is expired
    const now = new Date();
    const endDate = new Date(bid.endDate);
    
    if (now > endDate) {
      return res.status(400).json({ 
        message: 'Cannot delete expired bid',
        status: 'Expired' 
      });
    }
    
    // Delete the bid
    await Bid.findByIdAndDelete(req.params.id);
    
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
    const now = new Date();
    const startDate = new Date(bid.startDate);
    const endDate = new Date(bid.endDate);
    
    let status;
    if (now < startDate) {
      status = 'Not Started';
    } else if (now >= startDate && now < endDate) {
      status = 'Active';
    } else {
      status = 'Expired';
    }
    
    if (status !== 'Active') {
      return res.status(400).json({ 
        message: `Bid is ${status.toLowerCase()}, cannot place new bids`,
        status: status
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