import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Swal from "sweetalert2"; // Import SweetAlert2
import "./BidHome.css";
import Header from "../../components/Header"; // Corrected import path for Header
import Footer from "../../components/Footer"; // Corrected import path for Footer

const BidHome = () => {
  const navigate = useNavigate(); // Initialize navigate function

  // Load book data from localStorage
  const storedBookData = JSON.parse(localStorage.getItem("bookBid"));
  const [bookData, setBookData] = useState(storedBookData || {});

  // New fields for bidding
  const [bidData, setBidData] = useState({
    startDate: new Date().toISOString().split("T")[0], // Today's date
    endDate: "",
    location: "",
  });

  // State to track if the book details are in edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Handle changes for bid fields
  const handleBidChange = (e) => {
    setBidData({ ...bidData, [e.target.name]: e.target.value });
  };

  // Handle changes for book details fields
  const handleBookChange = (e) => {
    setBookData({ ...bookData, [e.target.name]: e.target.value });
  };

  // Update book details
  const handleUpdate = () => {
    setIsEditing(true);
  };

  // Save the updated book details with validation
  const handleSaveUpdate = () => {
    // Check if all fields are filled
    if (
      !bookData.name ||
      !bookData.category ||
      !bookData.author ||
      !bookData.price ||
      !bookData.year ||
      !bookData.condition ||
      !bookData.description
    ) {
      Swal.fire("Error", "All fields are mandatory. Please fill in all fields.", "error");
      return;
    }

    // Check if the price is greater than 0
    if (bookData.price <= 0) {
      Swal.fire("Error", "Price must be greater than 0.", "error");
      return;
    }

    // If validation passed, save the data to localStorage and update the state
    localStorage.setItem("bookBid", JSON.stringify(bookData));
    setIsEditing(false);
    Swal.fire("Success", "Book details updated successfully!", "success");
  };

  // Cancel the update
  const handleCancelUpdate = () => {
    setIsEditing(false);
    Swal.fire("Cancelled", "Update cancelled.", "info");
  };

  // Delete the book entry
  const handleDelete = () => {
    localStorage.removeItem("bookBid");
    setBookData({});
    setBidData({ startDate: "", endDate: "", location: "" });
    Swal.fire("Success", "Book details deleted successfully!", "success");
  };

  // Ensure end date cannot be in the past
  const validateEndDate = () => {
    const today = new Date().toISOString().split("T")[0];
    return bidData.endDate && bidData.endDate >= today;
  };

  // Validate if all fields are filled out and not null
  const validateAllFields = () => {
    if (
      !bookData.name ||
      !bookData.category ||
      !bookData.author ||
      !bookData.price ||
      !bookData.year ||
      !bookData.condition ||
      !bookData.description ||
      !bidData.startDate ||
      !bidData.endDate ||
      !bidData.location
    ) {
      Swal.fire("Error", "All fields are mandatory. Please fill in all fields.", "error");
      return false;
    }
    if (!validateEndDate()) {
      Swal.fire("Error", "Bid end date cannot be in the past!", "error");
      return false;
    }
    return true;
  };

  // Place bid functionality
  const handlePlaceBid = () => {
    if (!validateAllFields()) {
      return;
    }

    // Save bid data in localStorage before navigating
    localStorage.setItem("bidData", JSON.stringify(bidData));
    Swal.fire("Success", "Bid placed successfully!", "success");
    navigate("/bidding-success"); // Navigate to success page
  };

  // Cancel bid functionality
  const handleCancel = () => {
    setBidData({ startDate: "", endDate: "", location: "" });
    Swal.fire("Cancelled", "Bid process cancelled.", "info");
  };

  return (
    <>
      {/* Header is now placed outside the main content */}
      <Header />

      <div className="bid-home-container">
        <h2>Book Details</h2>
        {bookData ? (
          <div className="book-details">
            <div className="book-detail">
              <label>Book Name:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={bookData.name}
                  onChange={handleBookChange}
                />
              ) : (
                <p>{bookData.name}</p>
              )}
            </div>
            <div className="book-detail">
              <label>Category:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="category"
                  value={bookData.category}
                  onChange={handleBookChange}
                />
              ) : (
                <p>{bookData.category}</p>
              )}
            </div>
            <div className="book-detail">
              <label>Author:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="author"
                  value={bookData.author}
                  onChange={handleBookChange}
                />
              ) : (
                <p>{bookData.author}</p>
              )}
            </div>
            <div className="book-detail">
              <label>Published Price (Rs):</label>
              {isEditing ? (
                <input
                  type="number"
                  name="price"
                  value={bookData.price}
                  onChange={handleBookChange}
                />
              ) : (
                <p>{bookData.price}</p>
              )}
            </div>
            <div className="book-detail">
              <label>Year of Publication:</label>
              {isEditing ? (
                <input
                  type="number"
                  name="year"
                  value={bookData.year}
                  onChange={handleBookChange}
                />
              ) : (
                <p>{bookData.year}</p>
              )}
            </div>

            <div className="buttons">
              {isEditing ? (
                <>
                  <button onClick={handleSaveUpdate}>Save</button>
                  <button onClick={handleCancelUpdate}>Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={handleUpdate}>Update</button>
                  <button onClick={handleDelete}>Delete</button>
                </>
              )}
            </div>
          </div>
        ) : (
          <p>No book details available. Please submit a book first.</p>
        )}

        <h2>Bid Details</h2>
        <div className="bid-form">
          <div className="bid-detail">
            <label>Bid Start Date:</label>
            <input
              type="date"
              name="startDate"
              value={bidData.startDate}
              onChange={handleBidChange}
              required
            />
          </div>
          <div className="bid-detail">
            <label>Bid End Date:</label>
            <input
              type="date"
              name="endDate"
              value={bidData.endDate}
              onChange={handleBidChange}
              required
            />
          </div>
          <div className="bid-detail">
            <label>Bid Location:</label>
            <input
              type="text"
              name="location"
              value={bidData.location}
              onChange={handleBidChange}
              required
            />
          </div>

          <div className="buttons">
            <button onClick={handlePlaceBid}>Place Bid</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      </div>

      {/* Footer is now placed outside the main content */}
      <Footer />
    </>
  );
};

export default BidHome;
