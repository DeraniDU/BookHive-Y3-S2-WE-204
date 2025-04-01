import express from 'express';
import { Book } from '../models/bookModel.js';

const router = express.Router();

// Create a new book
router.post('/', async (request, response) => {
    console.log("Request Body:", request.body);
    try {
        const { bookTitle, bookGenre, condition, availableDate, comments } = request.body;

        if (!bookTitle || !bookGenre || !condition || !availableDate) {
            return response.status(400).send({
                message: 'Send all required fields: bookTitle, bookGenre, condition, availableDate',
            });
        }

        const newBook = await Book.create({
            bookTitle,
            bookGenre,
            condition,
            availableDate,
            comments,
        });

        return response.status(201).json(newBook);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Get all books
router.get('/', async (request, response) => {
    try {
        const books = await Book.find({});
        return response.status(200).json({ count: books.length, data: books });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Get a book by ID
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const book = await Book.findById(id);
        if (!book) {
            return response.status(404).json({ message: 'Book not found' });
        }
        return response.status(200).json(book);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Update a book
router.put('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const { bookTitle, bookGenre, condition, availableDate, comments } = request.body;

        if (!bookTitle || !bookGenre || !condition || !availableDate) {
            return response.status(400).send({
                message: 'Send all required fields: bookTitle, bookGenre, condition, availableDate',
            });
        }

        const updatedBook = await Book.findByIdAndUpdate(id, request.body, { new: true });

        if (!updatedBook) {
            return response.status(404).json({ message: 'Book not found' });
        }

        return response.status(200).json(updatedBook);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Delete a book
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const deletedBook = await Book.findByIdAndDelete(id);

        if (!deletedBook) {
            return response.status(404).json({ message: 'Book not found' });
        }

        return response.status(200).send({ message: 'Book deleted successfully' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

export default router;
