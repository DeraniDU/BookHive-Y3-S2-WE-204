import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./BiddingSuccess.css";
import { getBidById, updateBid, deleteBid } from "../../api";

const BiddingSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bidId = queryParams.get('bidId');

  const [bidData, setBidData] = useState(null);
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [bidStatus, setBidStatus] = useState("not-started");
  const [progressPercent, setProgressPercent] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedBidData, setUpdatedBidData] = useState({
    location: ""
  });
  
  // Fetch bid data
  const fetchBidData = useCallback(async () => {
    if (!bidId) {
      setError("No bid ID provided");
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await getBidById(bidId);
      if (!response.data) throw new Error("Bid not found");
      
      setBidData(response.data);
      setBookData(response.data.bookListing);
      setUpdatedBidData({
        location: response.data.location || ""
      });
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      
      Swal.fire({
        icon: "error",
        title: "Error Loading Bid",
        text: err.message,
      }).then(() => navigate('/'));
    } finally {
      setLoading(false);
    }
  }, [bidId, navigate]);

  useEffect(() => {
    fetchBidData();
  }, [fetchBidData]);

  // Countdown timer and status calculation
  useEffect(() => {
    if (!bidData) return;
    
    const startDate = new Date(bidData.startDate).getTime();
    const endDate = new Date(bidData.endDate).getTime();
    const now = new Date().getTime();
    
    // Calculate bid status
    if (now < startDate) {
      setBidStatus("not-started");
    } else if (now >= startDate && now < endDate) {
      setBidStatus("active");
    } else {
      setBidStatus("expired");
    }
    
    // Calculate progress percentage
    const totalDuration = endDate - startDate;
    const elapsed = now - startDate;
    const progress = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
    setProgressPercent(progress);
    
    // Target date for countdown
    const targetDate = now < startDate ? startDate : endDate;
    
    const updateCountdown = () => {
      const currentTime = new Date().getTime();
      const distance = targetDate - currentTime;
      
      if (distance < 0) {
        // Countdown has ended
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
        
        // Update status if needed
        if (currentTime >= endDate && bidStatus !== "expired") {
          setBidStatus("expired");
        } else if (currentTime >= startDate && bidStatus === "not-started") {
          setBidStatus("active");
        }
        
        return;
      }
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      setTimeRemaining({ days, hours, minutes, seconds });
    };
    
    // Initial update
    updateCountdown();
    
    // Update every second
    const intervalId = setInterval(updateCountdown, 1000);
    
    // Cleanup
    return () => clearInterval(intervalId);
  }, [bidData, bidStatus]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedBidData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateBid = async () => {
    if (isEditing) {
      try {
        if (!updatedBidData.location.trim()) {
          Swal.fire({
            icon: "error",
            title: "Validation Error",
            text: "Location cannot be empty"
          });
          return;
        }

        const response = await updateBid(bidId, updatedBidData);
        setBidData(response.data);
        setBookData(response.data.bookListing);
        setIsEditing(false);
          
        Swal.fire({
          icon: "success",
          title: "Bid Updated",
          text: "Your bid has been updated successfully"
        });
      } catch (err) {
        console.error("Update error:", err);
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: err.response?.data?.message || err.message || "Failed to update bid"
        });
      }
    } else {
      Swal.fire({
        title: "Update Bid",
        text: "Do you want to modify your bid?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, update"
      }).then((result) => {
        if (result.isConfirmed) {
          setIsEditing(true);
        }
      });
    }
  };

  const handleCancelEdit = () => {
    setUpdatedBidData({
      location: bidData?.location || ""
    });
    setIsEditing(false);
  };

  const handleDeleteBid = async () => {
    const result = await Swal.fire({
      title: "Confirm Delete",
      text: "This cannot be undone. Are you sure you want to cancel your bid?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete"
    });
    
    if (result.isConfirmed) {
      try {
        await deleteBid(bidId);
        Swal.fire("Deleted", "Your bid has been cancelled", "success");
        navigate('/');
      } catch (err) {
        console.error("Delete error:", err);
        Swal.fire("Error", "Failed to delete bid", "error");
      }
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading bid details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !bidData) {
    return (
      <>
        <Header />
        <div className="error-container">
          <h3>Error Loading Bid</h3>
          <p>{error || "Bid not found"}</p>
          <button onClick={() => navigate('/')}>Return Home</button>
        </div>
        <Footer />
      </>
    );
  }

  // Function to format date nicely
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper to render bid timer status text
  const getBidTimerText = () => {
    if (bidStatus === "not-started") return "Bidding Opens In";
    if (bidStatus === "active") return "Bidding Closes In";
    return "Bidding Ended";
  };

  return (
    <>
      <Header />
      <div className="bidding-success-container">
        <div className="success-banner">
          <div className="success-icon">✓</div>
          <h2>Bid Placed Successfully!</h2>
          <p>Your bid for <strong>{bookData.name}</strong> has been confirmed.</p>
        </div>
        
        <div className="bid-details-wrapper">
          <div className="success-header">
            <h2>Bid Details</h2>
            <span className={`bid-status ${bidStatus}`}>
              {bidStatus === "not-started" ? "Not Started" : 
               bidStatus === "active" ? "Active" : "Expired"}
            </span>
          </div>
          
          <div className="bid-timeline">
            <div className="timeline-container">
              <div className="timeline-track"></div>
              <div className="timeline-progress" style={{ width: `${progressPercent}%` }}></div>
              <div className="timeline-marker start">
                <div className="marker-dot"></div>
                <div className="marker-info">
                  <span className="marker-label">Start</span>
                  <span className="marker-date">{formatDate(bidData.startDate)}</span>
                </div>
              </div>
              <div className="timeline-marker end">
                <div className="marker-dot"></div>
                <div className="marker-info">
                  <span className="marker-label">End</span>
                  <span className="marker-date">{formatDate(bidData.endDate)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="countdown-section">
            <div className="countdown-header">
              <h3>{getBidTimerText()}</h3>
            </div>
            <div className="countdown-container">
              <div className="countdown">
                <div className="countdown-item">
                  <div className="countdown-value">{String(timeRemaining.days).padStart(2, '0')}</div>
                  <div className="countdown-label">Days</div>
                </div>
                <div className="countdown-separator">:</div>
                <div className="countdown-item">
                  <div className="countdown-value">{String(timeRemaining.hours).padStart(2, '0')}</div>
                  <div className="countdown-label">Hours</div>
                </div>
                <div className="countdown-separator">:</div>
                <div className="countdown-item">
                  <div className="countdown-value">{String(timeRemaining.minutes).padStart(2, '0')}</div>
                  <div className="countdown-label">Minutes</div>
                </div>
                <div className="countdown-separator">:</div>
                <div className="countdown-item">
                  <div className="countdown-value">{String(timeRemaining.seconds).padStart(2, '0')}</div>
                  <div className="countdown-label">Seconds</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="details-container">
          <div className="book-details-section">
            <h3>Book Information</h3>
            <div className="book-card">
              {bookData.photos && bookData.photos.length > 0 ? (
                <img 
                  src={bookData.photos[0].url || bookData.photos[0]} 
                  alt={bookData.name}
                  className="book-cover"
                />
              ) : (
                <div className="no-image-placeholder">No image available</div>
              )}
              
              <div className="book-info">
                <h4>{bookData.name}</h4>
                <div className="detail-item">
                  <span className="detail-label">Author:</span>
                  <span className="detail-value">{bookData.author}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Category:</span>
                  <span className="detail-value">{bookData.category}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Condition:</span>
                  <span className="detail-value">{bookData.condition}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Price:</span>
                  <span className="detail-value price">₹{bookData.price}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bid-details-section">
            <h3>Bid Information</h3>
            <div className="bid-info-card">
              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-label">Bid ID:</span>
                  <span className="detail-value">{bidData._id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Location:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={updatedBidData.location}
                      onChange={handleInputChange}
                      className="edit-input"
                    />
                  ) : (
                    <span className="detail-value">{bidData.location}</span>
                  )}
                </div>
              </div>
              
              <div className="detail-row">
                <div className="detail-item date-item">
                  <span className="detail-label">Start Date:</span>
                  <span className="detail-value date-value">{formatDate(bidData.startDate)}</span>
                </div>
                <div className="detail-item date-item">
                  <span className="detail-label">End Date:</span>
                  <span className="detail-value date-value">{formatDate(bidData.endDate)}</span>
                </div>
              </div>
              
              <div className="highest-bid">
                <h4>Current Status</h4>
                <div className="detail-item">
                  <span className="detail-label">Status:</span>
                  <span className={`detail-value status-${bidStatus}`}>
                    {bidStatus === "not-started" ? "Waiting to Start" : 
                     bidStatus === "active" ? "Bidding Active" : "Bidding Closed"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="action-buttons">
          {isEditing ? (
            <>
              <button 
                onClick={handleUpdateBid}
                className="btn-primary"
              >
                Save Changes
              </button>
              <button 
                onClick={handleCancelEdit}
                className="btn-secondary"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={handleUpdateBid} 
                className="btn-primary"
                disabled={bidStatus === "expired"}
              >
                Update Bid
              </button>
              <button 
                onClick={handleDeleteBid} 
                className="btn-danger"
                disabled={bidStatus === "expired"}
              >
                Cancel Bid
              </button>
            </>
          )}
          <button 
            onClick={() => navigate('/')} 
            className="btn-secondary"
          >
            Return Home
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BiddingSuccess;