import React from "react";
import { useNavigate } from "react-router-dom"; // Importing useNavigate hook for navigation
import Header from "../../components/Header"; // Ensure the correct path for Header component
import Footer from "../../components/Footer"; // Ensure Footer component path is correct
import "./view-placebid.css"; // Styling file for this component

const ViewPlaceBid = () => {
  const navigate = useNavigate(); // Initialize navigate function

  // Navigate to the Bidding page when Place Bid button is clicked
  const handlePlaceBidClick = () => {
    navigate("/bidding"); // Navigate to Bidding page (ensure this route is configured)
  };

  // Navigate to the Exbid page when View Bids button is clicked
  const handleViewBidsClick = () => {
    navigate("/Exbid"); // Navigate to Exbid page (ensure this route is configured)
  };

  return (
    <div>
      <Header /> {/* Header component */}

      <div className="view-placebid-container">
        <h2>Choose an Action</h2> {/* Heading */}
        <div className="button-container">
          {/* Buttons to either place a bid or view bids */}
          <button onClick={handlePlaceBidClick}>Place a Bid</button>
          <button onClick={handleViewBidsClick}>View Bids</button>
        </div>
      </div>

      <Footer /> {/* Footer component */}
    </div>
  );
};

export default ViewPlaceBid;
