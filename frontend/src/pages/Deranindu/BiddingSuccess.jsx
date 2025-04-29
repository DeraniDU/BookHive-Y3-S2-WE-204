import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  Divider,
  Card,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Tab,
  Tabs,
  Tooltip,
  Badge
} from '@mui/material';
import { 
  Check as CheckIcon, 
  Delete as DeleteIcon, 
  Visibility as VisibilityIcon,
  Update as UpdateIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationIcon,
  MenuBook as MenuBookIcon,
  Person as PersonIcon,
  Info as InfoIcon,
  ArrowUpward as ArrowUpwardIcon,
  LocalOffer as LocalOfferIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

const BiddingSuccess = () => {
  const navigate = useNavigate();

  // Fetching stored data from localStorage
  const storedBookData = JSON.parse(localStorage.getItem("bookBid"));
  const storedBidData = JSON.parse(localStorage.getItem("bidData")) || {};

  const [bookData, setBookData] = useState(storedBookData || {});
  const [bidData, setBidData] = useState(storedBidData);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [timeRemaining, setTimeRemaining] = useState(0); // For progress bar
  const [totalTime, setTotalTime] = useState(0);
  const [bidStatus, setBidStatus] = useState("Not Started"); // "Not Started", "Active", or "Expired"
  const [currentTab, setCurrentTab] = useState(0);
  
  // Mock data for other bids
  const [otherBids, setOtherBids] = useState([]);

  useEffect(() => {
    // Generate mock data for other bids
    const mockBids = [
      {
        id: 1,
        bookName: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        category: "Classic Fiction",
        highestBid: 45.50,
        totalBids: 8,
        endDate: addDays(new Date(), 2),
        bidders: ["John D.", "Emma S.", "Michael R."],
        isHot: true
      },
      {
        id: 2,
        bookName: "To Kill a Mockingbird",
        author: "Harper Lee",
        category: "Classic Fiction",
        highestBid: 38.75,
        totalBids: 5,
        endDate: addDays(new Date(), 1),
        bidders: ["Sarah L.", "Robert T."],
        isHot: true
      },
      {
        id: 3,
        bookName: "The Hobbit",
        author: "J.R.R. Tolkien",
        category: "Fantasy",
        highestBid: 52.00,
        totalBids: 12,
        endDate: addDays(new Date(), 3),
        bidders: ["Alex M.", "David W.", "Sophia G.", "James B."],
        isHot: false
      },
      {
        id: 4,
        bookName: "Pride and Prejudice",
        author: "Jane Austen",
        category: "Classic Romance",
        highestBid: 31.25,
        totalBids: 6,
        endDate: addDays(new Date(), 4),
        bidders: ["William T.", "Olivia P."],
        isHot: false
      },
      {
        id: 5,
        bookName: "1984",
        author: "George Orwell",
        category: "Dystopian Fiction",
        highestBid: 42.80,
        totalBids: 9,
        endDate: addHours(new Date(), 12),
        bidders: ["Thomas H.", "Emily R.", "Daniel K."],
        isHot: true
      }
    ];
    
    setOtherBids(mockBids);
  }, []);

  function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  
  function addHours(date, hours) {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
  }

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

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

  // Format date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get time left in hours for other bids
  const getTimeLeft = (endDate) => {
    const now = new Date();
    const diff = endDate - now;
    
    if (diff <= 0) return "Ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h left`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    } else {
      return `${minutes}m left`;
    }
  };

  // Countdown timer logic
  useEffect(() => {
    let interval;
    
    const calculateTimeLeft = () => {
      const now = new Date();
      let targetDate;
      let statusValue;
      
      const startDate = bidData.startDate ? new Date(bidData.startDate) : null;
      const endDate = bidData.endDate ? new Date(bidData.endDate) : null;
      
      // Set end time to 23:59:59 on the end date
      if (endDate) {
        endDate.setHours(23, 59, 59, 999);
      }
      
      // Determine which date to countdown to and the bid status
      if (startDate && now < startDate) {
        targetDate = startDate;
        statusValue = "Not Started";
      } else if (endDate && now < endDate) {
        targetDate = endDate;
        statusValue = "Active";
      } else {
        statusValue = "Expired";
        targetDate = null;
      }
      
      setBidStatus(statusValue);
      
      if (!targetDate) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }
      
      const difference = targetDate - now;
      
      // Calculate the total time for progress bar
      if (statusValue === "Not Started" && startDate && endDate) {
        const totalDuration = endDate - startDate;
        setTotalTime(totalDuration);
        setTimeRemaining(endDate - now);
      } else if (statusValue === "Active" && endDate) {
        const activeDuration = endDate - startDate;
        setTotalTime(activeDuration);
        setTimeRemaining(endDate - now);
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    };
    
    if (bidData.startDate && bidData.endDate) {
      // Initial calculation
      setCountdown(calculateTimeLeft());
      
      // Update every second
      interval = setInterval(() => {
        setCountdown(calculateTimeLeft());
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [bidData.startDate, bidData.endDate]);

  // Get progress percentage for the progress bar
  const getProgressPercentage = () => {
    if (totalTime <= 0) return 0;
    const percentage = ((totalTime - timeRemaining) / totalTime) * 100;
    return Math.min(Math.max(percentage, 0), 100); // Ensure between 0-100
  };
  
  // Get color based on time remaining
  const getStatusColor = () => {
    switch (bidStatus) {
      case "Not Started":
        return "info";
      case "Active":
        return "success";
      case "Expired":
        return "error";
      default:
        return "default";
    }
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

  // Handle bid on other books
  const handleBidOnBook = (bookId) => {
    // This would typically navigate to a bid page or open a bid modal
    Swal.fire({
      icon: 'info',
      title: 'Place Bid',
      text: `Navigating to bidding page for book ID: ${bookId}`,
    });
  };

  return (
    <>
      <Header />
      
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3
            }}
          >
            <Typography variant="h4" component="h2" sx={{ 
              mb: 2,
              color: 'primary.main',
              fontWeight: 'bold'
            }}>
              Bid Placement Successful
            </Typography>
            <CheckIcon color="success" sx={{ fontSize: 48 }} />
          </Box>

          {/* Countdown Timer Card */}
          <Card 
            elevation={4} 
            sx={{ 
              mb: 4, 
              p: 3, 
              backgroundColor: bidStatus === "Active" ? '#f0f7ff' : 
                             bidStatus === "Expired" ? '#fff0f0' : '#f5f5f5',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <AccessTimeIcon sx={{ mr: 1 }} />
                {bidStatus === "Not Started" ? "Bid Starts In:" : 
                 bidStatus === "Active" ? "Bid Ends In:" : "Bid Has Ended"}
              </Typography>
              <Chip 
                label={bidStatus} 
                color={getStatusColor()} 
                variant="filled" 
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
            
            {bidStatus !== "Expired" && (
              <>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: 2, 
                  my: 2 
                }}>
                  <CountdownUnit value={countdown.days} label="Days" />
                  <CountdownUnit value={countdown.hours} label="Hours" />
                  <CountdownUnit value={countdown.minutes} label="Minutes" />
                  <CountdownUnit value={countdown.seconds} label="Seconds" />
                </Box>
                
                <Box sx={{ mt: 2, mb: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={getProgressPercentage()} 
                    color={getStatusColor()}
                    sx={{ height: 8, borderRadius: 2 }}
                  />
                </Box>
              </>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Start Date</Typography>
                <Typography variant="body2">{formatDisplayDate(bidData.startDate)}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">End Date</Typography>
                <Typography variant="body2">{formatDisplayDate(bidData.endDate)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <LocationIcon fontSize="small" sx={{ mr: 0.5, mt: 0.3, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                  <Typography variant="body2">{bidData.location || 'Not specified'}</Typography>
                </Box>
              </Box>
            </Box>
          </Card>

          <Divider sx={{ mb: 3 }} />

          {/* Book Details Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
              Book Details
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">Book Name</Typography>
                <Typography variant="body1">{bookData?.name || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                <Typography variant="body1">{bookData?.category || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">Author</Typography>
                <Typography variant="body1">{bookData?.author || 'N/A'}</Typography>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Bid Details Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
              Bid Details
            </Typography>
            
            <Grid container spacing={3}>
              {/* Bid Start Date */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bid Start Date"
                  type="date"
                  value={formatDate(bidData.startDate)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ 
                    min: new Date().toISOString().split("T")[0]
                  }}
                  onChange={(e) => setBidData({ ...bidData, startDate: e.target.value })}
                />
              </Grid>

              {/* Bid End Date */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bid End Date"
                  type="date"
                  value={formatDate(bidData.endDate)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ 
                    min: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0]
                  }}
                  onChange={(e) => setBidData({ ...bidData, endDate: e.target.value })}
                />
              </Grid>

              {/* Bid Location */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bid Location"
                  value={bidData.location}
                  onChange={(e) => setBidData({ ...bidData, location: e.target.value })}
                  placeholder="Enter location"
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Box>

          {/* Buttons */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              gap: 2,
              flexWrap: 'wrap',
              mt: 2
            }}
          >
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleUpdateBid}
              startIcon={<UpdateIcon />}
              sx={{ minWidth: '140px' }}
            >
              Update Bid
            </Button>
            <Button 
              variant="outlined" 
              color="error" 
              onClick={handleDeleteBid}
              startIcon={<DeleteIcon />}
              sx={{ minWidth: '140px' }}
            >
              Delete Bid
            </Button>
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={handleViewBid}
              startIcon={<VisibilityIcon />}
              sx={{ minWidth: '150px' }}
            >
              View My Bid
            </Button>
          </Box>
        </Paper>

        {/* Other Bids Section */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mt: 4 }}>
          <Typography variant="h5" component="h2" sx={{ 
            mb: 3,
            color: 'primary.main',
            fontWeight: 'bold'
          }}>
            Other Active Bids
          </Typography>

          <Tabs
            value={currentTab}
            onChange={handleChangeTab}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            sx={{ mb: 3 }}
          >
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTimeIcon sx={{ mr: 1 }} />
                  <Typography>Active Bids</Typography>
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocalOfferIcon sx={{ mr: 1 }} />
                  <Typography>Hot Bids</Typography>
                  <Badge 
                    badgeContent={otherBids.filter(bid => bid.isHot).length} 
                    color="error" 
                    sx={{ ml: 1 }}
                  />
                </Box>
              } 
            />
          </Tabs>

          <List sx={{ width: '100%' }}>
            {otherBids
              .filter(bid => currentTab === 0 || (currentTab === 1 && bid.isHot))
              .map((bid) => (
                <React.Fragment key={bid.id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{ 
                      borderRadius: 2,
                      mb: 2,
                      bgcolor: 'background.paper',
                      boxShadow: 1,
                      '&:hover': {
                        bgcolor: 'action.hover',
                      }
                    }}
                    secondaryAction={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ textAlign: 'right', mr: 2 }}>
                          <Typography component="span" variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                            ${bid.highestBid.toFixed(2)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                            {getTimeLeft(bid.endDate)}
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleBidOnBook(bid.id)}
                          endIcon={<ArrowForwardIcon />}
                        >
                          Bid Now
                        </Button>
                      </Box>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: bid.isHot ? 'error.main' : 'primary.main' }}>
                        <MenuBookIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {bid.bookName}
                          </Typography>
                          {bid.isHot && (
                            <Chip 
                              label="Hot" 
                              size="small" 
                              color="error" 
                              sx={{ ml: 1 }} 
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {bid.author}
                          </Typography>
                          {" — "}
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                          >
                            Category: {bid.category}
                          </Typography>
                          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                            <Chip 
                              size="small" 
                              label={`${bid.totalBids} bids`} 
                              sx={{ mr: 1 }} 
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <PersonIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {bid.bidders.slice(0, 2).join(", ")}
                                {bid.bidders.length > 2 && ` +${bid.bidders.length - 2} more`}
                              </Typography>
                            </Box>
                            <Tooltip title="Trending upward">
                              <IconButton size="small" color="success">
                                <ArrowUpwardIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  {otherBids.indexOf(bid) < otherBids.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
          </List>
          
          {otherBids.filter(bid => currentTab === 0 || (currentTab === 1 && bid.isHot)).length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <InfoIcon color="disabled" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No {currentTab === 1 ? 'hot' : ''} bids available at the moment
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>

      <Footer />
    </>
  );
};

// Countdown Unit Component
const CountdownUnit = ({ value, label }) => (
  <Box sx={{ 
    textAlign: 'center', 
    mx: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <Paper 
      elevation={2} 
      sx={{ 
        width: 60, 
        height: 60, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderRadius: 2,
        backgroundColor: '#f9f9f9',
        mb: 0.5
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
        {String(value).padStart(2, '0')}
      </Typography>
    </Paper>
    <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
      {label}
    </Typography>
  </Box>
);

export default BiddingSuccess;