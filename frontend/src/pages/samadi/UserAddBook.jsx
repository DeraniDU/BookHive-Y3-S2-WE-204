import React, { useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const UserAddBook = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    condition: "Good",
    ownerName: "",
    contactInfo: "",
    available: true,
    location: "",
    image: null,
    imagePreview: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [step, setStep] = useState(1);

  const conditions = ["New", "Like New", "Good", "Fair", "Worn", "Used", "Damaged"];
  const genres = [
    "Fiction", "Non-Fiction", "Biography", "Sci-Fi", "Fantasy", "Mystery"
  ];

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setMessage({ type: "error", text: "Please upload a valid image (JPEG, PNG, GIF)" });
      return;
    }
    
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage({ type: "error", text: "Image size must be less than 5MB" });
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prevData => ({
        ...prevData,
        image: file,
        imagePreview: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key !== 'imagePreview') {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.post("http://localhost:3000/exchange", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setMessage({ type: "success", text: response.data.message || "Book added successfully!" });
      setFormData({
        title: "",
        author: "",
        genre: "",
        description: "",
        condition: "Good",
        ownerName: "",
        contactInfo: "",
        available: true,
        location: "",
        image: null,
        imagePreview: ""
      });
      setStep(1);
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: `Error: ${error.response?.data?.error || error.message || "Failed to add book. Please try again."}`
      });
    } finally {
      setIsSubmitting(false);
      window.scrollTo(0, 0);
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  // Form validation
  const validateStep1 = () => {
    return formData.title.trim() !== "" && 
           formData.author.trim() !== "" && 
           formData.genre.trim() !== "";
  };

  const validateStep2 = () => {
    return formData.description.trim() !== "" && 
           formData.condition.trim() !== "";
  };

  // Style objects
  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f4f9fb",
      padding: "0",
      margin: "0",
      fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    },
    formContainer: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "30px 20px"
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      overflow: "hidden"
    },
    header: {
      background: "linear-gradient(135deg, #4776E6 0%, #3F51B5 100%)",
      padding: "24px",
      color: "#ffffff"
    },
    headerTitle: {
      fontSize: "24px",
      fontWeight: "700",
      margin: "0 0 4px 0"
    },
    headerSubtitle: {
      fontSize: "16px",
      fontWeight: "400",
      margin: "0",
      opacity: "0.8"
    },
    progressContainer: {
      padding: "20px 24px 0 24px"
    },
    progressLabel: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "8px"
    },
    stepBadge: {
      fontSize: "12px",
      fontWeight: "600",
      padding: "4px 10px",
      backgroundColor: "#e8eaf6",
      color: "#3f51b5",
      borderRadius: "12px",
      display: "inline-block"
    },
    stepText: {
      fontSize: "12px",
      fontWeight: "600",
      color: "#3f51b5"
    },
    progressBar: {
      height: "8px",
      backgroundColor: "#e8eaf6",
      borderRadius: "4px",
      marginBottom: "20px",
      overflow: "hidden"
    },
    progressFill: {
      height: "100%",
      backgroundColor: "#3f51b5",
      borderRadius: "4px",
      transition: "width 0.5s ease"
    },
    message: (type) => ({
      margin: "0 24px 16px 24px",
      padding: "16px",
      borderRadius: "8px",
      backgroundColor: type === "success" ? "#e8f5e9" : "#ffebee",
      color: type === "success" ? "#2e7d32" : "#c62828",
      border: `1px solid ${type === "success" ? "#a5d6a7" : "#ef9a9a"}`,
      display: "flex",
      alignItems: "center"
    }),
    messageIcon: {
      width: "20px",
      height: "20px",
      marginRight: "12px"
    },
    form: {
      padding: "24px"
    },
    formGroup: {
      marginBottom: "20px"
    },
    label: {
      display: "block",
      marginBottom: "6px",
      fontSize: "14px",
      fontWeight: "500",
      color: "#333333"
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      fontSize: "16px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      boxSizing: "border-box",
      transition: "border-color 0.2s, box-shadow 0.2s"
    },
    fileInput: {
      width: "100%",
      padding: "12px 0",
      fontSize: "16px"
    },
    textarea: {
      width: "100%",
      padding: "12px 16px",
      fontSize: "16px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      minHeight: "120px",
      boxSizing: "border-box",
      resize: "vertical",
      fontFamily: "inherit"
    },
    select: {
      width: "100%",
      padding: "12px 16px",
      fontSize: "16px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      backgroundColor: "#ffffff",
      boxSizing: "border-box"
    },
    checkboxContainer: {
      display: "flex",
      alignItems: "center",
      marginBottom: "20px"
    },
    checkbox: {
      marginRight: "10px",
      width: "18px",
      height: "18px",
      accentColor: "#3f51b5"
    },
    checkboxLabel: {
      fontSize: "14px",
      color: "#333333"
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "24px"
    },
    backButton: {
      padding: "12px 24px",
      backgroundColor: "#e2e8f0",
      color: "#333333",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "background-color 0.2s"
    },
    nextButton: (disabled) => ({
      padding: "12px 24px",
      backgroundColor: disabled ? "#bdc5d1" : "#3f51b5",
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "500",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "background-color 0.2s"
    }),
    submitButton: (disabled) => ({
      padding: "12px 24px",
      backgroundColor: disabled ? "#bdc5d1" : "#3f51b5",
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "500",
      cursor: disabled ? "not-allowed" : "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }),
    spinner: {
      display: "inline-block",
      width: "16px",
      height: "16px",
      marginRight: "8px",
      border: "2px solid rgba(255,255,255,0.3)",
      borderRadius: "50%",
      borderTopColor: "#ffffff",
      animation: "spin 1s ease-in-out infinite"
    },
    imagePreviewContainer: {
      marginTop: "10px",
      textAlign: "center"
    },
    imagePreview: {
      maxWidth: "200px",
      maxHeight: "200px",
      border: "1px solid #ddd",
      borderRadius: "4px"
    },
    tipsContainer: {
      marginTop: "32px",
      backgroundColor: "#e3f2fd",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      border: "1px solid #bbdefb"
    },
    tipsTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#0d47a1",
      marginTop: "0",
      marginBottom: "16px"
    },
    tipsList: {
      paddingLeft: "20px",
      margin: "0"
    },
    tipItem: {
      fontSize: "14px",
      color: "#1565c0",
      marginBottom: "8px"
    }
  };

  // For the spinner animation - add to head
  if (typeof document !== 'undefined') {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styleEl);
  }

  return (
    <div style={styles.container}>
      <Header />
      
      <div style={styles.formContainer}>
        <div style={styles.card}>
          {/* Form Header */}
          <div style={styles.header}>
            <h2 style={styles.headerTitle}>Share Your Book</h2>
            <p style={styles.headerSubtitle}>Add your book to the community exchange</p>
          </div>
          
          {/* Progress Bar */}
          <div style={styles.progressContainer}>
            <div style={styles.progressLabel}>
              <div>
                <span style={styles.stepBadge}>
                  {step === 1 ? "Book Details" : step === 2 ? "More Information" : "Contact Details"}
                </span>
              </div>
              <div>
                <span style={styles.stepText}>Step {step} of 3</span>
              </div>
            </div>
            <div style={styles.progressBar}>
              <div 
                style={{
                  ...styles.progressFill,
                  width: `${(step / 3) * 100}%`
                }}
              ></div>
            </div>
          </div>

          {/* Success/Error Message */}
          {message.text && (
            <div style={styles.message(message.type)}>
              {message.type === "success" ? (
                <svg style={styles.messageIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg style={styles.messageIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <p style={{ margin: 0, fontSize: "14px" }}>{message.text}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            {step === 1 && (
              <div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Book Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Enter the full title of the book"
                    required
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Author</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Author's full name"
                    required
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Genre</label>
                  <select
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    style={styles.select}
                    required
                  >
                    <option value="" disabled>Select a genre</option>
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>
                
                <div style={styles.buttonContainer}>
                  <div></div> {/* Empty div for spacing */}
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!validateStep1()}
                    style={styles.nextButton(!validateStep1())}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Book Cover Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={styles.fileInput}
                  />
                  {formData.imagePreview && (
                    <div style={styles.imagePreviewContainer}>
                      <img 
                        src={formData.imagePreview} 
                        alt="Preview" 
                        style={styles.imagePreview}
                      />
                    </div>
                  )}
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    style={styles.textarea}
                    placeholder="Brief description of the book (plot, key features, etc.)"
                    required
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Condition</label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    style={styles.select}
                    required
                  >
                    {conditions.map((condition) => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                </div>

                <div style={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    id="availableCheck"
                    name="available"
                    checked={formData.available}
                    onChange={handleChange}
                    style={styles.checkbox}
                  />
                  <label htmlFor="availableCheck" style={styles.checkboxLabel}>
                    Available for exchange immediately
                  </label>
                </div>
                
                <div style={styles.buttonContainer}>
                  <button
                    type="button"
                    onClick={prevStep}
                    style={styles.backButton}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!validateStep2()}
                    style={styles.nextButton(!validateStep2())}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Your Name</label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Your full name"
                    required
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Contact Information</label>
                  <input
                    type="text"
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Email or phone number"
                    required
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Your city or neighborhood"
                    required
                  />
                </div>

                <div style={styles.buttonContainer}>
                  <button
                    type="button"
                    onClick={prevStep}
                    style={styles.backButton}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    style={styles.submitButton(isSubmitting)}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div style={styles.spinner}></div>
                        Processing...
                      </>
                    ) : (
                      "Add Book"
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Tips Section */}
        <div style={styles.tipsContainer}>
          <h3 style={styles.tipsTitle}>Tips for a Great Book Listing</h3>
          <ul style={styles.tipsList}>
            <li style={styles.tipItem}>Include the complete title and author name</li>
            <li style={styles.tipItem}>Be honest about the book's condition</li>
            <li style={styles.tipItem}>Add a clear photo of the book cover</li>
            <li style={styles.tipItem}>Add details that would interest potential readers</li>
            <li style={styles.tipItem}>Respond promptly to inquiries about your book</li>
            <li style={styles.tipItem}>Consider adding what types of books you're interested in exchanging for</li>
          </ul>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default UserAddBook;