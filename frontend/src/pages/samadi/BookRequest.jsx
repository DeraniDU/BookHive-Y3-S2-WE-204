import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Header from "../../components/Header";
import Footer from "../../components/Footer";


const ExchangeRequestForm = () => {
  const [bookOffered, setBookOffered] = useState("");
  const [bookWanted, setBookWanted] = useState("");
  const [condition, setCondition] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigate = useNavigate(); // Initialize navigate function

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let validationErrors = {};
    if (!bookOffered) validationErrors.bookOffered = "Please enter the book title you are offering.";
    if (!bookWanted) validationErrors.bookWanted = "Please enter the book title you want.";
    if (!condition) validationErrors.condition = "Please select a condition.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setShowSuccessModal(true);
  };

  const closeModal = () => {
    setShowSuccessModal(false);
    navigate("/exchangebook"); 
  };

  const styles = {
    container: {
      maxWidth: "600px",
      margin: "20px auto",
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    header: {
      textAlign: "center",
      marginBottom: "20px",
      fontSize: "24px",
      fontWeight: "bold",
    },
    field: {
      marginBottom: "15px",
    },
    label: {
      display: "block",
      marginBottom: "5px",
      fontWeight: "500",
    },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },
    select: {
      width: "100%",
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },
    textarea: {
      width: "100%",
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      height: "100px",
    },
    button: {
      marginTop: "20px",
      width: "100%",
      padding: "10px",
      border: "none",
      backgroundColor: "#4CAF50",
      color: "white",
      fontSize: "16px",
      cursor: "pointer",
      borderRadius: "4px",
    },
    error: {
      color: "red",
      fontSize: "12px",
    },
    modalOverlay: {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    modalContent: {
      background: "#fff",
      padding: "20px",
      borderRadius: "8px",
      textAlign: "center",
      width: "300px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
    },
    modalButton: {
      marginTop: "15px",
      padding: "8px 20px",
      border: "none",
      backgroundColor: "#4CAF50",
      color: "white",
      cursor: "pointer",
      borderRadius: "4px",
    },
  };

  return (
    <div>
      <Header />

      <div style={styles.container}>
        <h2 style={styles.header}>Book Exchange Request</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.field}>
            <label htmlFor="bookOffered" style={styles.label}>
              Book You Are Offering
            </label>
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
            <label htmlFor="bookWanted" style={styles.label}>
              Book You Want
            </label>
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
            <label htmlFor="condition" style={styles.label}>
              Condition of Book
            </label>
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
            <label htmlFor="notes" style={styles.label}>
              Additional Notes
            </label>
            <textarea
              id="notes"
              placeholder="Any additional details"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={styles.textarea}
            />
          </div>

          <button type="submit" style={styles.button}>Submit Request</button>
        </form>
      </div>

      {showSuccessModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>Success!</h3>
            <p>Your request has been submitted successfully.</p>
            <button onClick={closeModal} style={styles.modalButton}>OK</button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ExchangeRequestForm;
