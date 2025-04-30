import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import ExchangeModel from "../models/ExchangeModel.js";
import { body, validationResult } from "express-validator";
import mongoose from "mongoose";
import authenticate from "../middlewares/authMiddleware.js"; // NEW: Import auth middleware

const router = express.Router();

// Cloudinary configuration
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (validMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Validation middleware
const validateBook = [
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('genre').isIn(["Fiction", "Non-Fiction", "Biography", "Sci-Fi", "Fantasy", "Mystery"])
    .withMessage('Invalid genre'),
  body('condition').isIn(["New", "Like New", "Good", "Fair", "Worn", "Used", "Damaged"])
    .withMessage('Invalid condition'),
  body('ownerName').notEmpty().withMessage('Owner name is required'),
  body('contactInfo').notEmpty().withMessage('Contact info is required'),
  body('available').optional().isBoolean(),
  body('location').optional()
];

// Cloudinary upload helper
const uploadToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'book_exchange' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// Create a new book (protected)
router.post('/', authenticate, upload.single('image'), validateBook, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { 
      title, 
      author, 
      genre, 
      description, 
      condition, 
      ownerName, 
      contactInfo, 
      available = true, 
      location 
    } = req.body;
    
    let bookImage = {};
    
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer);
        bookImage = {
          public_id: result.public_id,
          url: result.secure_url
        };
      } catch (error) {
        return res.status(500).json({ 
          success: false,
          error: 'Image upload failed' 
        });
      }
    }

    // Create new book with owner ID
    const newBook = await ExchangeModel.create({
      title,
      author,
      genre,
      description,
      condition,
      ownerName,
      contactInfo,
      available,
      location,
      bookImage,
      ownerId: req.user.uid // NEW: Add owner ID from auth
    });

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: newBook
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Get all books with filtering (public)
router.get('/', async (req, res) => {
  try {
    const { 
      genre, 
      condition, 
      available, 
      search, 
      page = 1, 
      limit = 10 
    } = req.query;

    const filter = {};
    if (genre) filter.genre = genre;
    if (condition) filter.condition = condition;
    if (available) filter.available = available === 'true';
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const books = await ExchangeModel.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await ExchangeModel.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: books.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: books
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Get a book by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid book ID' 
      });
    }

    const book = await ExchangeModel.findById(id);
    if (!book) {
      return res.status(404).json({ 
        success: false,
        message: 'Book not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Update a book (protected to owner only)
router.put('/:id', authenticate, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid book ID' 
      });
    }

    // Only the owner can update
    const book = await ExchangeModel.findOne({
      _id: id,
      ownerId: req.user.uid
    });
    
    if (!book) {
      return res.status(404).json({ 
        success: false,
        message: 'Book not found or unauthorized' 
      });
    }

    // Handle image update
    if (req.file) {
      try {
        if (book.bookImage?.public_id) {
          await cloudinary.uploader.destroy(book.bookImage.public_id);
        }
        const result = await uploadToCloudinary(req.file.buffer);
        req.body.bookImage = {
          public_id: result.public_id,
          url: result.secure_url
        };
      } catch (error) {
        return res.status(500).json({ 
          success: false,
          error: 'Image update failed' 
        });
      }
    }

    const allowedUpdates = [
      'title', 'author', 'genre', 'description', 'condition',
      'ownerName', 'contactInfo', 'available', 'location', 'bookImage'
    ];

    const updates = Object.keys(req.body);
    updates.forEach(update => {
      if (allowedUpdates.includes(update)) {
        book[update] = req.body[update];
      }
    });

    const updatedBook = await book.save();

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: updatedBook
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Delete a book (protected to owner only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid book ID' 
      });
    }

    // Only the owner can delete
    const book = await ExchangeModel.findOne({
      _id: id,
      ownerId: req.user.uid
    });
    
    if (!book) {
      return res.status(404).json({ 
        success: false,
        message: 'Book not found or unauthorized' 
      });
    }

    if (book.bookImage?.public_id) {
      await cloudinary.uploader.destroy(book.bookImage.public_id);
    }

    await ExchangeModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

export default router;