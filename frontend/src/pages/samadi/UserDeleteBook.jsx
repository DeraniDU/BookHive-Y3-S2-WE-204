import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaTrash, FaTimes } from 'react-icons/fa';
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const UserDeleteBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/exchange/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setBook(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching book:', err);
        setError('Failed to fetch book details. Please try again.');
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/exchange/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      navigate('/exchange/mybooks');
    } catch (err) {
      console.error('Error deleting book:', err);
      setError('Failed to delete book. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading book details...</div>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => navigate('/my-books')}>Back to My Books</button>
      </div>
    );
  }

  if (!book) {
    return <div>Book not found</div>;
  }

  return (
    <div>
      <Header />
      <div style={styles.container}>
        <h1 style={styles.title}>Delete Book</h1>

        <div style={styles.confirmationBox}>
          <p style={styles.confirmationText}>
            Are you sure you want to delete <strong>{book.title}</strong> by {book.author}?
          </p>

          {book.bookImage?.url && (
            <img
              src={book.bookImage.url}
              alt={book.title}
              style={styles.bookImage}
            />
          )}

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.buttonGroup}>
            <button
              onClick={handleDelete}
              style={styles.deleteButton}
            >
              <FaTrash style={{ marginRight: '8px' }} />
              Confirm Delete
            </button>
            <button
              onClick={() => navigate('/exchange/mybooks')}
              style={styles.cancelButton}
            >
              <FaTimes style={{ marginRight: '8px' }} />
              Cancel
            </button>
          </div>
        </div>
      </div>
    <Footer />
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '30px',
  },
  confirmationBox: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  confirmationText: {
    fontSize: '18px',
    marginBottom: '20px',
    color: '#34495e',
  },
  bookImage: {
    maxWidth: '200px',
    maxHeight: '300px',
    margin: '0 auto 20px',
    display: 'block',
    borderRadius: '4px',
  },
  error: {
    color: '#e74c3c',
    marginBottom: '20px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginTop: '30px',
  },
  deleteButton: {
    padding: '12px 25px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: '#c0392b',
    },
  },
  cancelButton: {
    padding: '12px 25px',
    backgroundColor: '#7f8c8d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: '#34495e',
    },
  },
};

export default UserDeleteBook;