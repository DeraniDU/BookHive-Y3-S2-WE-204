import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
import "./BookBidForm.css";
import Header from "../../components/Header"; // Corrected import path
import Footer from "../../components/Footer"; // Corrected import path

const BookBidForm = () => {
  const navigate = useNavigate();
  
  // Initial state for book data
  const [bookData, setBookData] = useState({
    name: "",
    category: "",
    author: "",
    price: "",
    year: "",
    condition: "",
    description: "",
    photos: [],
  });

  // Handle input changes
  const handleChange = (e) => {
    setBookData({ ...bookData, [e.target.name]: e.target.value });
  };

  // Handle file input for photos (up to 6 images)
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length <= 6) {
      setBookData({ ...bookData, photos: [...files] });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You can upload a maximum of 6 images.",
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (
      !bookData.name ||
      !bookData.category ||
      !bookData.author ||
      !bookData.price ||
      !bookData.year ||
      !bookData.condition ||
      !bookData.description ||
      bookData.photos.length === 0
    ) {
      Swal.fire({
        icon: "error",
        title: "Incomplete Form",
        text: "All fields are mandatory, and you must upload at least 1 photo.",
      });
      return;
    }

    // Check if the price is greater than 0
    if (bookData.price <= 0) {
      Swal.fire({
        icon: "error",
        title: "Invalid Price",
        text: "Published Price must be greater than 0.",
      });
      return;
    }

    // Save data to localStorage
    localStorage.setItem("bookBid", JSON.stringify(bookData));

    // Navigate to the next page
    navigate("/bidhome");
  };

  return (
    <div>
      <Header /> {/* Place Header outside the form */}
      <div className="book-form-container">
        <h2>Enter Book Details for Bidding</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Book Name"
            onChange={handleChange}
            value={bookData.name}
            required
          />
          <select
            name="category"
            onChange={handleChange}
            value={bookData.category}
            required
          >
            <option value="">Select Category</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
            <option value="Fantasy">Fantasy</option>
          </select>
          <input
            type="text"
            name="author"
            placeholder="Author"
            onChange={handleChange}
            value={bookData.author}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Published Price (Rs)"
            onChange={handleChange}
            value={bookData.price}
            required
          />
          <input
            type="number"
            name="year"
            placeholder="Year of Publication"
            onChange={handleChange}
            value={bookData.year}
            required
          />
          <select
            name="condition"
            onChange={handleChange}
            value={bookData.condition}
            required
          >
            <option value="">Select Condition</option>
            <option value="New">New</option>
            <option value="Used">Used</option>
            <option value="Damaged">Damaged</option>
          </select>
          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            value={bookData.description}
            required
          />
          <input
            type="file"
            name="photos"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      <Footer /> {/* Place Footer outside the form */}
    </div>
  );
};

export default BookBidForm;
