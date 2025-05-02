import UserResponse from '../models/UserResponse.js';
import Bid from '../models/Bid.js';
import BookListing from '../models/BookListing.js';

// Get all user responses
export const getAllUserResponses = async (req, res) => {
  try {
    const userResponses = await UserResponse.find()
      .populate('userId', 'username email')
      .populate('bidId')
      .populate('bookListingId');
    res.status(200).json(userResponses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single user response by ID
export const getUserResponseById = async (req, res) => {
  try {
    const userResponse = await UserResponse.findById(req.params.id)
      .populate('userId', 'username email')
      .populate('bidId')
      .populate('bookListingId');
    
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
    const { userId, bidId, bookListingId, response } = req.body;

    // Validate required fields
    if (!userId || !response) {
      return res.status(400).json({ message: 'User ID and response are required' });
    }

    // Validate that either bidId or bookListingId is provided
    if (!bidId && !bookListingId) {
      return res.status(400).json({ message: 'Either bid ID or book listing ID must be provided' });
    }

    const newUserResponse = new UserResponse({
      userId,
      bidId,
      bookListingId,
      response
    });

    const savedUserResponse = await newUserResponse.save();
    res.status(201).json(savedUserResponse);
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
    ).populate('userId', 'username email')
     .populate('bidId')
     .populate('bookListingId');

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

    const userResponses = await UserResponse.find({ bidId })
      .populate('userId', 'username email')
      .populate('bidId')
      .populate('bookListingId');

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

    const userResponses = await UserResponse.find({ bookListingId })
      .populate('userId', 'username email')
      .populate('bidId')
      .populate('bookListingId');

    res.status(200).json(userResponses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};