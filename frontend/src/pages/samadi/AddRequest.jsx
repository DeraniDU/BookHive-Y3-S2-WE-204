import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const AddRequest = () => {
  // Form state
  const [bookOffered, setBookOffered] = useState("");
  const [bookWanted, setBookWanted] = useState("");
  const [condition, setCondition] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Form validation
    let validationErrors = {};
    if (!bookOffered) validationErrors.bookOffered = "Please enter the book title you are offering.";
    if (!bookWanted) validationErrors.bookWanted = "Please enter the book title you want.";
    if (!condition) validationErrors.condition = "Please select a condition.";
  
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    // Prepare request payload
    const requestData = {
      bookOffered,
      bookWanted,
      condition,
      notes,
    };
  
    try {
      const response = await fetch("http://localhost:3000/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
  
      if (response.ok) {
        setShowSuccessModal(true);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to submit request. Please try again.");
      }
    } catch (error) {
      alert("Network error. Please check your connection.");
    }
  };
  

  const closeModal = () => {
    setShowSuccessModal(false);
    navigate("/exchange/home"); 
  };

  // Theme colors - should match header/footer components
  const theme = {
    primary: "#1e3a8a", // deep blue - matching header
    primaryLight: "#2563eb", // lighter blue for hover states
    primaryLightest: "#dbeafe", // very light blue for backgrounds
    secondary: "#4ade80", // green accent
    text: "#1f2937", // dark text
    textLight: "#6b7280", // gray text
    background: "#f9fafb", // light background
    white: "#ffffff",
    border: "#e5e7eb",
    error: "#ef4444",
  };

  // Enhanced styling to match header/footer
  const styles = {
    pageContainer: {
      backgroundColor: theme.background,
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    },
    mainContent: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      padding: "40px 20px",
    },
    container: {
      width: "100%",
      maxWidth: "700px",
      margin: "0 auto",
      padding: "32px",
      backgroundColor: theme.white,
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      border: `1px solid ${theme.border}`,
    },
    header: {
      textAlign: "center",
      marginBottom: "32px",
      color: theme.primary,
    },
    title: {
      fontSize: "30px",
      fontWeight: "700",
      margin: "0 0 10px 0",
      color: theme.primary,
    },
    subtitle: {
      fontSize: "16px",
      fontWeight: "400",
      color: theme.textLight,
      margin: "0",
    },
    formSection: {
      marginBottom: "28px",
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "16px",
      color: theme.primary,
      paddingBottom: "8px",
      borderBottom: `2px solid ${theme.primaryLightest}`,
    },
    field: {
      marginBottom: "22px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "500",
      color: theme.text,
      fontSize: "15px",
    },
    inputContainer: {
      position: "relative",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "8px",
      border: `1px solid ${theme.border}`,
      fontSize: "15px",
      transition: "all 0.2s ease-in-out",
      outline: "none",
    },
    inputFocus: {
      borderColor: theme.primary,
      boxShadow: `0 0 0 3px ${theme.primaryLightest}`,
    },
    select: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "8px",
      border: `1px solid ${theme.border}`,
      fontSize: "15px",
      backgroundColor: theme.white,
      cursor: "pointer",
      appearance: "none",
      backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"%231e3a8a\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 12px center",
      transition: "all 0.2s ease-in-out",
    },
    textarea: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "8px",
      border: `1px solid ${theme.border}`,
      fontSize: "15px",
      minHeight: "120px",
      resize: "vertical",
      transition: "all 0.2s ease-in-out",
    },
    buttonContainer: {
      marginTop: "32px",
    },
    button: {
      width: "100%",
      padding: "14px",
      border: "none",
      backgroundColor: theme.primary,
      color: theme.white,
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      borderRadius: "8px",
      transition: "all 0.2s ease-in-out",
      boxShadow: "0 2px 6px rgba(30, 58, 138, 0.3)",
    },
    buttonHover: {
      backgroundColor: theme.primaryLight,
      transform: "translateY(-1px)",
      boxShadow: "0 4px 8px rgba(30, 58, 138, 0.4)",
    },
    error: {
      color: theme.error,
      fontSize: "13px",
      marginTop: "5px",
      display: "block",
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
      zIndex: 1000,
    },
    modalContent: {
      background: theme.white,
      padding: "32px",
      borderRadius: "12px",
      textAlign: "center",
      width: "380px",
      boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
      animation: "fadeIn 0.3s ease-out",
    },
    modalIcon: {
      width: "60px",
      height: "60px",
      backgroundColor: theme.primaryLightest,
      color: theme.primary,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "28px",
      margin: "0 auto 20px",
    },
    modalTitle: {
      fontSize: "24px",
      fontWeight: "600",
      marginBottom: "12px",
      color: theme.primary,
    },
    modalMessage: {
      fontSize: "16px",
      color: theme.textLight,
      marginBottom: "24px",
      lineHeight: "1.5",
    },
    modalButton: {
      padding: "12px 28px",
      border: "none",
      backgroundColor: theme.primary,
      color: theme.white,
      fontWeight: "600",
      cursor: "pointer",
      borderRadius: "8px",
      fontSize: "15px",
      transition: "background-color 0.2s ease-in-out",
    },
    infoCard: {
      backgroundColor: theme.primaryLightest,
      padding: "16px",
      borderRadius: "8px",
      marginBottom: "24px",
      borderLeft: `4px solid ${theme.primary}`,
    },
    infoText: {
      color: theme.text,
      margin: "0",
      fontSize: "14px",
      lineHeight: "1.5",
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
    },
    fullWidth: {
      gridColumn: "1 / -1",
    },
  };

  return (
    <div style={styles.pageContainer}>
      <Header />

      <div style={styles.mainContent}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h2 style={styles.title}>Book Exchange Request</h2>
            <p style={styles.subtitle}>Connect with other readers and exchange your favorite books</p>
          </div>

          <div style={styles.infoCard}>
            <p style={styles.infoText}>
              <strong>How it works:</strong> Fill out this form with details about the book you're offering and the book you're looking for. 
              Once submitted, your request will be visible to other members who can propose an exchange.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>Book Information</h3>
              
              <div style={styles.formGrid}>
                <div style={styles.field}>
                  <label htmlFor="bookOffered" style={styles.label}>
                    Book You Are Offering*
                  </label>
                  <div style={styles.inputContainer}>
                    <input
                      type="text"
                      id="bookOffered"
                      placeholder="Enter the title of the book you own"
                      value={bookOffered}
                      onChange={(e) => setBookOffered(e.target.value)}
                      style={{
                        ...styles.input,
                        borderColor: errors.bookOffered ? theme.error : theme.border
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = theme.primary;
                        e.target.style.boxShadow = `0 0 0 3px ${theme.primaryLightest}`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.bookOffered ? theme.error : theme.border;
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                  {errors.bookOffered && <span style={styles.error}>{errors.bookOffered}</span>}
                </div>

                <div style={styles.field}>
                  <label htmlFor="bookWanted" style={styles.label}>
                    Book You Want*
                  </label>
                  <div style={styles.inputContainer}>
                    <input
                      type="text"
                      id="bookWanted"
                      placeholder="Enter the title of the book you're looking for"
                      value={bookWanted}
                      onChange={(e) => setBookWanted(e.target.value)}
                      style={{
                        ...styles.input,
                        borderColor: errors.bookWanted ? theme.error : theme.border
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = theme.primary;
                        e.target.style.boxShadow = `0 0 0 3px ${theme.primaryLightest}`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.bookWanted ? theme.error : theme.border;
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                  {errors.bookWanted && <span style={styles.error}>{errors.bookWanted}</span>}
                </div>
              </div>

              <div style={styles.field}>
                <label htmlFor="condition" style={styles.label}>
                  Condition of Your Book*
                </label>
                <select
                  id="condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  style={{
                    ...styles.select,
                    borderColor: errors.condition ? theme.error : theme.border
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = theme.primary;
                    e.target.style.boxShadow = `0 0 0 3px ${theme.primaryLightest}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.condition ? theme.error : theme.border;
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <option value="">Select condition...</option>
                  <option value="New">New (unused)</option>
                  <option value="Like New">Like New (minimal wear)</option>
                  <option value="Very Good">Very Good (slight wear)</option>
                  <option value="Good">Good (some signs of use)</option>
                  <option value="Acceptable">Acceptable (worn but intact)</option>
                </select>
                {errors.condition && <span style={styles.error}>{errors.condition}</span>}
              </div>
            </div>

            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>Additional Details</h3>
              <div style={styles.field}>
                <label htmlFor="notes" style={styles.label}>
                  Notes (optional)
                </label>
                <textarea
                  id="notes"
                  placeholder="Any additional details about your book or exchange preferences"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={styles.textarea}
                  onFocus={(e) => {
                    e.target.style.borderColor = theme.primary;
                    e.target.style.boxShadow = `0 0 0 3px ${theme.primaryLightest}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = theme.border;
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            <div style={{...styles.formSection, textAlign: "center", fontSize: "14px", color: theme.textLight}}>
              <p>* Required fields</p>
            </div>

            <div style={styles.buttonContainer}>
              <button 
                type="submit" 
                style={styles.button}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = theme.primaryLight;
                  e.currentTarget.style.transform = styles.buttonHover.transform;
                  e.currentTarget.style.boxShadow = styles.buttonHover.boxShadow;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = theme.primary;
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = styles.button.boxShadow;
                }}
              >
                Submit Exchange Request
              </button>
            </div>
          </form>
        </div>
      </div>

      {showSuccessModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalIcon}>✓</div>
            <h3 style={styles.modalTitle}>Success!</h3>
            <p style={styles.modalMessage}>Your book exchange request has been submitted successfully. We'll notify you when someone responds to your request.</p>
            <button 
              onClick={closeModal} 
              style={styles.modalButton}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = theme.primaryLight;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = theme.primary;
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AddRequest;