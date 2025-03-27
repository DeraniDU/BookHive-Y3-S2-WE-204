import React, { useState, useEffect } from 'react';

// ExchangeEditBook Component
const ExchangeEditBook = ({ initialBookData = {}, onSubmit }) => {
  const [bookTitle, setBookTitle] = useState(initialBookData.bookTitle || "");
  const [bookGenre, setBookGenre] = useState(initialBookData.bookGenre || "");
  const [condition, setCondition] = useState(initialBookData.condition || "");
  const [exchangeBook, setExchangeBook] = useState(initialBookData.exchangeBook || "");
  const [availableDate, setAvailableDate] = useState(initialBookData.availableDate || "");
  const [comments, setComments] = useState(initialBookData.comments || "");
  const [bookImage, setBookImage] = useState(initialBookData.bookImage || null);

  // Handle image selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBookImage(URL.createObjectURL(file)); // Preview the selected image
    }
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    const updatedBookData = {
      bookTitle,
      bookGenre,
      condition,
      exchangeBook,
      availableDate,
      comments,
      bookImage,
    };

    // Call the onSubmit function passed from the parent component
    onSubmit(updatedBookData);
  };

  useEffect(() => {
    // If initialBookData is loaded asynchronously, this effect ensures it's used
    if (initialBookData) {
      setBookTitle(initialBookData.bookTitle || "");
      setBookGenre(initialBookData.bookGenre || "");
      setCondition(initialBookData.condition || "");
      setExchangeBook(initialBookData.exchangeBook || "");
      setAvailableDate(initialBookData.availableDate || "");
      setComments(initialBookData.comments || "");
      setBookImage(initialBookData.bookImage || null);
    }
  }, [initialBookData]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Edit Book Details</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="bookTitle" style={styles.label}>Book Title</label>
          <input
            type="text"
            id="bookTitle"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            placeholder="Enter book title"
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="bookGenre" style={styles.label}>Book Genre</label>
          <input
            type="text"
            id="bookGenre"
            value={bookGenre}
            onChange={(e) => setBookGenre(e.target.value)}
            placeholder="Enter book genre"
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="condition" style={styles.label}>Condition</label>
          <select
            id="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            required
            style={styles.select}
          >
            <option value="">Select condition</option>
            <option value="New">New</option>
            <option value="Like New">Like New</option>
            <option value="Used">Used</option>
            <option value="Damaged">Damaged</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="exchangeBook" style={styles.label}>Book to Exchange</label>
          <input
            type="text"
            id="exchangeBook"
            value={exchangeBook}
            onChange={(e) => setExchangeBook(e.target.value)}
            placeholder="Enter book for exchange"
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="availableDate" style={styles.label}>Available Date</label>
          <input
            type="date"
            id="availableDate"
            value={availableDate}
            onChange={(e) => setAvailableDate(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="comments" style={styles.label}>Comments</label>
          <textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Any additional comments?"
            style={styles.textarea}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="bookImage" style={styles.label}>Book Image</label>
          <input
            type="file"
            id="bookImage"
            accept="image/*"
            onChange={handleImageChange}
            style={styles.input}
          />
          {bookImage && <img src={bookImage} alt="Book preview" style={styles.imagePreview} />}
        </div>

        <button type="submit" style={styles.submitBtn}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

// ParentComponent
const ParentComponent = () => {
  const [bookData, setBookData] = useState({
    bookTitle: 'Sample Book',
    bookGenre: 'Fiction',
    condition: 'New',
    exchangeBook: 'Another Book',
    availableDate: '2025-04-01',
    comments: 'Great condition',
    bookImage: null,
  });

  const handleBookDataSubmit = (updatedBookData) => {
    console.log('Updated Book Data:', updatedBookData);
    setBookData(updatedBookData); // Update the state with the new data
  };

  return (
    <div>
      <ExchangeEditBook initialBookData={bookData} onSubmit={handleBookDataSubmit} />
    </div>
  );
};

// Inline CSS styles
const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f4f4f9',
    borderRadius: '8px',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    fontSize: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#555',
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
    width: '100%',
  },
  select: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
    width: '100%',
  },
  textarea: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
    width: '100%',
    height: '100px',
  },
  imagePreview: {
    marginTop: '10px',
    maxWidth: '100%',
    maxHeight: '200px',
    objectFit: 'contain',
  },
  submitBtn: {
    padding: '12px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  submitBtnHover: {
    backgroundColor: '#45a049',
  },
};

export default ParentComponent;
