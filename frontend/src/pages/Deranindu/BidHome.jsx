// BidHome.jsx
import React, { useState, useEffect } from "react";
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
  
  // Get bookId from URL query params
  const queryParams = new URLSearchParams(location.search);
  const bookId = queryParams.get('bookId');

  // State for book data
  const [bookData, setBookData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New fields for bidding
  const [bidData, setBidData] = useState({
    startDate: new Date().toISOString().split("T")[0], // Today's date
    endDate: "",
    location: "",
  });

  // State to track if the book details are in edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [bidErrors, setBidErrors] = useState({});

  // Fetch book data from API
  useEffect(() => {
    const fetchBookData = async () => {
      if (!bookId) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await getBookListingById(bookId);
        setBookData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching book data:", err);
        setError("Failed to load book data. Please try again.");
        setLoading(false);
      }
    };
    
    fetchBookData();
  }, [bookId]);

  // Handle changes for bid fields
  const handleBidChange = (e) => {
    const { name, value } = e.target;
    setBidData({ ...bidData, [name]: value });
    
    // Clear error when field is edited
    if (bidErrors[name]) {
      setBidErrors({ ...bidErrors, [name]: "" });
    }
  };

  // Handle changes for book details fields
  const handleBookChange = (e) => {
    const { name, value } = e.target;
    setBookData({ ...bookData, [name]: value });
  };

  // Update book details
  const handleUpdate = () => {
    setIsEditing(true);
  };

  // Save the updated book details with validation
  const handleSaveUpdate = async () => {
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

    try {
      // Convert price and year to numbers if they're strings
      const formattedData = {
        ...bookData,
        price: typeof bookData.price === 'string' ? Number(bookData.price) : bookData.price,
        year: typeof bookData.year === 'string' ? Number(bookData.year) : bookData.year
      };
      
      // Send update to API
      await updateBookListing(bookData._id, formattedData);
      setIsEditing(false);
      Swal.fire("Success", "Book details updated successfully!", "success");
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Failed to update book details", "error");
    }
  };

  // Cancel the update
  const handleCancelUpdate = () => {
    setIsEditing(false);
    // Reload the original data
    getBookListingById(bookId).then(response => {
      setBookData(response.data);
    });
  };

  // Delete the book entry
  const handleDelete = async () => {
    // Confirm deletion
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });
    
    if (result.isConfirmed) {
      try {
        await deleteBookListing(bookData._id);
        Swal.fire("Deleted!", "Book details deleted successfully!", "success");
        navigate('/');
      } catch (error) {
        Swal.fire("Error", error.response?.data?.message || "Failed to delete book", "error");
      }
    }
  };

  // Validate bid data
  const validateBidData = () => {
    const newErrors = {};
    const today = new Date().toISOString().split("T")[0];
    
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
    
    if (!bidData.location) {
      newErrors.location = "Location is required";
    }
    
    setBidErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Place bid functionality
  const handlePlaceBid = async () => {
    if (!validateBidData()) {
      return;
    }

    try {
      // Create bid in API
      const response = await createBid({
        bookListing: bookData._id,
        startDate: bidData.startDate,
        endDate: bidData.endDate,
        location: bidData.location
      });
      
      Swal.fire("Success", "Bid placed successfully!", "success");
      navigate(`/bidding-success?bidId=${response.data._id}`);
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Failed to place bid", "error");
    }
  };

  // Cancel bid functionality
  const handleCancel = () => {
    setBidData({
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      location: ""
    });
    setBidErrors({});
    Swal.fire("Cancelled", "Bid process cancelled.", "info");
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="bid-home-container">
          <div className="loading-spinner">Loading book details...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="bid-home-container">
          <div className="error-message">{error}</div>
          <button className="btn-primary" onClick={() => navigate('/')}>Go Back</button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="bid-home-container">
        <h2>Book Details</h2>
        {bookData._id ? (
          <div className="book-details-card">
            <div className="book-detail">
              <label>Book Name:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={bookData.name || ""}
                  onChange={handleBookChange}
                  required
                />
              ) : (
                <p>{bookData.name}</p>
              )}
            </div>
            <div className="book-detail">
              <label>Category:</label>
              {isEditing ? (
                <select
                  name="category"
                  value={bookData.category || ""}
                  onChange={handleBookChange}
                  required
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
                  value={bookData.author || ""}
                  onChange={handleBookChange}
                  required
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
                  value={bookData.price || ""}
                  onChange={handleBookChange}
                  min="0"
                  step="0.01"
                  required
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
                  value={bookData.year || ""}
                  onChange={handleBookChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  required
                />
              ) : (
                <p>{bookData.year}</p>
              )}
            </div>
            <div className="book-detail">
              <label>Condition:</label>
              {isEditing ? (
                <select
                  name="condition"
                  value={bookData.condition || ""}
                  onChange={handleBookChange}
                  required
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
              ) : (
                <p>{bookData.condition}</p>
              )}
            </div>
            <div className="book-detail">
              <label>Description:</label>
              {isEditing ? (
                <textarea
                  name="description"
                  value={bookData.description || ""}
                  onChange={handleBookChange}
                  rows="4"
                  required
                ></textarea>
              ) : (
                <p>{bookData.description}</p>
              )}
            </div>

            <div className="book-actions">
              {isEditing ? (
                <>
                  <button className="btn-primary" onClick={handleSaveUpdate}>Save</button>
                  <button className="btn-secondary" onClick={handleCancelUpdate}>Cancel</button>
                </>
              ) : (
                <>
                  <button className="btn-primary" onClick={handleUpdate}>Update</button>
                  <button className="btn-danger" onClick={handleDelete}>Delete</button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="no-data-message">
            <p>No book details available. Please submit a book first.</p>
            <button className="btn-primary" onClick={() => navigate('/book-bid-form')}>Add a Book</button>
          </div>
        )}

        {bookData._id && (
          <>
            <h2>Create Bid</h2>
            <div className="bid-form-card">
              <div className="bid-detail">
                <label htmlFor="startDate">Bid Start Date:</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={bidData.startDate}
                  onChange={handleBidChange}
                  min={new Date().toISOString().split("T")[0]}
                  className={bidErrors.startDate ? "error" : ""}
                />
                {bidErrors.startDate && <span className="error-message">{bidErrors.startDate}</span>}
              </div>
              <div className="bid-detail">
                <label htmlFor="endDate">Bid End Date:</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={bidData.endDate}
                  onChange={handleBidChange}
                  min={bidData.startDate}
                  className={bidErrors.endDate ? "error" : ""}
                />
                {bidErrors.endDate && <span className="error-message">{bidErrors.endDate}</span>}
              </div>
              <div className="bid-detail">
                <label htmlFor="location">Bid Location:</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={bidData.location}
                  onChange={handleBidChange}
                  placeholder="e.g., New York, NY"
                  className={bidErrors.location ? "error" : ""}
                />
                {bidErrors.location && <span className="error-message">{bidErrors.location}</span>}
              </div>

              <div className="bid-actions">
                <button className="btn-primary" onClick={handlePlaceBid}>Place Bid</button>
                <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
};

export default BidHome;