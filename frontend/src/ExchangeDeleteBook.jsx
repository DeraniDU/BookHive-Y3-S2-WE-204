//code have some mistake correct it
import React, { useState } from 'react';

const ExchangeDeleteBook = ({ bookId, onDelete }) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirmation(true); // Show confirmation dialog
  };

  const handleDelete = () => {
    setIsLoading(true);
    // Simulate a book deletion request (Replace this with your API call for deletion)
    setTimeout(() => {
      setIsDeleted(true);
      setIsLoading(false);
      onDelete(bookId); // Update parent component state after deletion
    }, 1000);
  };

  const handleCancel = () => {
    setShowConfirmation(false); // Hide confirmation dialog if canceled
  };

  return (
    <div style={styles.container}>
      {!isDeleted ? (
        <>
          {!showConfirmation ? (
            <div style={styles.actionContainer}>
              <p style={styles.text}>Are you sure you want to delete this book from the exchange?</p>
              <button
                onClick={handleDeleteClick}
                style={styles.deleteButton}
                aria-label="Delete Book"
              >
                Yes, Delete
              </button>
              <button
                onClick={handleCancel}
                style={styles.cancelButton}
                aria-label="Cancel"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div style={styles.confirmationContainer}>
              <p style={styles.confirmationText}>Are you sure you want to delete this book? This action cannot be undone.</p>
              <button
                onClick={handleDelete}
                style={styles.confirmButton}
                disabled={isLoading}
                aria-label="Confirm Delete"
              >
                {isLoading ? 'Deleting...' : 'Confirm Delete'}
              </button>
              <button
                onClick={handleCancel}
                style={styles.cancelButton}
                aria-label="Cancel Delete"
              >
                Cancel
              </button>
            </div>
          )}
        </>
      ) : (
        <p style={styles.successText}>Your book has been successfully deleted!</p>
      )}
    </div>
  );
};

// Default prop for onDelete to avoid errors if it's not provided
ExchangeDeleteBook.defaultProps = {
  onDelete: () => {},
};

// Parent Component
const ParentComponent = () => {
  // Function to handle book deletion logic
  const handleDelete = (bookId) => {
    console.log(`Book with ID ${bookId} deleted`);
    // Perform further actions like updating state, making API calls, etc.
  };

  return (
    <div>
      <h1>Book Exchange</h1>
      <ExchangeDeleteBook
        bookId={123} // Pass the actual book ID here
        onDelete={handleDelete} // Pass the delete handler function
      />
    </div>
  );
};

// Styles for the components
const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f4f4f9',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContainer: {
    textAlign: 'center',
  },
  text: {
    fontSize: '16px',
    color: '#333',
    marginBottom: '20px',
  },
  deleteButton: {
    backgroundColor: '#FF4C4C',
    color: 'white',
    padding: '12px 25px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    margin: '10px',
  },
  cancelButton: {
    backgroundColor: '#cccccc',
    color: '#333',
    padding: '12px 25px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    margin: '10px',
  },
  confirmationContainer: {
    padding: '20px',
    textAlign: 'center',
  },
  confirmationText: {
    fontSize: '16px',
    color: '#333',
    marginBottom: '20px',
  },
  confirmButton: {
    backgroundColor: '#FF4C4C',
    color: 'white',
    padding: '12px 25px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginBottom: '10px',
  },
  successText: {
    fontSize: '16px',
    color: '#28a745',
    textAlign: 'center',
    marginTop: '20px',
  },
};

export default ParentComponent;
