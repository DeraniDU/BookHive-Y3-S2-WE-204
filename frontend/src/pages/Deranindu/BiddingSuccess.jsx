import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./BiddingSuccess.css";

const BiddingSuccess = () => {
  const navigate = useNavigate();

  // Fetching stored data from localStorage
  const storedBookData = JSON.parse(localStorage.getItem("bookBid"));
  const storedBidData = JSON.parse(localStorage.getItem("bidData")) || {};

  const [bookData, setBookData] = useState(storedBookData || {});
  const [bidData, setBidData] = useState(storedBidData);

  useEffect(() => {
    if (!storedBidData.startDate || !storedBidData.endDate || !storedBidData.location) {
      setBidData({
        startDate: storedBidData.startDate || "",
        endDate: storedBidData.endDate || "",
        location: storedBidData.location || "",
      });
    }
  }, [storedBidData]);

  // Helper function to format dates in a more readable way if needed
  const formatDate = (date) => {
    return date ? new Date(date).toISOString().split('T')[0] : '';
  };

  // Validates bid details and updates the bid data
  const handleUpdateBid = () => {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minEndDate = tomorrow.toISOString().split("T")[0];

    if (!bidData.startDate || !bidData.endDate || !bidData.location) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter start date, end date, and location for the bid.',
      });
      return;
    }

    if (bidData.startDate < today) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Start Date',
        text: 'Bid Start Date cannot be in the past.',
      });
      return;
    }

    if (bidData.endDate < minEndDate) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid End Date',
        text: 'Bid End Date must be a future date (at least tomorrow).',
      });
      return;
    }

    if (bidData.endDate < bidData.startDate) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Date Range',
        text: 'Bid End Date cannot be before Bid Start Date.',
      });
      return;
    }

    localStorage.setItem("bidData", JSON.stringify(bidData));
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Bid details updated successfully!',
    });
  };

  // Deletes bid data from localStorage and redirects to home
  const handleDeleteBid = () => {
    localStorage.removeItem("bidData");
    Swal.fire({
      icon: 'success',
      title: 'Deleted!',
      text: 'Bid deleted successfully!',
    }).then(() => {
      navigate("/");
    });
  };

  // Navigates to the Exbid page
  const handleViewBid = () => {
    navigate("/exbid"); // Navigate to Exbid.jsx
  };

  return (
    <div>
      <Header />

      <div className="bidding-success-container">
        <h2>Bid Placement Successful</h2>

        {/* Display book and bid details */}
        <div className="bid-details">
          <div className="bid-detail">
            <label>Book Name:</label>
            <p>{bookData?.name}</p>
          </div>
          <div className="bid-detail">
            <label>Category:</label>
            <p>{bookData?.category}</p>
          </div>
          <div className="bid-detail">
            <label>Author:</label>
            <p>{bookData?.author}</p>
          </div>

          {/* Bid Start Date */}
          <div className="bid-detail">
            <label>Bid Start Date:</label>
            <input
              type="date"
              value={formatDate(bidData.startDate)}
              min={new Date().toISOString().split("T")[0]} 
              onChange={(e) => setBidData({ ...bidData, startDate: e.target.value })}
            />
          </div>

          {/* Bid End Date */}
          <div className="bid-detail">
            <label>Bid End Date:</label>
            <input
              type="date"
              value={formatDate(bidData.endDate)}
              min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0]} 
              onChange={(e) => setBidData({ ...bidData, endDate: e.target.value })}
            />
          </div>

          {/* Bid Location */}
          <div className="bid-detail">
            <label>Bid Location:</label>
            <input
              type="text"
              value={bidData.location}
              onChange={(e) => setBidData({ ...bidData, location: e.target.value })}
              placeholder="Enter location"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="buttons">
          <button className="update" onClick={handleUpdateBid}>Update Bid</button>
          <button className="delete" onClick={handleDeleteBid}>Delete Bid</button>
          <button className="view" onClick={handleViewBid}>View My Bid</button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BiddingSuccess;






