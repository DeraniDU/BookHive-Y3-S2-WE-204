import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from 'axios';
import {
  FaSave,
  FaTimes,
  FaUpload,
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBook
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const UserEditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
    condition: '',
    ownerName: '',
    contactInfo: '',
    available: true,
    location: '',
    bookImage: { public_id: '', url: '' }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Genre options
  const genreOptions = ["Fiction", "Non-Fiction", "Biography", "Sci-Fi", "Fantasy", "Mystery"];

  // Condition options
  const conditionOptions = ["New", "Like New", "Good", "Fair", "Worn", "Used", "Damaged"];

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/exchange/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const bookData = response.data.data;
        setBook(bookData);
        if (bookData.bookImage?.url) {
          setImagePreview(bookData.bookImage.url);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching book:', err);
        setError('Failed to fetch book details. Please try again.');
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBook(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate contact info (email)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(book.contactInfo)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();

      // Append all book data
      Object.keys(book).forEach(key => {
        if (key !== 'bookImage') {
          formData.append(key, book[key]);
        }
      });

      // If there's a new image to upload
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await axios.put(
        `http://localhost:3000/exchange/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      toast.success('Book updated successfully!');
      navigate('/exchange/mybooks');
    } catch (err) {
      console.error('Error updating book:', err);
      setError(err.response?.data?.error || 'Failed to update book. Please try again.');
      toast.error(err.response?.data?.error || 'Failed to update book');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading book details...</p>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorText}>{error}</p>
        <button
          style={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
        <button
          style={{ ...styles.retryButton, backgroundColor: '#e74c3c', marginLeft: '10px' }}
          onClick={() => navigate('/exchange/mybooks')}
        >
          <FaTimes style={{ marginRight: '8px' }} />
          Back to My Books
        </button>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div style={styles.container}>
        <h1 style={styles.title}>Edit Book</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formRow}>
            {/* Left Column */}
            <div style={styles.formColumn}>
              {/* Book Image Upload */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Book Cover</label>
                <div style={styles.imageUploadContainer}>
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Book preview"
                      style={styles.imagePreview}
                    />
                  ) : (
                    <div style={styles.imagePlaceholder}>
                      <FaBook size={40} color="#bdc3c7" />
                    </div>
                  )}
                  <label style={styles.uploadButton}>
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <FaUpload style={{ marginRight: '8px' }} />
                    {book.bookImage?.url ? 'Change Image' : 'Upload Image'}
                  </label>
                </div>
              </div>

              {/* Book Information */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Title*</label>
                <input
                  type="text"
                  name="title"
                  value={book.title}
                  onChange={handleChange}
                  style={styles.input}
                  required
                  minLength="2"
                  maxLength="100"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Author*</label>
                <input
                  type="text"
                  name="author"
                  value={book.author}
                  onChange={handleChange}
                  style={styles.input}
                  required
                  minLength="2"
                  maxLength="100"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Genre*</label>
                <select
                  name="genre"
                  value={book.genre}
                  onChange={handleChange}
                  style={styles.input}
                  required
                >
                  <option value="">Select genre</option>
                  {genreOptions.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div style={styles.formColumn}>
              {/* Owner Information */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Owner Name*</label>
                <div style={styles.inputWithIcon}>
                  <FaUser style={styles.inputIcon} />
                  <input
                    type="text"
                    name="ownerName"
                    value={book.ownerName}
                    onChange={handleChange}
                    style={{ ...styles.input, paddingLeft: '35px' }}
                    required
                    minLength="2"
                    maxLength="50"
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Contact Email*</label>
                <div style={styles.inputWithIcon}>
                  <FaEnvelope style={styles.inputIcon} />
                  <input
                    type="email"
                    name="contactInfo"
                    value={book.contactInfo}
                    onChange={handleChange}
                    style={{ ...styles.input, paddingLeft: '35px' }}
                    required
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Location</label>
                <div style={styles.inputWithIcon}>
                  <FaMapMarkerAlt style={styles.inputIcon} />
                  <input
                    type="text"
                    name="location"
                    value={book.location}
                    onChange={handleChange}
                    style={{ ...styles.input, paddingLeft: '35px' }}
                    maxLength="100"
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Condition*</label>
                <select
                  name="condition"
                  value={book.condition}
                  onChange={handleChange}
                  style={styles.input}
                  required
                >
                  <option value="">Select condition</option>
                  {conditionOptions.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
              </div>

              <div style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  name="available"
                  id="available"
                  checked={book.available}
                  onChange={handleChange}
                  style={styles.checkbox}
                />
                <label htmlFor="available" style={styles.checkboxLabel}>
                  Available for exchange
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              value={book.description}
              onChange={handleChange}
              style={{ ...styles.input, minHeight: '120px' }}
              placeholder="Describe the book's content, condition details, or any special notes..."
              maxLength="500"
            />
            <p style={styles.charCount}>{book.description.length}/500 characters</p>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.buttonGroup}>
            <button
              type="submit"
              style={styles.saveButton}
              disabled={isSubmitting}
            >
              <FaSave style={{ marginRight: '8px' }} />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/exchange/mybooks')}
              style={styles.cancelButton}
              disabled={isSubmitting}
            >
              <FaTimes style={{ marginRight: '8px' }} />
              Cancel
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div >
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '30px',
    fontSize: '2rem',
  },
  form: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 15px rgba(0, 0, 0, 0.1)',
  },
  formRow: {
    display: 'flex',
    gap: '30px',
    marginBottom: '20px',
  },
  formColumn: {
    flex: 1,
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#34495e',
    fontSize: '0.95rem',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #bdc3c7',
    borderRadius: '6px',
    fontSize: '0.95rem',
    transition: 'border-color 0.2s ease',
  },
  inputWithIcon: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '14px',
    color: '#7f8c8d',
    fontSize: '1rem',
  },
  imageUploadContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
  },
  imagePreview: {
    width: '200px',
    height: '250px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid #e0e0e0',
  },
  imagePlaceholder: {
    width: '200px',
    height: '250px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    border: '1px dashed #bdc3c7',
  },
  uploadButton: {
    padding: '10px 15px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.2s ease',
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    margin: '15px 0',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
  },
  checkbox: {
    marginRight: '10px',
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  checkboxLabel: {
    color: '#34495e',
    fontSize: '0.95rem',
    cursor: 'pointer',
  },
  error: {
    color: '#e74c3c',
    marginBottom: '20px',
    padding: '10px',
    backgroundColor: '#fdecea',
    borderRadius: '4px',
    textAlign: 'center',
  },
  charCount: {
    textAlign: 'right',
    fontSize: '0.8rem',
    color: '#7f8c8d',
    marginTop: '5px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '15px',
    marginTop: '30px',
  },
  saveButton: {
    padding: '12px 25px',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.2s ease',
  },
  cancelButton: {
    padding: '12px 25px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.2s ease',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '300px',
    gap: '20px',
  },
  spinner: {
    border: '4px solid rgba(0, 0, 0, 0.1)',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    borderLeftColor: '#3498db',
    animation: 'spin 1s linear infinite',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '300px',
    gap: '20px',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: '1.1rem',
    marginBottom: '20px',
  },
  retryButton: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
  },
};

export default UserEditBook;