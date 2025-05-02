// Exbid.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./Exbid.css";
import { getBids } from "../../api";

const Exbid = () => {
  const navigate = useNavigate();
  const [bidData, setBidData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // "all", "active", "not-started", "expired"

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await getBids();
        setBidData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bids:", err);
        setError("Failed to load bids. Please try again.");
        setLoading(false);
      }
    };
    
    fetchBids();
  }, []);

  // Filter bids based on status
  const filteredBids = bidData.filter(bid => {
    if (filter === "all") return true;
    return bid.status.toLowerCase().replace(' ', '-') === filter;
  });

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // View bid details
  const handleViewBid = (bidId) => {
    navigate(`/bidding-success?bidId=${bidId}`);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get highest bid amount for a bid
  const getHighestBidAmount = (bids) => {
    if (!bids || bids.length === 0) return "No bids yet";
    const highestBid = bids.reduce((prev, current) => {
      return (prev.amount > current.amount) ? prev : current;
    });
    return highestBid.amount;
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="exbid-container">
          <div className="loading-spinner">Loading bids...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className="exbid-container">
          <div className="error-message">{error}</div>
          <button className="btn-primary" onClick={() => navigate('/')}>Go Back</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="exbid-container">
        <div className="exbid-header">
          <h2>All Bids</h2>
          <div className="filter-container">
            <label htmlFor="filter">Filter by status:</label>
            <select id="filter" value={filter} onChange={handleFilterChange}>
              <option value="all">All Bids</option>
              <option value="active">Active</option>
              <option value="not-started">Not Started</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        {filteredBids.length > 0 ? (
          <div className="bid-cards-container">
            {filteredBids.map((bid) => (
              <div key={bid._id} className={`bid-card ${bid.status.toLowerCase().replace(' ', '-')}`}>
                <div className="bid-card-header">
                  <h3>{bid.bookListing.name}</h3>
                  <span className={`bid-status ${bid.status.toLowerCase().replace(' ', '-')}`}>
                    {bid.status}
                  </span>
                </div>
                <div className="bid-card-content">
                  <p><strong>Author:</strong> {bid.bookListing.author}</p>
                  <p><strong>Category:</strong> {bid.bookListing.category}</p>
                  <p><strong>Start Date:</strong> {formatDate(bid.startDate)}</p>
                  <p><strong>End Date:</strong> {formatDate(bid.endDate)}</p>
                  <p><strong>Location:</strong> {bid.location}</p>
                  <p><strong>Total Bids:</strong> {bid.bids.length}</p>
                  <p><strong>Highest Bid:</strong> {getHighestBidAmount(bid.bids)}</p>
                </div>
                <div className="bid-card-actions">
                  <button className="btn-primary" onClick={() => handleViewBid(bid._id)}>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-bids-message">
            <p>No bids found with the selected filter.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Exbid;
