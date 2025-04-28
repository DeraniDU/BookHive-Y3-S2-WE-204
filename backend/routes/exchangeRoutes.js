import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import ExchangeModel from "../models/exchangeModel.js";
import { body, validationResult } from "express-validator";
import mongoose from "mongoose";

const router = express.Router();

// Enhanced Cloudinary configuration with validation
if (!process.env.CLOUDINARY_CLOUD_NAME || 
    !process.env.CLOUDINARY_API_KEY || 
    !process.env.CLOUDINARY_API_SECRET) {
  throw new Error("Missing Cloudinary configuration in environment variables");
}

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Improved Multer configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1 
  },
  fileFilter: (req, file, cb) => {
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (validMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, or GIF images are allowed!'), false);
    }
  }
});

// Enhanced validation middleware
const validateBook = [
  body('title').notEmpty().trim().escape().withMessage('Title is required'),
  body('author').notEmpty().trim().escape().withMessage('Author is required'),
  body('genre').isIn(["Fiction", "Non-Fiction", "Biography", "Sci-Fi", "Fantasy", "Mystery"])
    .withMessage('Invalid genre selected'),
  body('condition').isIn(["New", "Like New", "Good", "Fair", "Worn", "Used", "Damaged"])
    .withMessage('Invalid condition specified'),
  body('ownerName').notEmpty().trim().escape().withMessage('Owner name is required'),
  body('contactInfo').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('available').optional().isBoolean(),
  body('location').optional().trim().escape(),
  body('description').optional().trim().escape()
];

// Helper function for Cloudinary upload
const uploadToCloudinary = async (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder: folder,
        resource_type: 'auto',
        quality: 'auto:good'
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(new Error('Failed to upload image to Cloudinary'));
        } else {
          resolve(result);
        }
      }
    );
    
    uploadStream.on('error', (error) => {
      console.error('Upload stream error:', error);
      reject(new Error('Image upload stream failed'));
    });
    
    uploadStream.end(fileBuffer);
  });
};

// Create a new book
router.post("/", upload.single('image'), validateBook, async (req, res) => {
  try {
    // Validate request
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
        console.log(`Uploading image: ${req.file.originalname} (${req.file.size} bytes)`);
        const result = await uploadToCloudinary(req.file.buffer, 'book_exchange');
        
        bookImage = {
          public_id: result.public_id,
          url: result.secure_url
        };
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        return res.status(500).json({ 
          success: false,
          error: 'Image upload failed'
        });
      }
    }

    // Create and save book
    const newBook = new ExchangeModel({
      title,
      author,
      genre,
      description,
      condition,
      ownerName,
      contactInfo,
      available,
      location,
      bookImage
    });

    const savedBook = await newBook.save();
    
    res.status(201).json({ 
      success: true,
      message: "Book added successfully",
      data: savedBook 
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get all exchange books with pagination
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, genre, available } = req.query;
    const query = {};
    
    if (genre) query.genre = genre;
    if (available) query.available = available === 'true';

    const books = await ExchangeModel.find(query)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await ExchangeModel.countDocuments(query);

    res.status(200).json({
      success: true,
      data: books,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch books'
    });
  }
});

// Get single book
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid book ID format'
      });
    }

    const book = await ExchangeModel.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ 
        success: false,
        error: "Book not found" 
      });
    }

    res.status(200).json({ 
      success: true,
      data: book 
    });
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch book'
    });
  }
});

// Update book
router.put("/:id", upload.single('image'), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid book ID format'
      });
    }

    const book = await ExchangeModel.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ 
        success: false,
        error: "Book not found" 
      });
    }

    // Handle image update
    if (req.file) {
      try {
        // Delete old image if exists
        if (book.bookImage?.public_id) {
          await cloudinary.uploader.destroy(book.bookImage.public_id);
        }

        // Upload new image
        const result = await uploadToCloudinary(req.file.buffer, 'book_exchange');
        req.body.bookImage = {
          public_id: result.public_id,
          url: result.secure_url
        };
      } catch (uploadError) {
        console.error('Image update failed:', uploadError);
        return res.status(500).json({ 
          success: false,
          error: 'Image update failed'
        });
      }
    }

    const updatedBook = await ExchangeModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ 
      success: true,
      message: "Book updated successfully",
      data: updatedBook 
    });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update book'
    });
  }
});

// Delete book
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid book ID format'
      });
    }

    const book = await ExchangeModel.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ 
        success: false,
        error: "Book not found" 
      });
    }

    // Delete image from Cloudinary if exists
    if (book.bookImage?.public_id) {
      await cloudinary.uploader.destroy(book.bookImage.public_id);
    }

    await ExchangeModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ 
      success: true,
      message: "Book deleted successfully" 
    });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete book'
    });
  }
});



export default router;