// BookBidForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./BookBidForm.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { createBookListing } from "../../api";

const BookBidForm = () => {
  const navigate = useNavigate();
  
  // State for book data
  const [bookData, setBookData] = useState({
    name: "",
    category: "",
    author: "",
    price: "",
    year: "",
    condition: "",
    description: "",
    photos: []
  });

  // State for form validation
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData({ ...bookData, [name]: value });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Handle file input for photos
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 6) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You can upload a maximum of 6 images.",
      });
      return;
    }
    
    setBookData({ ...bookData, photos: files });
    
    // Clear error when field is edited
    if (errors.photos) {
      setErrors({ ...errors, photos: "" });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();
    
    if (!bookData.name) newErrors.name = "Book name is required";
    if (!bookData.category) newErrors.category = "Category is required";
    if (!bookData.author) newErrors.author = "Author name is required";
    
    if (!bookData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(bookData.price) || Number(bookData.price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }
    
    if (!bookData.year) {
      newErrors.year = "Publication year is required";
    } else if (
      isNaN(bookData.year) || 
      Number(bookData.year) < 1900 || 
      Number(bookData.year) > currentYear
    ) {
      newErrors.year = `Year must be between 1900 and ${currentYear}`;
    }
    
    if (!bookData.condition) newErrors.condition = "Book condition is required";
    if (!bookData.description) newErrors.description = "Description is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert price and year to numbers
      const formattedData = {
        ...bookData,
        price: Number(bookData.price),
        year: Number(bookData.year)
      };
      
      const response = await createBookListing(formattedData);
      const savedBook = response.data;
      
      setIsSubmitting(false);
      
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Book has been successfully added.",
      }).then(() => {
        navigate(`/bidhome?bookId=${savedBook._id}`);
      });
    } catch (error) {
      setIsSubmitting(false);
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to add book. Please try again.",
      });
    }
  };

  return (
    <div>
      <Header />
      <div className="book-bid-form-container">
        <h2>Add a New Book</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Book Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={bookData.name}
              onChange={handleChange}
              className={errors.name ? "error" : ""}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              name="category"
              value={bookData.category}
              onChange={handleChange}
              className={errors.category ? "error" : ""}
            >
              <option value="">Select Category</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Science Fiction">Science Fiction</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Mystery">Mystery</option>
              <option value="Romance">Romance</option>
              <option value="Thriller">Thriller</option>
              <option value="Horror">Horror</option>
              <option value="Biography">Biography</option>
              <option value="History">History</option>
              <option value="Self-Help">Self-Help</option>
              <option value="Business">Business</option>
              <option value="Children">Children</option>
              <option value="Travel">Travel</option>
              <option value="Cooking">Cooking</option>
              <option value="Art">Art</option>
              <option value="Science">Science</option>
              <option value="Technology">Technology</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="author">Author:</label>
            <input
              type="text"
              id="author"
              name="author"
              value={bookData.author}
              onChange={handleChange}
              className={errors.author ? "error" : ""}
            />
            {errors.author && <span className="error-message">{errors.author}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="price">Price (Rs):</label>
            <input
              type="number"
              id="price"
              name="price"
              value={bookData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={errors.price ? "error" : ""}
            />
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="year">Year of Publication:</label>
            <input
              type="number"
              id="year"
              name="year"
              value={bookData.year}
              onChange={handleChange}
              min="1900"
              max={new Date().getFullYear()}
              className={errors.year ? "error" : ""}
            />
            {errors.year && <span className="error-message">{errors.year}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="condition">Condition:</label>
            <select
              id="condition"
              name="condition"
              value={bookData.condition}
              onChange={handleChange}
              className={errors.condition ? "error" : ""}
            >
              <option value="">Select Condition</option>
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Very Good">Very Good</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
              <option value="Used">Used</option>
              <option value="Damaged">Damaged</option>
            </select>
            {errors.condition && <span className="error-message">{errors.condition}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={bookData.description}
              onChange={handleChange}
              rows="4"
              className={errors.description ? "error" : ""}
            ></textarea>
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="photos">Photos (Max 6):</label>
            <input
              type="file"
              id="photos"
              name="photos"
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className={errors.photos ? "error" : ""}
            />
            {errors.photos && <span className="error-message">{errors.photos}</span>}
            <small>You can upload up to 6 images.</small>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            <button type="button" onClick={() => navigate("/")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default BookBidForm;