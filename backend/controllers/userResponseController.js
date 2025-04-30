import UserResponse from '../models/UserResponse.js';
import Bid from '../models/Bid.js';
import BookListing from '../models/BookListing.js';

// Get all user responses
export const getAllUserResponses = async (req, res) => {
  try {
    const userResponses = await UserResponse.find()
      .populate('bid')
      .populate('bookListing');
    res.status(200).json(userResponses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single user response by ID
export const getUserResponseById = async (req, res) => {
  try {
    const userResponse = await UserResponse.findById(req.params.id)
      .populate('bid')
      .populate('bookListing');
    
    if (!userResponse) {
      return res.status(404).json({ message: 'User response not found' });
    }
    
    res.status(200).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new user response
export const createUserResponse = async (req, res) => {
  try {
    const { bid: bidId, bookListing: bookListingId, user, bidAmount, message } = req.body;
    
    // Check if the bid exists
    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }
    
    // Check if the book listing exists
    const bookListing = await BookListing.findById(bookListingId);
    if (!bookListing) {
      return res.status(404).json({ message: 'Book listing not found' });
    }
    
    // Check if bid is active
    if (bid.status !== 'Active') {
      return res.status(400).json({ 
        message: `Bid is ${bid.status.toLowerCase()}, cannot place new responses`,
        status: bid.status
      });
    }
    
    // Create the user response
    const newUserResponse = new UserResponse({
      bid: bidId,
      bookListing: bookListingId,
      user,
      bidAmount,
      message
    });
    
    const savedUserResponse = await newUserResponse.save();
    
    // Also add this bid to the bid's bids array
    bid.bids.push({
      bidder: user.name,
      amount: bidAmount,
      timestamp: new Date()
    });
    
    await bid.save();
    
    // Populate the references in the response
    const populatedResponse = await UserResponse.findById(savedUserResponse._id)
      .populate('bid')
      .populate('bookListing');
    
    res.status(201).json(populatedResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a user response
export const updateUserResponse = async (req, res) => {
  try {
    const updatedUserResponse = await UserResponse.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('bid')
      .populate('bookListing');
    
    if (!updatedUserResponse) {
      return res.status(404).json({ message: 'User response not found' });
    }
    
    res.status(200).json(updatedUserResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a user response
export const deleteUserResponse = async (req, res) => {
  try {
    const userResponse = await UserResponse.findByIdAndDelete(req.params.id);
    
    if (!userResponse) {
      return res.status(404).json({ message: 'User response not found' });
    }
    
    res.status(200).json({ message: 'User response deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all user responses for a specific bid
export const getUserResponsesByBid = async (req, res) => {
  try {
    const bidId = req.params.bidId;
    
    // Validate if the bid exists
    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }
    
    // Find all user responses for this bid
    const userResponses = await UserResponse.find({ bid: bidId })
      .populate('bid')
      .populate('bookListing');
    
    res.status(200).json(userResponses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all user responses for a specific book listing
export const getUserResponsesByBookListing = async (req, res) => {
  try {
    const bookListingId = req.params.bookListingId;
    
    // Validate if the book listing exists
    const bookListing = await BookListing.findById(bookListingId);
    if (!bookListing) {
      return res.status(404).json({ message: 'Book listing not found' });
    }
    
    // Find all user responses for this book listing
    const userResponses = await UserResponse.find({ bookListing: bookListingId })
      .populate('bid')
      .populate('bookListing');
    
    res.status(200).json(userResponses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};