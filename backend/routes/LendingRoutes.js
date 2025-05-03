import express from 'express';
import multer from 'multer';
import streamifier from 'streamifier';
import { v2 as cloudinary } from 'cloudinary';
import Book from '../models/book.js';
import config from '../config.js';

const router = express.Router();
cloudinary.config(config.cloudinary);

// Multer setup - store file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('image'), async (req, res) => {
    try {
      const { title, author, bookType, availableArea, review, userId } = req.body;
  
      let imageUrl = "";
  
      if (req.file) {
        // Upload image to Cloudinary using stream
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'BookHive' },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
  
          streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
        });
  
        imageUrl = result.secure_url;
      }
  
      const newBook = new Book({
        title,
        author,
        bookType,
        availableArea,
        review,
        userId,
        imageUrl
      });
  
      const savedBook = await newBook.save();
      res.status(201).json({ success: true, book: savedBook });
    } catch (err) {
      console.error('Book creation failed:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  });

  //get all books

  router.get('/', async (req, res) => {
    try {
      const books = await Book.find(); // fetch all books from MongoDB
      res.status(200).json({ success: true, books });
    } catch (error) {
      console.error('Failed to fetch books:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // DELETE /api/Lendbook/:id
router.delete('/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.json({ success: true, message: 'Book deleted' });
  } catch (error) {
    console.error('Delete error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/Lendbook/:id
router.put('/:id', async (req, res) => {
  try {
    const { title, author, bookType, availableArea, review } = req.body;

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, bookType, availableArea, review },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.json({ success: true, book: updatedBook });
  } catch (error) {
    console.error('Update error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});


  export default router;
