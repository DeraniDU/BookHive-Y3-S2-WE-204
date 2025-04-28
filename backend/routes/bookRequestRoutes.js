import express from 'express';
import BookRequest from '../models/BookRequest.js';

const router = express.Router();

// ✅ Create a new book exchange request
router.post('/', async (req, res) => {
  try {
    const { bookOffered, bookWanted, condition, notes } = req.body;

    // Basic validation
    if (!bookOffered || !bookWanted || !condition) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const newRequest = new BookRequest({ bookOffered, bookWanted, condition, notes });
    await newRequest.save();

    res.status(201).json({ message: 'Exchange request submitted successfully!', data: newRequest });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ✅ Get all book exchange requests
router.get('/', async (req, res) => {
  try {
    const requests = await BookRequest.find();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ✅ Get a single book exchange request by ID
router.get('/:id', async (req, res) => {
  try {
    const request = await BookRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ✅ Update a book exchange request (Approve/Reject)
router.put('/:id', async (req, res) => {
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

// ✅ Delete a book exchange request
router.delete('/:id', async (req, res) => {
  try {
    const deletedRequest = await BookRequest.findByIdAndDelete(req.params.id);
    if (!deletedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router; // Exporting the router as default
