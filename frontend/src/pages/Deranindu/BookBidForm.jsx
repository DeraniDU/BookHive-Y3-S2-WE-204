import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./BookBidForm.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

// Material UI imports
import { 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Button, 
  Grid, 
  Typography, 
  Container, 
  Paper, 
  Box,
  FormHelperText,
  InputAdornment,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Card,
  CardMedia,
  IconButton,
  Tooltip,
  Alert,
  Avatar,
  StepContent,
  Rating,
  Slider,
  LinearProgress,
  Zoom,
  Fade,
  Backdrop,
  CircularProgress
} from '@mui/material';
import { 
  CloudUpload as CloudUploadIcon,
  Book as BookIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
  Category as CategoryIcon,
  Person as PersonIcon,
  PriceChange as PriceChangeIcon,
  CalendarToday as CalendarTodayIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { ThemeProvider, createTheme, alpha } from '@mui/material/styles';

// Enhanced theme with expanded color palette and animations
const theme = createTheme({
  palette: {
    primary: {
      light: '#4dabf5',
      main: '#1976d2',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff4081',
      main: '#f50057',
      dark: '#c51162',
      contrastText: '#fff',
    },
    success: {
      main: '#4caf50',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2d3748',
      secondary: '#718096',
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
    subtitle1: {
      fontWeight: 500,
    }
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
        },
        contained: {
          boxShadow: '0 4px 14px 0 rgba(25, 118, 210, 0.39)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#1976d2',
            },
          },
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          '&.Mui-active': {
            fontWeight: 700,
          },
          '&.Mui-completed': {
            fontWeight: 700,
          },
        },
      },
    },
  },
});

