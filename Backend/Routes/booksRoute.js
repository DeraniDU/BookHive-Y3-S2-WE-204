import express from 'express';
import { Book } from '../Models/bookModel.js';


const router = express.Router();

// Route for saving a new book
router.post('/', async (request, response) => {
    try {
        if (
            !request.body.title ||
            !request.body.author ||
            !request.body.genre ||
            !request.body.ISBN ||
            !request.body.publisher
        ) {
            return response.status(400).send({
                message: 'Send all required fields: title, author, genre, ISBN, publisher',
            });
        }

        const newBook = {
            title: request.body.title,
            author: request.body.author,
            genre: request.body.genre,
            ISBN: request.body.ISBN,
            publisher: request.body.publisher,
        };

        const createdBook = await Book.create(newBook);
        return response.status(201).send(createdBook);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for getting all books from the database
router.get('/', async (request, response) => {
    try {
        const books = await Book.find({});
        return response.status(200).json({
            count: books.length,
            data: books,
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for getting one book from the database by id
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const foundBook = await Book.findById(id);
        if (!foundBook) {
            return response.status(404).json({ message: 'Book not found' });
        }

        return response.status(200).json(foundBook);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for updating a book
router.put('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        if (
            !request.body.title ||
            !request.body.author ||
            !request.body.genre ||
            !request.body.ISBN ||
            !request.body.publisher
        ) {
            return response.status(400).send({
                message: 'Send all required fields: title, author, genre, ISBN, publisher',
            });
        }

        const updatedBook = await Book.findByIdAndUpdate(id, request.body, { new: true });

        if (!updatedBook) {
            return response.status(404).json({ message: 'Book not found' });
        }

        return response.status(200).send({ message: 'Book updated successfully' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for deleting a book
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const result = await Book.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({ message: 'Book not found' });
        }

        return response.status(200).send({ message: 'Book deleted successfully' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

export default router;
