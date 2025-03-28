import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import Header from "../../components/Header"; // Corrected import path
import Footer from "../../components/Footer"; // Corrected import path
import "./BiddingSuccess.css";

const BiddingSuccess = () => {
  const navigate = useNavigate();

  // Load bid data from localStorage
  const storedBookData = JSON.parse(localStorage.getItem("bookBid"));
  const storedBidData = JSON.parse(localStorage.getItem("bidData")) || {};

  const [bookData, setBookData] = useState(storedBookData || {});
  const [bidData, setBidData] = useState(storedBidData);

  // Set default values if no bid data is found
  useEffect(() => {
    if (!storedBidData.startDate || !storedBidData.endDate || !storedBidData.location) {
      setBidData({
        ...storedBidData,
        startDate: storedBidData.startDate || "",
        endDate: storedBidData.endDate || "",
        location: storedBidData.location || "",
      });
    }
  }, [storedBidData]);

  // Update bid details
  const handleUpdateBid = () => {
    if (!bidData.startDate || !bidData.endDate || !bidData.location) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter start date, end date, and location for the bid.',
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

  // Delete bid
  const handleDeleteBid = () => {
    localStorage.removeItem("bidData");
    Swal.fire({
      icon: 'success',
      title: 'Deleted!',
      text: 'Bid deleted successfully!',
    }).then(() => {
      navigate("/"); // Redirect to home page or previous page
    });
  };

  // View placed bid
  const handleViewBid = () => {
    navigate("/view-bid"); // Assuming "/view-bid" route exists
  };

  return (
    <div>
      {/* Header is outside of the container */}
      <Header />

      {/* Main content for the form goes here */}
      <div className="bidding-success-container">
        <h2>Bid Placement Successful</h2>
        <div className="bid-details">
          <div className="bid-detail">
            <label>Book Name:</label>
            <p>{bookData.name}</p>
          </div>
          <div className="bid-detail">
            <label>Category:</label>
            <p>{bookData.category}</p>
          </div>
          <div className="bid-detail">
            <label>Author:</label>
            <p>{bookData.author}</p>
          </div>
          <div className="bid-detail">
            <label>Bid Start Date:</label>
            <input
              type="date"
              value={bidData.startDate}
              onChange={(e) => setBidData({ ...bidData, startDate: e.target.value })}
            />
          </div>
          <div className="bid-detail">
            <label>Bid End Date:</label>
            <input
              type="date"
              value={bidData.endDate}
              onChange={(e) => setBidData({ ...bidData, endDate: e.target.value })}
            />
          </div>
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

        <div className="buttons">
          <button className="update" onClick={handleUpdateBid}>Update Bid</button>
          <button className="delete" onClick={handleDeleteBid}>Delete Bid</button>
          <button className="view" onClick={handleViewBid}>View My Bid</button>
        </div>
      </div>

      {/* Footer is outside of the container */}
      <Footer />
    </div>
  );
};

export default BiddingSuccess;
