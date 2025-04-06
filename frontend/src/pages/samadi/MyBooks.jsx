import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { FaEdit, FaTrash, FaFilter, FaPlus, FaSync, FaExchangeAlt } from 'react-icons/fa';
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/exchange', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setBooks(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to fetch your books. Please try again.');
        setLoading(false);
      }
    };

    fetchMyBooks();
  }, []);

  const handleEdit = (id) => {
    navigate(`/exchange/edit/${id}`);
  };

  const handleDelete = (id) => {
    navigate(`/exchange/delete/${id}`);
  };

  const filteredBooks = books.filter(book => {
    if (filter === 'all') return true;
    if (filter === 'available') return book.available;
    return !book.available;
  });

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading your books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorText}>{error}</p>
        <button
          style={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          <FaSync style={{ marginRight: '8px' }} />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div style={styles.container}>
        <h1 style={styles.title}>My Book Collection</h1>
        
        <div style={styles.actionBar}>
          <div style={styles.filterContainer}>
            <FaFilter style={styles.filterIcon} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="all">All Books</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
          
          <button
            style={styles.viewRequestsButton}
            onClick={() => navigate('/request/viewrequest')}
          >
            <FaExchangeAlt style={{ marginRight: '8px' }} />
            My Exchange Requests
          </button>
        </div>

        {filteredBooks.length === 0 ? (
          <div style={styles.emptyContainer}>
            <p style={styles.emptyText}>You haven't added any books yet.</p>
            <button
              style={styles.addButton}
              onClick={() => navigate('/exchange/add')}
            >
              <FaPlus style={{ marginRight: '8px' }} />
              Add Your First Book
            </button>
          </div>
        ) : (
          <div style={styles.booksGrid}>
            {filteredBooks.map(book => (
              <div key={book._id} style={styles.bookCard}>
                <div style={styles.cardHeader}>
                  <span style={book.available ? styles.availableBadge : styles.unavailableBadge}>
                    {book.available ? 'Available' : 'Unavailable'}
                  </span>
                  <span style={styles.dateAdded}>
                    Added: {format(new Date(book.createdAt), 'MMM dd, yyyy')}
                  </span>
                </div>

                {book.bookImage?.url && (
                  <img
                    src={book.bookImage.url}
                    alt={book.title}
                    style={styles.bookImage}
                    onClick={() => navigate(`/books/${book._id}`)}
                  />
                )}

                <div style={styles.bookInfo}>
                  <h3 style={styles.bookTitle}>{book.title}</h3>
                  <p style={styles.bookAuthor}>by {book.author}</p>
                  <p style={styles.bookGenre}>{book.genre}</p>
                  <p style={styles.bookCondition}>Condition: {book.condition}</p>

                  {book.description && (
                    <p style={styles.bookDescription}>
                      {book.description.length > 100
                        ? `${book.description.substring(0, 100)}...`
                        : book.description}
                    </p>
                  )}
                </div>

                <div style={styles.actionButtons}>
                  <button
                    style={styles.editButton}
                    onClick={() => handleEdit(book._id)}
                    title="Edit book"
                  >
                    <FaEdit />
                  </button>
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDelete(book._id)}
                    title="Delete book"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '30px',
    fontSize: '2.2rem',
    fontWeight: '600',
  },
  actionBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '15px',
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  filterIcon: {
    marginRight: '10px',
    color: '#34495e',
    fontSize: '1rem',
  },
  filterSelect: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #bdc3c7',
    fontSize: '0.9rem',
    backgroundColor: '#f8f9fa',
  },
  viewRequestsButton: {
    padding: '10px 20px',
    backgroundColor: '#9b59b6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: '#8e44ad',
    },
  },
  booksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '25px',
    marginTop: '20px',
  },
  bookCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    },
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 15px',
    backgroundColor: '#f1f3f5',
    borderBottom: '1px solid #e9ecef',
  },
  availableBadge: {
    backgroundColor: '#2ecc71',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  unavailableBadge: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  dateAdded: {
    fontSize: '0.75rem',
    color: '#7f8c8d',
  },
  bookImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderBottom: '1px solid #e9ecef',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
    ':hover': {
      opacity: 0.9,
    },
  },
  bookInfo: {
    padding: '15px',
    flexGrow: 1,
  },
  bookTitle: {
    margin: '0 0 5px 0',
    color: '#2c3e50',
    fontSize: '1.2rem',
    fontWeight: '600',
  },
  bookAuthor: {
    margin: '0 0 10px 0',
    color: '#7f8c8d',
    fontSize: '0.9rem',
    fontStyle: 'italic',
  },
  bookGenre: {
    margin: '0 0 5px 0',
    color: '#3498db',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  bookCondition: {
    margin: '0 0 10px 0',
    color: '#34495e',
    fontSize: '0.85rem',
  },
  bookDescription: {
    margin: '10px 0 0 0',
    color: '#34495e',
    fontSize: '0.9rem',
    lineHeight: '1.4',
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px',
    borderTop: '1px solid #e9ecef',
  },
  editButton: {
    padding: '10px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: '#2980b9',
    },
  },
  deleteButton: {
    padding: '10px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: '#c0392b',
    },
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
  },
  spinner: {
    border: '4px solid rgba(0, 0, 0, 0.1)',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    borderLeftColor: '#3498db',
    animation: 'spin 1s linear infinite',
    marginBottom: '15px',
  },
  loadingText: {
    color: '#7f8c8d',
    fontSize: '1.1rem',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: '1.1rem',
    marginBottom: '20px',
  },
  retryButton: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    ':hover': {
      backgroundColor: '#2980b9',
    },
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50vh',
    textAlign: 'center',
  },
  emptyText: {
    color: '#7f8c8d',
    fontSize: '1.2rem',
    marginBottom: '20px',
  },
  addButton: {
    padding: '12px 25px',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'background-color 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    ':hover': {
      backgroundColor: '#27ae60',
    },
  },
};

export default MyBooks;