import express from 'express';
import mongoose from 'mongoose';
import User from '../models/userModel.js';
import authenticate from '../middlewares/authMiddleware.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Validation middleware
const validateUserUpdate = [
  body('displayName').optional().trim().isLength({ min: 2 }),
  body('contactInfo').optional().isEmail().withMessage('Valid email is required'),
  body('location').optional().trim()
];

// Get current user profile (protected)
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid })
      .populate('booksOwned', 'title author condition available')
      .populate('requestsMade', 'bookWanted status createdAt')
      .select('-__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found in database'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user profile'
    });
  }
});

// Get user by ID (public)
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const user = await User.findById(req.params.id)
      .populate('booksOwned', 'title author condition available')
      .select('-firebaseUid -__v -createdAt -updatedAt');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
});

// Create or update user profile (protected)
router.post('/', authenticate, validateUserUpdate, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { displayName, photoURL, contactInfo, location } = req.body;

    // Upsert the user (create if doesn't exist, update if does)
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      {
        firebaseUid: req.user.uid,
        email: req.user.email,
        displayName: displayName || req.user.name || 'Anonymous',
        photoURL: photoURL || req.user.picture || null,
        contactInfo,
        location
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user profile'
    });
  }
});

// Update user profile (protected)
router.put('/', authenticate, validateUserUpdate, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { displayName, photoURL, contactInfo, location } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      {
        displayName,
        photoURL,
        contactInfo,
        location
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
});

// Delete user account (protected)
router.delete('/', authenticate, async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ firebaseUid: req.user.uid });

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Note: You might want to also delete associated books and requests
    // This would require additional cleanup logic

    res.status(200).json({
      success: true,
      message: 'User account deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user account'
    });
  }
});

export default router;