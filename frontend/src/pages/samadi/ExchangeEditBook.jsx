import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ExchangeEditBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState({
        bookTitle: '',
        bookGenre: '',
        condition: '',
        availableDate: '',
        comments: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        axios.get(`http://localhost:3000/books/${id}`)
            .then(response => {
                const fetchedBook = response.data;
    
                // Convert ISO date to "yyyy-MM-dd"
                if (fetchedBook.availableDate) {
                    fetchedBook.availableDate = fetchedBook.availableDate.split("T")[0];
                }
    
                setBook(fetchedBook);
            })
            .catch(error => console.error("Error fetching book details:", error));
    }, [id]);
    

    const validateForm = () => {
        let tempErrors = {};
        if (!book.bookTitle.trim()) tempErrors.bookTitle = "Book title is required";
        if (!book.bookGenre.trim()) tempErrors.bookGenre = "Book genre is required";
        if (!book.condition.trim()) tempErrors.condition = "Condition is required";
        if (!book.availableDate.trim()) tempErrors.availableDate = "Available date is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        setBook({ ...book, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        axios.put(`http://localhost:3000/books/${id}`, book)
            .then(() => {
                alert("Book updated successfully!");
                navigate("/books");
            })
            .catch(error => console.error("Error updating book:", error));
    };

    return (
        <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2 style={{ textAlign: 'center' }}>Edit Book</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Book Title:</label>
                    <input type="text" name="bookTitle" value={book.bookTitle} onChange={handleChange} style={{ width: '100%', padding: '5px' }} />
                    {errors.bookTitle && <span style={{ color: 'red' }}>{errors.bookTitle}</span>}
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Book Genre:</label>
                    <input type="text" name="bookGenre" value={book.bookGenre} onChange={handleChange} style={{ width: '100%', padding: '5px' }} />
                    {errors.bookGenre && <span style={{ color: 'red' }}>{errors.bookGenre}</span>}
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Condition:</label>
                    <input type="text" name="condition" value={book.condition} onChange={handleChange} style={{ width: '100%', padding: '5px' }} />
                    {errors.condition && <span style={{ color: 'red' }}>{errors.condition}</span>}
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Available Date:</label>
                    <input type="date" name="availableDate" value={book.availableDate} onChange={handleChange} style={{ width: '100%', padding: '5px' }} />
                    {errors.availableDate && <span style={{ color: 'red' }}>{errors.availableDate}</span>}
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Comments:</label>
                    <textarea name="comments" value={book.comments} onChange={handleChange} style={{ width: '100%', padding: '5px' }} />
                </div>

                <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>Update Book</button>
            </form>
        </div>
    );
};

export default ExchangeEditBook;
