import React, { useState } from 'react';

const ExchangeRequestForm = () => {
  const [bookOffered, setBookOffered] = useState('');
  const [bookWanted, setBookWanted] = useState('');
  const [condition, setCondition] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!bookOffered.trim()) {
      newErrors.bookOffered = 'Please enter the title of the book you are offering.';
    }
    if (!bookWanted.trim()) {
      newErrors.bookWanted = 'Please enter the title of the book you want.';
    }
    if (!condition) {
      newErrors.condition = 'Please select the condition of the book.';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      // Here you can add the API request or form submission logic
      console.log('Request submitted', { bookOffered, bookWanted, condition, notes });
      
      // Show the success modal
      setShowSuccessModal(true);
      
      // Clear the form after submission
      setBookOffered('');
      setBookWanted('');
      setCondition('');
      setNotes('');
    }
  };

  const closeModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Book Exchange Request</h2>
      
      <form onSubmit={handleSubmit} noValidate>
        <div style={styles.field}>
          <label htmlFor="bookOffered" style={styles.label}>Book You Are Offering</label>
          <input
            type="text"
            id="bookOffered"
            placeholder="Enter book title"
            value={bookOffered}
            onChange={(e) => setBookOffered(e.target.value)}
            style={styles.input}
          />
          {errors.bookOffered && <span style={styles.error}>{errors.bookOffered}</span>}
        </div>
        
        <div style={styles.field}>
          <label htmlFor="bookWanted" style={styles.label}>Book You Want</label>
          <input
            type="text"
            id="bookWanted"
            placeholder="Enter book title"
            value={bookWanted}
            onChange={(e) => setBookWanted(e.target.value)}
            style={styles.input}
          />
          {errors.bookWanted && <span style={styles.error}>{errors.bookWanted}</span>}
        </div>
        
        <div style={styles.field}>
          <label htmlFor="condition" style={styles.label}>Condition of Book</label>
          <select
            id="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            style={styles.select}
          >
            <option value="">Select Condition</option>
            <option value="New">New</option>
            <option value="Good">Good</option>
            <option value="Acceptable">Acceptable</option>
          </select>
          {errors.condition && <span style={styles.error}>{errors.condition}</span>}
        </div>
        
        <div style={styles.field}>
          <label htmlFor="notes" style={styles.label}>Additional Notes</label>
          <textarea
            id="notes"
            rows="4"
            placeholder="Any additional details"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={styles.textarea}
          />
        </div>
        
        <button type="submit" style={styles.button}>Submit Request</button>
      </form>

      {/* Success Modal Popup */}
      {showSuccessModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{ marginBottom: '16px' }}>Success!</h3>
            <p style={{ marginBottom: '24px' }}>Your request has been submitted successfully.</p>
            <button onClick={closeModal} style={styles.modalButton}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
    position: 'relative'
  },
  header: {
    textAlign: 'center',
    fontSize: '28px',
    color: '#333',
    marginBottom: '20px'
  },
  field: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px'
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  select: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '16px',
  },
  error: {
    color: '#E53E3E',
    fontSize: '12px',
    marginTop: '4px',
    display: 'block'
  },
  modalOverlay: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '1000'
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '8px',
    textAlign: 'center',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  modalButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer'
  }
};

export default ExchangeRequestForm;
