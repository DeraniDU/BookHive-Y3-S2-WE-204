import React from "react";
import { useNavigate } from "react-router-dom";  // Importing useNavigate hook for navigation
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./view-placebid.css";

const ViewPlaceBid = () => {
  const navigate = useNavigate();

  const handlePlaceBidClick = () => {
    // Navigate to the BookBidForm when Place Bid button is clicked
    navigate("/bidding");
  };

  return (
    <div>
      <Header />
      <div className="view-placebid-container">
        <h2>Choose an Action</h2>
        <div className="button-container">
          <button onClick={handlePlaceBidClick}>Place a Bid</button>
          <button>View Bids</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewPlaceBid;
