import React, { useState } from 'react';
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const BookExchangeForm = () => {
  const [formData, setFormData] = useState({
    bookTitle: '',
    bookGenre: '',
    condition: '',
    availableDate: '',
    bookImage: null,
    comments: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [formErrors, setFormErrors] = useState({
    availableDate: '',
    bookImage: '',
    bookTitle: '',
    bookGenre: '',
    condition: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      bookImage: file
    });
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    // Validate book title (must not be empty)
    if (!formData.bookTitle) {
      errors.bookTitle = 'Please enter the book title.';
      isValid = false;
    }

    // Validate book genre (must be selected)
    if (!formData.bookGenre) {
      errors.bookGenre = 'Please select a book genre.';
      isValid = false;
    }

    // Validate condition (must be selected)
    if (!formData.condition) {
      errors.condition = 'Please select the book condition.';
      isValid = false;
    }

    // Validate available date (must be in the future)
    const selectedDate = new Date(formData.availableDate);
    const today = new Date();

    if (!formData.availableDate) {
      errors.availableDate = 'Please select an available date.';
      isValid = false;
    } else if (selectedDate <= today) {
      errors.availableDate = 'Please select a future date.';
      isValid = false;
    }

    // Validate book image (must be uploaded)
    if (!formData.bookImage) {
      errors.bookImage = 'Please upload a book image.';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Stop form submission if validation fails

    setIsSubmitting(true);

    // Simulate form submission and show success popup
    setTimeout(() => {
      setShowPopup(true);
      setIsSubmitting(false);

      // Reset the form data after successful submission
      setFormData({
        bookTitle: '',
        bookGenre: '',
        condition: '',
        availableDate: '',
        bookImage: null, // Reset the image as well
        comments: '',
      });

      // Reset the file input element
      document.getElementById("bookImageInput").value = "";
    }, 1000);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      <Header />
      <div style={styles.container}>
        <h1 style={styles.heading}>📚 Add Your Book for Exchange</h1>
        <p style={styles.subtitle}>Share your book with the community and exchange for one that suits you!</p>

        {showPopup && (
          <div style={styles.popup}>
            <div style={styles.popupContent}>
              <p style={styles.popupMessage}>✅ Your Book has been successfully added to the Exchange Marketplace!</p>
              <button style={styles.popupButton} onClick={handleClosePopup}>OK</button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>

          <div style={styles.formGroup}>
            <label style={styles.label}>Book Title</label>
            <input 
              type="text" 
              name="bookTitle" 
              value={formData.bookTitle} 
              onChange={handleChange} 
              style={styles.input} 
              placeholder="Enter the book title" 
            />
            {formErrors.bookTitle && <p style={styles.error}>{formErrors.bookTitle}</p>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Book Genre</label>
            <select 
              name="bookGenre" 
              value={formData.bookGenre} 
              onChange={handleChange} 
              style={styles.select}
            >
              <option value="">Select Genre</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Biography">Biography</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Mystery">Mystery</option>
            </select>
            {formErrors.bookGenre && <p style={styles.error}>{formErrors.bookGenre}</p>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Condition</label>
            <select 
              name="condition" 
              value={formData.condition} 
              onChange={handleChange} 
              style={styles.select}
            >
              <option value="">Select Condition</option>
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Used">Used</option>
              <option value="Damaged">Damaged</option>
            </select>
            {formErrors.condition && <p style={styles.error}>{formErrors.condition}</p>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Available Date for Exchange</label>
            <input 
              type="date" 
              name="availableDate" 
              value={formData.availableDate} 
              onChange={handleChange} 
              style={styles.input} 
            />
            {formErrors.availableDate && <p style={styles.error}>{formErrors.availableDate}</p>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Upload Book Image</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              style={styles.input} 
              id="bookImageInput"
            />
            {formErrors.bookImage && <p style={styles.error}>{formErrors.bookImage}</p>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Additional Comments</label>
            <textarea 
              name="comments" 
              value={formData.comments} 
              onChange={handleChange} 
              style={styles.textarea} 
              placeholder="Any additional details about your book"
            />
          </div>

          <div style={styles.buttonContainer}>
            <button 
              type="submit" 
              style={isSubmitting ? { ...styles.submitButton, cursor: 'not-allowed', opacity: 0.6 } : styles.submitButton} 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Add Book to Marketplace'}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f4f4f9',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
    fontSize: '30px',
    color: '#3f51b5',
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
    backgroundColor: '#3f51b5',
    color: '#fff',
    padding: '14px 30px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontSize: '12px',
    marginTop: '5px',
  },
  popup: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    animation: 'fadeIn 0.3s ease',
  },
  popupContent: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  },
  popupMessage: {
    fontSize: '20px',
    color: '#333',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  popupButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '12px 25px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
};

export default BookExchangeForm;
