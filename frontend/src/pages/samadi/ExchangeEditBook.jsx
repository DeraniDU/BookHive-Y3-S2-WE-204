import React, { useState } from 'react';
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const ExchangeBookEdit = () => {
  const [formData, setFormData] = useState({
    bookTitle: 'Atomic Habits',
    bookGenre: 'Fiction',
    condition: 'New',
    availableDate: '2025-04-01', // Hardcoded value for available date
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

    if (!formData.bookTitle) {
      errors.bookTitle = 'Please enter the book title.';
      isValid = false;
    }

    if (!formData.bookGenre) {
      errors.bookGenre = 'Please select a book genre.';
      isValid = false;
    }

    if (!formData.condition) {
      errors.condition = 'Please select the book condition.';
      isValid = false;
    }

    const selectedDate = new Date(formData.availableDate);
    const today = new Date();
    if (!formData.availableDate) {
      errors.availableDate = 'Please select an available date.';
      isValid = false;
    } else if (selectedDate <= today) {
      errors.availableDate = 'Please select a future date.';
      isValid = false;
    }

    if (!formData.bookImage) {
      errors.bookImage = 'Please upload a book image.';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setShowPopup(true);
      setIsSubmitting(false);

      setFormData({
        bookTitle: '',
        bookGenre: '',
        condition: '',
        availableDate: '',
        bookImage: null,
        comments: '',
      });

      document.getElementById("bookImageInput").value = "";
    }, 1000);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      <Header />
      <div style={{ padding: '20px', backgroundColor: '#f4f4f9', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
        <h1 style={{ textAlign: 'center', fontSize: '30px', color: '#3f51b5', marginBottom: '10px' }}>Admin Panel: Update Book Information</h1>
        <p style={{ textAlign: 'center', fontSize: '16px', color: '#333', marginBottom: '20px' }}> Update the details for the selected book below!</p>

        {showPopup && (
          <div style={{
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
          }}>
            <div style={{
              backgroundColor: '#fff',
              padding: '30px',
              borderRadius: '10px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}>
              <p style={{ fontSize: '20px', color: '#333', fontWeight: 'bold', marginBottom: '20px' }}>
                ✅  Success! Your book has been successfully updated!
              </p>
              <button style={{
                backgroundColor: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                padding: '12px 25px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background-color 0.3s',
              }} onClick={handleClosePopup}>
                OK
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>Book Title</label>
            <input 
              type="text" 
              name="bookTitle" 
              value={formData.bookTitle} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #bbb', fontSize: '16px', color: '#333' }} 
              placeholder="Enter the book title" 
            />
            {formErrors.bookTitle && <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{formErrors.bookTitle}</p>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>Book Genre</label>
            <select 
              name="bookGenre" 
              value={formData.bookGenre} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #bbb', fontSize: '16px', color: '#333' }}
            >
              <option value="">Select Genre</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Biography">Biography</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Mystery">Mystery</option>
            </select>
            {formErrors.bookGenre && <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{formErrors.bookGenre}</p>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>Condition</label>
            <select 
              name="condition" 
              value={formData.condition} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #bbb', fontSize: '16px', color: '#333' }}
            >
              <option value="">Select Condition</option>
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Used">Used</option>
              <option value="Damaged">Damaged</option>
            </select>
            {formErrors.condition && <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{formErrors.condition}</p>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>Available Date for Exchange</label>
            <input 
              type="date" 
              name="availableDate" 
              value={formData.availableDate} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #bbb', fontSize: '16px', color: '#333' }} 
            />
            {formErrors.availableDate && <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{formErrors.availableDate}</p>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>Upload Book Image</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #bbb', fontSize: '16px', color: '#333' }} 
              id="bookImageInput"
            />
            {formErrors.bookImage && <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{formErrors.bookImage}</p>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>Additional Comments</label>
            <textarea 
              name="comments" 
              value={formData.comments} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #bbb', fontSize: '16px', height: '100px' }} 
              placeholder="Any additional details about your book"
            />
          </div>

          <div style={{ textAlign: 'center' }}>
            <button 
              type="submit" 
              style={isSubmitting ? { backgroundColor: '#3f51b5', color: '#fff', padding: '14px 30px', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'not-allowed', opacity: 0.6 } : { backgroundColor: '#3f51b5', color: '#fff', padding: '14px 30px', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' }} 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ExchangeBookEdit;