const BookBidForm = () => {
  const navigate = useNavigate();
  
  // State for active step in stepper
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Book Details', 'Additional Information', 'Images & Submit'];
  
  // Initial state for book data
  const [bookData, setBookData] = useState({
    name: "",
    category: "",
    author: "",
    price: "",
    year: "",
    condition: "",
    description: "",
    photos: [],
  });

  // Preview state for uploaded images
  const [previewUrls, setPreviewUrls] = useState([]);

  // State for condition rating
  const [conditionRating, setConditionRating] = useState(0);
  const conditionLabels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Like New'
  };

  // Loading state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field validation errors
  const [errors, setErrors] = useState({});

  // Form completion progress
  const calculateProgress = () => {
    const requiredFields = ['name', 'category', 'author', 'price', 'year', 'condition', 'description'];
    const filledFields = requiredFields.filter(field => bookData[field] !== "").length;
    return (filledFields / requiredFields.length) * 100;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    setBookData({ ...bookData, [name]: value });
  };

  // Handle condition rating change
  const handleRatingChange = (event, newValue) => {
    setConditionRating(newValue);
    const conditionValue = newValue === 5 ? "New" : newValue >= 3 ? "Used" : "Damaged";
    setBookData({ ...bookData, condition: conditionValue });
    
    if (errors.condition) {
      setErrors(prev => ({ ...prev, condition: "" }));
    }
  };

  // Handle file input for photos (up to 6 images)
  const handleFileChange = (e) => {
    const files = e.target.files;
    
    if (errors.photos) {
      setErrors(prev => ({ ...prev, photos: "" }));
    }
    
    if (files.length <= 6) {
      setBookData({ ...bookData, photos: [...files] });
      
      // Generate preview URLs for selected images
      const newPreviewUrls = [];
      Array.from(files).forEach(file => {
        const url = URL.createObjectURL(file);
        newPreviewUrls.push({ url, name: file.name });
      });
      setPreviewUrls(newPreviewUrls);
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You can upload a maximum of 6 images.",
      });
    }
  };

  // Remove a preview image
  const removeImage = (indexToRemove) => {
    const newPreviews = previewUrls.filter((_, index) => index !== indexToRemove);
    setPreviewUrls(newPreviews);
    
    // Create a new FileList-like object from the remaining files
    const dataTransfer = new DataTransfer();
    Array.from(bookData.photos).forEach((file, index) => {
      if (index !== indexToRemove) {
        dataTransfer.items.add(file);
      }
    });
    
    setBookData({
      ...bookData,
      photos: dataTransfer.files
    });
  };

  // Handle next step in stepper
  const handleNext = () => {
    let newErrors = {};
    let isValid = true;
    
    if (activeStep === 0) {
      // Validate first step fields
      if (!bookData.name) {
        newErrors.name = "Book title is required";
        isValid = false;
      }
      if (!bookData.author) {
        newErrors.author = "Author name is required";
        isValid = false;
      }
      if (!bookData.category) {
        newErrors.category = "Category is required";
        isValid = false;
      }
    } else if (activeStep === 1) {
      // Validate second step fields
      if (!bookData.price) {
        newErrors.price = "Price is required";
        isValid = false;
      } else if (bookData.price <= 0) {
        newErrors.price = "Price must be greater than 0";
        isValid = false;
      }
      
      const currentYear = new Date().getFullYear();
      if (!bookData.year) {
        newErrors.year = "Publication year is required";
        isValid = false;
      } else if (bookData.year < 1900 || bookData.year > currentYear) {
        newErrors.year = `Year must be between 1900 and ${currentYear}`;
        isValid = false;
      }
      
      if (!bookData.condition) {
        newErrors.condition = "Book condition is required";
        isValid = false;
      }
      
      if (!bookData.description) {
        newErrors.description = "Description is required";
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    
    if (isValid) {
      setActiveStep(prevStep => prevStep + 1);
      // Scroll to top of form on step change
      window.scrollTo(0, 0);
    }
  };

  // Handle back step in stepper
  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
    // Scroll to top of form on step change
    window.scrollTo(0, 0);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let newErrors = {};
    let isValid = true;
    
    // Check if photos are uploaded
    if (bookData.photos.length === 0) {
      newErrors.photos = "At least one photo is required";
      isValid = false;
    }
    
    setErrors(newErrors);
    
    if (!isValid) {
      return;
    }

    // Show loading indicator
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save data to localStorage
      localStorage.setItem("bookBid", JSON.stringify(bookData));
      
      setIsSubmitting(false);

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Book Listed Successfully!',
        text: 'Your book has been listed for bidding.',
        showConfirmButton: true,
        confirmButtonText: 'Go to Home',
      }).then((result) => {
        if (result.isConfirmed) {
          // Navigate to the next page
          navigate("/bidhome");
        }
      });
    } catch (error) {
      setIsSubmitting(false);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: 'There was an error submitting your form. Please try again.',
      });
    }
  };

  // Get current year for the publication year validation
  const currentYear = new Date().getFullYear();

  // Content for vertical stepper (mobile view)
  const getVerticalStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Fade in={activeStep === 0}>
            <Box>
              <Typography variant="subtitle1" gutterBottom color="primary">
                Enter the basic details about your book
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    id="name"
                    name="name"
                    label="Book Title"
                    placeholder="Enter the title of the book"
                    value={bookData.name}
                    onChange={handleChange}
                    variant="outlined"
                    error={!!errors.name}
                    helperText={errors.name}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BookIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    id="author"
                    name="author"
                    label="Author"
                    placeholder="Author's name"
                    value={bookData.author}
                    onChange={handleChange}
                    variant="outlined"
                    error={!!errors.author}
                    helperText={errors.author}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required error={!!errors.category}>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      id="category"
                      name="category"
                      value={bookData.category}
                      label="Category"
                      onChange={handleChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <CategoryIcon color="primary" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">Select Category</MenuItem>
                      {[
                        "Fiction", "Non-Fiction", "Science", "History", 
                        "Fantasy", "Mystery", "Romance", "Biography", 
                        "Self-Help", "Horror", "Poetry", "Children's",
                        "Travel", "Cooking", "Art", "Philosophy"
                      ].map((category) => (
                        <MenuItem key={category} value={category}>{category}</MenuItem>
                      ))}
                    </Select>
                    {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        );
      case 1:
        return (
          <Fade in={activeStep === 1}>
            <Box>
              <Typography variant="subtitle1" gutterBottom color="primary">
                Tell us more about your book's details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    required
                    id="price"
                    name="price"
                    label="Published Price"
                    type="number"
                    placeholder="Original price of the book"
                    value={bookData.price}
                    onChange={handleChange}
                    variant="outlined"
                    error={!!errors.price}
                    helperText={errors.price}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PriceChangeIcon color="primary" />
                        </InputAdornment>
                      ),
                      inputProps: { min: 1 }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    required
                    id="year"
                    name="year"
                    label="Year of Publication"
                    type="number"
                    placeholder="Year the book was published"
                    value={bookData.year}
                    onChange={handleChange}
                    variant="outlined"
                    error={!!errors.year}
                    helperText={errors.year}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarTodayIcon color="primary" />
                        </InputAdornment>
                      ),
                      inputProps: { min: 1900, max: currentYear }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Book Condition*
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating
                        name="condition-rating"
                        value={conditionRating}
                        onChange={handleRatingChange}
                        precision={1}
                        size="large"
                      />
                      <Box sx={{ ml: 2 }}>
                        {conditionRating > 0 ? (
                          <Chip 
                            label={conditionLabels[conditionRating]} 
                            color={
                              conditionRating === 5 ? "success" : 
                              conditionRating >= 3 ? "primary" : 
                              "secondary"
                            }
                            size="small"
                          />
                        ) : null}
                      </Box>
                    </Box>
                    {errors.condition && (
                      <FormHelperText error>{errors.condition}</FormHelperText>
                    )}
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    id="description"
                    name="description"
                    label="Book Description"
                    placeholder="Add details about the book, edition, special features, etc."
                    value={bookData.description}
                    onChange={handleChange}
                    variant="outlined"
                    multiline
                    rows={4}
                    error={!!errors.description}
                    helperText={errors.description}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                          <DescriptionIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Fade>
        );
      case 2:
        return (
          <Fade in={activeStep === 2}>
            <Box>
              <Typography variant="subtitle1" gutterBottom color="primary">
                Upload images of your book
              </Typography>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  border: '2px dashed', 
                  borderColor: 'primary.light', 
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  borderRadius: 2
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar 
                    sx={{ 
                      width: 64, 
                      height: 64, 
                      mx: 'auto', 
                      mb: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.12)
                    }}
                  >
                    <PhotoCameraIcon color="primary" fontSize="large" />
                  </Avatar>
                  
                  <Typography variant="h6" gutterBottom fontWeight="medium">
                    Upload Book Images
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Upload clear images of your book (max 6 images)
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Button
                      variant="contained"
                      component="label"
                      startIcon={<CloudUploadIcon />}
                      sx={{ px: 3, py: 1.5, mt: 1 }}
                    >
                      Choose Images
                      <input
                        type="file"
                        id="photos"
                        name="photos"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        required
                        style={{ display: 'none' }}
                      />
                    </Button>
                  </Box>
                  
                  {errors.photos && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {errors.photos}
                    </Alert>
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {bookData.photos.length > 0 ? (
                      <Chip 
                        label={`${bookData.photos.length} file(s) selected`} 
                        color="primary"
                        sx={{ mr: 1 }}
                        variant="outlined"
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No files chosen
                      </Typography>
                    )}
                    
                    <Tooltip title="Upload clear images of your book including front cover, back cover, and any important pages">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" color="primary" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                
                {previewUrls.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Image Previews:
                    </Typography>
                    <Grid container spacing={2}>
                      {previewUrls.map((file, index) => (
                        <Grid item xs={6} sm={4} md={2} key={index}>
                          <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                            <Card sx={{ position: 'relative', overflow: 'hidden' }}>
                              <CardMedia
                                component="img"
                                height="140"
                                image={file.url}
                                alt={`Preview ${index + 1}`}
                                sx={{ 
                                  objectFit: 'cover',
                                  transition: 'transform 0.3s ease-in-out',
                                  '&:hover': {
                                    transform: 'scale(1.05)'
                                  }
                                }}
                              />
                              <Box sx={{ position: 'absolute', right: 0, top: 0 }}>
                                <IconButton 
                                  size="small" 
                                  sx={{ 
                                    bgcolor: 'rgba(255,255,255,0.8)', 
                                    m: 0.5,
                                    '&:hover': {
                                      bgcolor: 'rgba(255,0,0,0.1)'
                                    }
                                  }}
                                  onClick={() => removeImage(index)}
                                  color="error"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  p: 0.5, 
                                  textAlign: 'center', 
                                  display: 'block',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {file.name}
                              </Typography>
                            </Card>
                          </Zoom>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Paper>
              
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    bgcolor: 'success.main',
                    '&:hover': {
                      bgcolor: 'success.dark'
                    }
                  }}
                  startIcon={isSubmitting ? null : <SaveIcon />}
                >
                  {isSubmitting ? 'Submitting...' : 'List Book for Bidding'}
                </Button>
              </Box>
            </Box>
          </Fade>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
        <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2 }}>
          <Box textAlign="center" mb={4}>
            <Avatar 
              sx={{ 
                width: 56, 
                height: 56, 
                mx: 'auto', 
                mb: 2, 
                bgcolor: alpha(theme.palette.primary.main, 0.1)
              }}
            >
              <BookIcon color="primary" sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h4" component="h1" gutterBottom>
              Book Bidding Form
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Fill in all the details to list your book for bidding
            </Typography>
            
            {/* Progress indicator */}
            <Box sx={{ mt: 2, px: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Form completion
                </Typography>
                <Typography variant="caption" color="primary" fontWeight="medium">
                  {Math.round(calculateProgress())}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={calculateProgress()} 
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>
          </Box>
          
          {/* Desktop Stepper */}
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label, index) => (
                <Step key={label} completed={activeStep > index}>
                  <StepLabel>
                    <Typography variant="body2" fontWeight={activeStep === index ? 600 : 400}>
                      {label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            
            <Divider sx={{ mb: 4 }} />
            
            <Box component="form" noValidate sx={{ px: 1 }}>
              {activeStep === 0 && getVerticalStepContent(0)}
              {activeStep === 1 && getVerticalStepContent(1)}
              {activeStep === 2 && getVerticalStepContent(2)}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  variant="outlined"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  startIcon={<ArrowBackIcon />}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box>
                  {activeStep < steps.length - 1 && (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      endIcon={<ArrowForwardIcon />}
                    >
                      Continue to {steps[activeStep + 1]}
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
          
          {/* Mobile Stepper with Step Content */}
          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>
                    <Typography variant="body2" fontWeight={activeStep === index ? 600 : 400}>
                      {label}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    {getVerticalStepContent(index)}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Button
                        variant="outlined"
                        disabled={index === 0}
                        onClick={handleBack}
                        startIcon={<ArrowBackIcon />}
                        size="small"
                      >
                        Back
                      </Button>
                      {index < steps.length - 1 ? (
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          endIcon={<ArrowForwardIcon />}
                          size="small"
                        >
                          Next
                        </Button>
                      ) : null}
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Paper>
      </Container>
      
      {/* Loading backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isSubmitting}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="inherit" />
          <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>
            Submitting your book...
          </Typography>
        </Box>
      </Backdrop>
      
      <Footer />
    </ThemeProvider>
  );
};

export default BookBidForm;