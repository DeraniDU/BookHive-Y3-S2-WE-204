import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import "./BidHome.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { 
  getBookListingById, 
  createBid, 
  updateBookListing, 
  deleteBookListing 
} from "../../api";

const BidHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bookId = queryParams.get('bookId');

  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Create the date values for start and end dates
  const getTodayFormatted = () => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  };
  
  // Calculate tomorrow for minimum end date
  const getTomorrowFormatted = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const [bidData, setBidData] = useState({
    // For startDate, use the current date and time to ensure it's not considered "in the past"
    startDate: getTodayFormatted(),
    endDate: getTomorrowFormatted(),
    location: "",
    userName: "",
    userEmail: "",
    userPhone: ""
  });

  const [bidErrors, setBidErrors] = useState({});
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);

  const fetchBookData = useCallback(async () => {
    if (!bookId) {
      setError("No book ID provided");
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await getBookListingById(bookId);
      if (!response.data) throw new Error("Book not found");
      setBookData(response.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      
      Swal.fire({
        icon: "error",
        title: "Error Loading Book",
        text: err.message,
      }).then(() => navigate('/'));
    } finally {
      setLoading(false);
    }
  }, [bookId, navigate]);

  useEffect(() => {
    fetchBookData();
  }, [fetchBookData]);

  const handleBidChange = (e) => {
    const { name, value } = e.target;
    setBidData(prev => ({ ...prev, [name]: value }));
    if (bidErrors[name]) setBidErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleBookChange = (e) => {
    const { name, value } = e.target;
    setBookData(prev => ({ ...prev, [name]: value }));
  };

  const handleOwnerChange = (e) => {
    const { name, value } = e.target;
    setBookData(prev => ({ 
      ...prev, 
      owner: { 
        ...prev.owner, 
        [name]: value 
      } 
    }));
  };

  const validateBidData = useCallback(() => {
    const newErrors = {};
    const today = getTodayFormatted();
    
    if (!bidData.startDate) {
      newErrors.startDate = "Start date is required";
    } else if (bidData.startDate < today) {
      newErrors.startDate = "Start date cannot be in the past";
    }
    
    if (!bidData.endDate) {
      newErrors.endDate = "End date is required";
    } else if (bidData.endDate <= bidData.startDate) {
      newErrors.endDate = "End date must be after start date";
    }
    
    if (!bidData.location.trim()) {
      newErrors.location = "Location is required";
    }
    
    if (!bidData.userName.trim()) {
      newErrors.userName = "Your name is required";
    }
    
    if (!bidData.userEmail.trim()) {
      newErrors.userEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(bidData.userEmail)) {
      newErrors.userEmail = "Please enter a valid email address";
    }
    
    if (!bidData.userPhone.trim()) {
      newErrors.userPhone = "Phone number is required";
    } else if (!/^\d{10}$/.test(bidData.userPhone.replace(/\D/g, ''))) {
      newErrors.userPhone = "Please enter a valid 10-digit phone number";
    }
    
    setBidErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [bidData]);

  const handlePlaceBid = async () => {
    if (!validateBidData()) return;
    
    setIsSubmittingBid(true);
    
    try {
      // Create a full datetime for start date with the current time
      const startDateTime = new Date();
      startDateTime.setHours(23, 59, 59); // Set to end of today
      
      // Create a full datetime for end date (end of that day)
      const endDateParts = bidData.endDate.split('-');
      const endDateTime = new Date(
        parseInt(endDateParts[0]), 
        parseInt(endDateParts[1]) - 1, // Month is 0-indexed in JavaScript
        parseInt(endDateParts[2]),
        23, 59, 59
      );
      
      const response = await createBid({
        bookListing: bookData._id,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        location: bidData.location,
        userName: bidData.userName,
        userEmail: bidData.userEmail,
        userPhone: bidData.userPhone
      });
      
      Swal.fire({
        icon: "success",
        title: "Bid Placed!",
        text: "Your bid has been successfully created",
      }).then(() => {
        navigate(`/bidding-success?bidId=${response.data._id}`);
      });
    } catch (err) {
      console.error("Bid error:", err);
      Swal.fire({
        icon: "error",
        title: "Bid Failed",
        text: err.response?.data?.message || err.message,
      });
    } finally {
      setIsSubmittingBid(false);
    }
  };

  const handleUpdateBook = async () => {
    try {
      const updatedBook = await updateBookListing(bookData._id, {
        ...bookData,
        price: Number(bookData.price),
        year: Number(bookData.year)
      });
      
      setBookData(updatedBook.data);
      setIsEditing(false);
      Swal.fire("Success", "Book updated successfully", "success");
    } catch (err) {
      console.error("Update error:", err);
      Swal.fire("Error", err.response?.data?.message || "Update failed", "error");
    }
  };

  const handleDeleteBook = async () => {
    const result = await Swal.fire({
      title: "Confirm Delete",
      text: "This cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete"
    });
    
    if (result.isConfirmed) {
      try {
        await deleteBookListing(bookData._id);
        Swal.fire("Deleted", "Book has been removed", "success");
        navigate('/');
      } catch (err) {
        console.error("Delete error:", err);
        Swal.fire("Error", "Failed to delete book", "error");
      }
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading book details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !bookData) {
    return (
      <>
        <Header />
        <div className="error-container">
          <h3>Error Loading Book</h3>
          <p>{error || "Book not found"}</p>
          <button onClick={() => navigate('/')}>Return Home</button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bid-home-container">
        <div className="book-details-section">
          <h2>{isEditing ? "Edit Book" : "Book Details"}</h2>
          
          {isEditing ? (
            <div className="edit-form">
              <div className="form-group">
                <label>Name:</label>
                <input
                  name="name"
                  value={bookData.name || ""}
                  onChange={handleBookChange}
                />
              </div>
              
              <div className="form-group">
                <label>Author:</label>
                <input
                  name="author"
                  value={bookData.author || ""}
                  onChange={handleBookChange}
                />
              </div>
              
              <div className="form-group">
                <label>Category:</label>
                <select
                  name="category"
                  value={bookData.category || ""}
                  onChange={handleBookChange}
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
              </div>
              
              <div className="form-group">
                <label>Price (Rs):</label>
                <input
                  type="number"
                  name="price"
                  value={bookData.price || ""}
                  onChange={handleBookChange}
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="form-group">
                <label>Year of Publication:</label>
                <input
                  type="number"
                  name="year"
                  value={bookData.year || ""}
                  onChange={handleBookChange}
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
              
              <div className="form-group">
                <label>Condition:</label>
                <select
                  name="condition"
                  value={bookData.condition || ""}
                  onChange={handleBookChange}
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
              </div>
              
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={bookData.description || ""}
                  onChange={handleBookChange}
                  rows="4"
                ></textarea>
              </div>
              
              {/* Owner Information Fields */}
              <div className="owner-info-edit">
                <h3>Owner Information</h3>
                
                <div className="form-group">
                  <label>Owner Name:</label>
                  <input
                    name="name"
                    value={(bookData.owner && bookData.owner.name) || ""}
                    onChange={handleOwnerChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Owner Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={(bookData.owner && bookData.owner.email) || ""}
                    onChange={handleOwnerChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Owner Location:</label>
                  <input
                    name="location"
                    value={(bookData.owner && bookData.owner.location) || ""}
                    onChange={handleOwnerChange}
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button onClick={handleUpdateBook}>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="book-display">
              <div className="book-images">
                {bookData.photos && bookData.photos.length > 0 ? (
                  bookData.photos.map((photo, index) => (
                    <img 
                      key={index} 
                      src={photo.url || photo} 
                      alt={`${bookData.name} ${index + 1}`}
                      className="book-image"
                    />
                  ))
                ) : (
                  <div className="no-images">No images available</div>
                )}
              </div>
              
              <div className="book-info">
                <h3>{bookData.name}</h3>
                <p><strong>Author:</strong> {bookData.author}</p>
                <p><strong>Category:</strong> {bookData.category}</p>
                <p><strong>Price:</strong> Rs {bookData.price}</p>
                <p><strong>Year:</strong> {bookData.year}</p>
                <p><strong>Condition:</strong> {bookData.condition}</p>
                <p><strong>Description:</strong> {bookData.description}</p>
                
                {/* Owner Information Display */}
                <div className="owner-info">
                  <h4>Book Owner</h4>
                  <p><strong>Name:</strong> {bookData.owner?.name || "N/A"}</p>
                  <p><strong>Email:</strong> {bookData.owner?.email || "N/A"}</p>
                  <p><strong>Location:</strong> {bookData.owner?.location || "N/A"}</p>
                </div>
                
                <div className="book-actions">
                  <button onClick={() => setIsEditing(true)}>Edit</button>
                  <button 
                    onClick={handleDeleteBook}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bid-section">
          <h2>Place Bid</h2>
          <div className="bid-form">
            <div className="form-group">
              <label>Start Date:</label>
              <input
                type="date"
                name="startDate"
                value={bidData.startDate}
                onChange={handleBidChange}
                min={getTodayFormatted()}
                max={getTodayFormatted()}
              />
              {bidErrors.startDate && (
                <span className="error">{bidErrors.startDate}</span>
              )}
            </div>
            
            <div className="form-group">
              <label>End Date:</label>
              <input
                type="date"
                name="endDate"
                value={bidData.endDate}
                onChange={handleBidChange}
                min={getTomorrowFormatted()}
              />
              {bidErrors.endDate && (
                <span className="error">{bidErrors.endDate}</span>
              )}
            </div>
            
            <div className="form-group">
              <label>Location:</label>
              <input
                type="text"
                name="location"
                value={bidData.location}
                onChange={handleBidChange}
                placeholder="Enter meeting location"
              />
              {bidErrors.location && (
                <span className="error">{bidErrors.location}</span>
              )}
            </div>
            
            <div className="bidder-details">
              <h3>Your Contact Information</h3>
              
              <div className="form-group">
                <label>Your Name:</label>
                <input
                  type="text"
                  name="userName"
                  value={bidData.userName}
                  onChange={handleBidChange}
                  placeholder="Enter your full name"
                />
                {bidErrors.userName && (
                  <span className="error">{bidErrors.userName}</span>
                )}
              </div>
              
              <div className="form-group">
                <label>Email Address:</label>
                <input
                  type="email"
                  name="userEmail"
                  value={bidData.userEmail}
                  onChange={handleBidChange}
                  placeholder="Enter your email address"
                />
                {bidErrors.userEmail && (
                  <span className="error">{bidErrors.userEmail}</span>
                )}
              </div>
              
              <div className="form-group">
                <label>Phone Number:</label>
                <input
                  type="tel"
                  name="userPhone"
                  value={bidData.userPhone}
                  onChange={handleBidChange}
                  placeholder="Enter your phone number"
                />
                {bidErrors.userPhone && (
                  <span className="error">{bidErrors.userPhone}</span>
                )}
              </div>
            </div>
            
            <div className="bid-actions">
              <button 
                onClick={handlePlaceBid}
                disabled={isSubmittingBid}
                className="place-bid-btn"
              >
                {isSubmittingBid ? "Processing..." : "Place Bid"}
              </button>
              <button 
                onClick={() => setBidData({
                  startDate: getTodayFormatted(),
                  endDate: getTomorrowFormatted(),
                  location: "",
                  userName: "",
                  userEmail: "",
                  userPhone: ""
                })}
                className="reset-btn"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BidHome;