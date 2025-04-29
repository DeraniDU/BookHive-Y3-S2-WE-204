import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./Exbid.css";

const Exbid = () => {
  const navigate = useNavigate();
  const [bidData, setBidData] = useState([]);

  useEffect(() => {
    const storedBids = JSON.parse(localStorage.getItem("bidData"));
    if (storedBids && Array.isArray(storedBids) && storedBids.length > 0) {
      setBidData(storedBids);
    } else {
      navigate("/bidding-success");
    }
  }, [navigate]);

  return (
    <div>
      <Header />
      <div className="exbid-container">
        <h2>My Bid Details</h2>
        {bidData.length > 0 ? (
          <div className="card-container">
            {bidData.map((bid, index) => (
              <div key={index} className="bid-card">
                <p><strong>Bid {index + 1}</strong></p>
                <div className="bid-info">
                  <p><strong>Start Date:</strong> {bid.startDate}</p>
                  <p><strong>End Date:</strong> {bid.endDate}</p>
                  <p><strong>Location:</strong> {bid.location}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No active bids found.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Exbid;
