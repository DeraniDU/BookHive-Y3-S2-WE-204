import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import navigation
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const ExchangeDeleteBook = ({ bookId, onDelete }) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleDeleteClick = () => setShowConfirmation(true);
  const handleCancel = () => navigate("/exhome"); // Redirect to /exhome
  const handleDelete = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsDeleted(true);
      setIsLoading(false);
      onDelete(bookId);
    }, 1000);
  };

  return (
    <>
      <Header />
      <div style={styles.pageContainer}>
        {!isDeleted ? (
          <div style={styles.card}>
            <h2 style={styles.title}>Delete Book</h2>
            {!showConfirmation ? (
              <>
                <p style={styles.message}>Are you sure you want to delete this book?</p>
                <div style={styles.buttonGroup}>
                  <Button onClick={handleDeleteClick} color="#FF4C4C">
                    Yes, Delete
                  </Button>
                  <Button onClick={handleCancel} color="#ccc" textColor="#333">
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p style={styles.warning}>⚠️ This action cannot be undone.</p>
                <div style={styles.buttonGroup}>
                  <Button onClick={handleDelete} color={isLoading ? "#FF7F7F" : "#FF4C4C"} disabled={isLoading}>
                    {isLoading ? "Deleting..." : "Confirm Delete"}
                  </Button>
                  <Button onClick={handleCancel} color="#ccc" textColor="#333">
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          <p style={styles.successMessage}>✅ The book has been successfully deleted!</p>
        )}
      </div>
      <Footer />
    </>
  );
};

// 🔹 Reusable Button Component
const Button = ({ onClick, children, color, textColor = "white", disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      backgroundColor: color,
      color: textColor,
      padding: "10px 15px",
      border: "none",
      borderRadius: "5px",
      fontSize: "14px",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "0.3s",
      margin: "5px",
      minWidth: "100px",
      fontWeight: "bold",
    }}
  >
    {children}
  </button>
);

// 🔹 Styles
const styles = {
  pageContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "80vh",
    backgroundColor: "#f4f4f9",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    width: "320px",
    animation: "fadeIn 0.3s ease-in-out",
  },
  title: {
    color: "#333",
    marginBottom: "10px",
    fontSize: "18px",
  },
  message: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "15px",
  },
  warning: {
    fontSize: "14px",
    color: "#d9534f",
    marginBottom: "15px",
  },
  successMessage: {
    fontSize: "16px",
    color: "#28a745",
    fontWeight: "bold",
    textAlign: "center",
    animation: "fadeIn 0.5s ease-in-out",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
  },
};

ExchangeDeleteBook.defaultProps = {
  onDelete: () => {},
};

export default ExchangeDeleteBook;
