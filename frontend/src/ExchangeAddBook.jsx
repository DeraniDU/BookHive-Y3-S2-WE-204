import React, { useState } from 'react';

const ExchangeAddBook = () => {
  const [formData, setFormData] = useState({
    bookTitle: '',
    bookGenre: '',
    condition: '',
    exchangeBook: '',
    availableDate: '',
    comments: '',
    bookImage: null,
  });

  const [formStatus, setFormStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, bookImage: file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.bookTitle || !formData.bookGenre || !formData.exchangeBook || !formData.condition || !formData.availableDate) {
      setFormStatus('Please fill in all required fields.');
      return;
    }
    
    setTimeout(() => {
      setFormStatus('✅ Your Book Exchange Request has been submitted successfully!');
      setFormData({
        bookTitle: '',
        bookGenre: '',
        condition: '',
        exchangeBook: '',
        availableDate: '',
        comments: '',
        bookImage: null,
      });
    }, 1000);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>📚 Add Your Book to the Exchange Marketplace</h1>
      <p style={styles.subtitle}>Submit a request to exchange your book with others.</p>
      {formStatus && <p style={styles.status}>{formStatus}</p>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Book Title</label>
          <input type="text" name="bookTitle" value={formData.bookTitle} onChange={handleChange} style={styles.input} required />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Book Genre</label>
          <select name="bookGenre" value={formData.bookGenre} onChange={handleChange} style={styles.select} required>
            <option value="">Select Genre</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Biography">Biography</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Mystery">Mystery</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Book Condition</label>
          <select name="condition" value={formData.condition} onChange={handleChange} style={styles.select} required>
            <option value="">Select Condition</option>
            <option value="New">New</option>
            <option value="Like New">Like New</option>
            <option value="Used">Used</option>
            <option value="Damaged">Damaged</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Book You Want in Exchange</label>
          <input type="text" name="exchangeBook" value={formData.exchangeBook} onChange={handleChange} style={styles.input} required />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Available Date for Exchange</label>
          <input type="date" name="availableDate" value={formData.availableDate} onChange={handleChange} style={styles.input} required />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Upload Book Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} style={styles.input} />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Additional Comments</label>
          <textarea name="comments" value={formData.comments} onChange={handleChange} style={styles.textarea} />
        </div>

        <div style={styles.buttonContainer}>
          <button type="submit" style={styles.submitButton}>🚀 Add Book</button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#e3f2fd',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
    fontSize: '30px',
    color: '#1e88e5',
    marginBottom: '10px',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#333',
    marginBottom: '20px',
  },
  form: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #bbb',
    fontSize: '16px',
    color: '#333',
  },
  select: {
    width: '100%',
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #bbb',
    fontSize: '16px',
    color: '#333',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #bbb',
    fontSize: '16px',
    height: '100px',
  },
  buttonContainer: {
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#1e88e5',
    color: '#fff',
    padding: '14px 30px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.3s ease',
  },
  status: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#2e7d32',
    marginBottom: '20px',
    fontWeight: 'bold',
  },
};

export default ExchangeAddBook;
