import express from 'express';
import BookRequest from '../models/BookRequest.js';
import authenticate from '../middlewares/authMiddleware.js'; // NEW: Import auth middleware

const router = express.Router();

// Create a new book exchange request (now protected)
router.post('/', authenticate, async (req, res) => {
  try {
    const { bookOffered, bookWanted, condition, notes, ownerId } = req.body;

    // Basic validation
    if (!bookOffered || !bookWanted || !condition || !ownerId) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const newRequest = new BookRequest({ 
      bookOffered, 
      bookWanted, 
      condition, 
      notes,
      requestedBy: req.user.uid, // NEW: Add user ID from auth
      ownerId
    });

    await newRequest.save();

    res.status(201).json({ 
      message: 'Exchange request submitted successfully!', 
      data: newRequest 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Get all book exchange requests (protected)
router.get('/', authenticate, async (req, res) => {
  try {
    // Only show requests involving the current user
    const requests = await BookRequest.find({
      $or: [
        { requestedBy: req.user.uid },
        { ownerId: req.user.uid }
      ]
    });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Get a single book exchange request by ID (protected)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const request = await BookRequest.findOne({
      _id: req.params.id,
      $or: [
        { requestedBy: req.user.uid },
        { ownerId: req.user.uid }
      ]
    });

    if (!request) {
      return res.status(404).json({ 
        message: 'Request not found or unauthorized' 
      });
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Update a book exchange request (protected to owner only)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedRequest = await BookRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({ message: 'Request updated successfully', data: updatedRequest });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a book exchange request (protected to requester only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    // Only the requester can delete
    const deletedRequest = await BookRequest.findOneAndDelete({
      _id: req.params.id,
      requestedBy: req.user.uid
    });

    if (!deletedRequest) {
      return res.status(404).json({ 
        message: 'Request not found or unauthorized' 
      });
    }

    res.status(200).json({ 
      message: 'Request deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

export default router;