import React, { useState, useEffect } from "react";
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
  LinearProgress,
  Zoom,
  Fade,
  Backdrop,
  CircularProgress,
  useMediaQuery
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
import { ThemeProvider, createTheme, alpha, styled } from '@mui/material/styles';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[8]
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  letterSpacing: 0.5,
  transition: 'all 0.2s ease',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 2,
    '&:hover fieldset': {
      borderColor: theme.palette.primary.light,
    },
    '&.Mui-focused fieldset': {
      borderWidth: 2,
      borderColor: theme.palette.primary.main,
    },
  },
}));

const UploadArea = styled(Paper)(({ theme, error }) => ({
  padding: theme.spacing(4),
  border: '2px dashed',
  borderColor: error ? theme.palette.error.main : theme.palette.primary.light,
  backgroundColor: alpha(error ? theme.palette.error.light : theme.palette.primary.light, 0.04),
  borderRadius: theme.shape.borderRadius * 2,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(error ? theme.palette.error.light : theme.palette.primary.light, 0.08),
  }
}));

// Enhanced theme
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
      dark: '#388e3c',
    },
    error: {
      main: '#f44336',
      dark: '#d32f2f',
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
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
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
          borderRadius: 12,
          padding: '10px 20px',
        },
        contained: {
          boxShadow: '0 4px 14px 0 rgba(25, 118, 210, 0.39)',
          '&:hover': {
            boxShadow: '0 6px 20px 0 rgba(25, 118, 210, 0.39)',
          }
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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
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

  // Track touched fields
  const [touched, setTouched] = useState({
    name: false,
    category: false,
    author: false,
    price: false,
    year: false,
    condition: false,
    description: false,
    photos: false
  });

  // Validate form fields
  const validateField = (name, value) => {
    const currentYear = new Date().getFullYear();
    
    switch (name) {
      case 'name':
        return value.trim() === '' ? 'Book title is required' : '';
      case 'author':
        return value.trim() === '' ? 'Author name is required' : '';
      case 'category':
        return value === '' ? 'Category is required' : '';
      case 'price':
        if (value === '') return 'Price is required';
        if (isNaN(value) || value <= 0) return 'Price must be greater than 0';
        return '';
      case 'year':
        if (value === '') return 'Publication year is required';
        if (isNaN(value) || value < 1900 || value > currentYear) 
          return `Year must be between 1900 and ${currentYear}`;
        return '';
      case 'condition':
        return value === '' ? 'Book condition is required' : '';
      case 'description':
        return value.trim() === '' ? 'Description is required' : '';
      case 'photos':
        return value.length === 0 ? 'At least one photo is required' : '';
      default:
        return '';
    }
  };

  // Validate all fields
  const validateAll = () => {
    const newErrors = {};
    Object.keys(bookData).forEach(key => {
      const error = validateField(key, bookData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form completion progress
  const calculateProgress = () => {
    const requiredFields = ['name', 'category', 'author', 'price', 'year', 'condition', 'description'];
    const filledFields = requiredFields.filter(field => bookData[field] !== "").length;
    return (filledFields / requiredFields.length) * 100;
  };

  // Handle input changes with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setBookData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate only if field has been touched
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  // Handle blur events (mark field as touched)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  // Handle condition rating change
  const handleRatingChange = (event, newValue) => {
    setConditionRating(newValue);
    const conditionValue = newValue === 5 ? "New" : newValue >= 3 ? "Used" : "Damaged";
    setBookData(prev => ({ ...prev, condition: conditionValue }));
    setTouched(prev => ({ ...prev, condition: true }));
    setErrors(prev => ({ ...prev, condition: validateField('condition', conditionValue) }));
  };

  // Handle file input for photos (up to 6 images)
  const handleFileChange = (e) => {
    const files = e.target.files;
    
    if (files.length <= 6) {
      setBookData(prev => ({ ...prev, photos: [...files] }));
      setTouched(prev => ({ ...prev, photos: true }));
      setErrors(prev => ({ ...prev, photos: validateField('photos', files) }));
      
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
    
    const newPhotos = dataTransfer.files;
    setBookData(prev => ({ ...prev, photos: newPhotos }));
    setErrors(prev => ({ ...prev, photos: validateField('photos', newPhotos) }));
  };

  // Handle next step in stepper
  const handleNext = () => {
    // Mark all fields in current step as touched
    const newTouched = { ...touched };
    let fieldsToValidate = [];
    
    if (activeStep === 0) {
      fieldsToValidate = ['name', 'author', 'category'];
    } else if (activeStep === 1) {
      fieldsToValidate = ['price', 'year', 'condition', 'description'];
    }
    
    fieldsToValidate.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);
    
    // Validate relevant fields
    const newErrors = { ...errors };
    let isValid = true;
    
    fieldsToValidate.forEach(field => {
      const error = validateField(field, bookData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      } else {
        delete newErrors[field];
      }
    });
    
    setErrors(newErrors);
    
    if (isValid) {
      setActiveStep(prevStep => prevStep + 1);
      window.scrollTo(0, 0);
    } else {
      // Scroll to first error
      const firstErrorField = fieldsToValidate.find(field => newErrors[field]);
      if (firstErrorField) {
        document.getElementById(firstErrorField)?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }
  };

  // Handle back step in stepper
  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
    window.scrollTo(0, 0);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      name: true,
      category: true,
      author: true,
      price: true,
      year: true,
      condition: true,
      description: true,
      photos: true
    });
    
    // Validate all fields
    const isValid = validateAll();
    
    if (!isValid) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors).find(field => errors[field]);
      if (firstErrorField) {
        document.getElementById(firstErrorField)?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
      return;
    }

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
        html: `
          <div style="text-align: center;">
            <CheckCircleIcon style="font-size: 60px; color: #4caf50; margin-bottom: 20px;" />
            <p>Your book <strong>${bookData.name}</strong> has been listed for bidding.</p>
          </div>
        `,
        showConfirmButton: true,
        confirmButtonText: 'Go to Home',
        customClass: {
          popup: 'swal-custom-popup'
        }
      }).then((result) => {
        if (result.isConfirmed) {
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
              <Typography variant="subtitle1" gutterBottom color="primary" sx={{ mb: 3 }}>
                Enter the basic details about your book
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    required
                    id="name"
                    name="name"
                    label="Book Title"
                    placeholder="Enter the title of the book"
                    value={bookData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="outlined"
                    error={touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BookIcon color={touched.name && errors.name ? "error" : "primary"} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <StyledTextField
                    fullWidth
                    required
                    id="author"
                    name="author"
                    label="Author"
                    placeholder="Author's name"
                    value={bookData.author}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="outlined"
                    error={touched.author && !!errors.author}
                    helperText={touched.author && errors.author}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color={touched.author && errors.author ? "error" : "primary"} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required error={touched.category && !!errors.category}>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      id="category"
                      name="category"
                      value={bookData.category}
                      label="Category"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      sx={{
                        borderRadius: theme.shape.borderRadius * 2,
                      }}
                    >
                      <MenuItem value="" disabled>
                        <em>Select Category</em>
                      </MenuItem>
                      {[
                        "Fiction", "Non-Fiction", "Science", "History", 
                        "Fantasy", "Mystery", "Romance", "Biography", 
                        "Self-Help", "Horror", "Poetry", "Children's",
                        "Travel", "Cooking", "Art", "Philosophy"
                      ].map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.category && errors.category && (
                      <FormHelperText>{errors.category}</FormHelperText>
                    )}
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
              <Typography variant="subtitle1" gutterBottom color="primary" sx={{ mb: 3 }}>
                Tell us more about your book's details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <StyledTextField
                    fullWidth
                    required
                    id="price"
                    name="price"
                    label="Published Price"
                    type="number"
                    placeholder="Original price of the book"
                    value={bookData.price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="outlined"
                    error={touched.price && !!errors.price}
                    helperText={touched.price && errors.price}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PriceChangeIcon color={touched.price && errors.price ? "error" : "primary"} />
                        </InputAdornment>
                      ),
                      inputProps: { min: 1 }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <StyledTextField
                    fullWidth
                    required
                    id="year"
                    name="year"
                    label="Year of Publication"
                    type="number"
                    placeholder="Year the book was published"
                    value={bookData.year}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="outlined"
                    error={touched.year && !!errors.year}
                    helperText={touched.year && errors.year}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarTodayIcon color={touched.year && errors.year ? "error" : "primary"} />
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
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            Select rating
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    {touched.condition && errors.condition && (
                      <FormHelperText error>{errors.condition}</FormHelperText>
                    )}
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    required
                    id="description"
                    name="description"
                    label="Book Description"
                    placeholder="Add details about the book, edition, special features, etc."
                    value={bookData.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="outlined"
                    multiline
                    rows={4}
                    error={touched.description && !!errors.description}
                    helperText={touched.description && errors.description}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                          <DescriptionIcon color={touched.description && errors.description ? "error" : "primary"} />
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
              <Typography variant="subtitle1" gutterBottom color="primary" sx={{ mb: 3 }}>
                Upload images of your book
              </Typography>
              
              <UploadArea 
                elevation={0} 
                error={touched.photos && !!errors.photos}
                onClick={() => document.getElementById('photos-input').click()}
              >
                <input
                  type="file"
                  id="photos-input"
                  name="photos"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  required
                  style={{ display: 'none' }}
                />
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar 
                    sx={{ 
                      width: 64, 
                      height: 64, 
                      mx: 'auto', 
                      mb: 2,
                      bgcolor: alpha(
                        touched.photos && errors.photos ? 
                        theme.palette.error.main : 
                        theme.palette.primary.main, 
                        0.12
                      )
                    }}
                  >
                    <PhotoCameraIcon 
                      color={
                        touched.photos && errors.photos ? 
                        "error" : 
                        "primary"
                      } 
                      fontSize="large" 
                    />
                  </Avatar>
                  
                  <Typography variant="h6" gutterBottom fontWeight="medium">
                    {previewUrls.length > 0 ? 'Add More Images' : 'Upload Book Images'}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {previewUrls.length > 0 
                      ? `You've added ${previewUrls.length} image(s)` 
                      : 'Click to browse or drag and drop images (max 6)'}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <StyledButton
                      variant="contained"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                      sx={{ 
                        px: 3, 
                        py: 1.5, 
                        mt: 1,
                        bgcolor: touched.photos && errors.photos ? 
                          'error.main' : 
                          'primary.main',
                        '&:hover': {
                          bgcolor: touched.photos && errors.photos ? 
                            'error.dark' : 
                            'primary.dark'
                        }
                      }}
                    >
                      {previewUrls.length > 0 ? 'Add More Images' : 'Choose Images'}
                    </StyledButton>
                  </Box>
                  
                  {touched.photos && errors.photos && (
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
                    
                    <Tooltip 
                      title="Upload clear images of your book including front cover, back cover, and any important pages" 
                      arrow
                    >
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
                        <Grid item xs={6} sm={4} md={3} key={index}>
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage(index);
                                  }}
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
              </UploadArea>
              
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <StyledButton 
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
                </StyledButton>
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
        <StyledPaper elevation={3}>
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
            <Box sx={{ mt: 3, px: 4 }}>
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
                sx={{ 
                  height: 6, 
                  borderRadius: 3,
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    transition: 'width 0.5s ease'
                  }
                }}
              />
            </Box>
          </Box>
          
          {/* Desktop Stepper */}
          {!isMobile && (
            <Box>
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
                {getVerticalStepContent(activeStep)}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <StyledButton
                    variant="outlined"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    startIcon={<ArrowBackIcon />}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </StyledButton>
                  <Box>
                    {activeStep < steps.length - 1 && (
                      <StyledButton
                        variant="contained"
                        onClick={handleNext}
                        endIcon={<ArrowForwardIcon />}
                      >
                        Continue to {steps[activeStep + 1]}
                      </StyledButton>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
          
          {/* Mobile Stepper with Step Content */}
          {isMobile && (
            <Box>
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
                        <StyledButton
                          variant="outlined"
                          disabled={index === 0}
                          onClick={handleBack}
                          startIcon={<ArrowBackIcon />}
                          size="small"
                        >
                          Back
                        </StyledButton>
                        {index < steps.length - 1 ? (
                          <StyledButton
                            variant="contained"
                            onClick={handleNext}
                            endIcon={<ArrowForwardIcon />}
                            size="small"
                          >
                            Next
                          </StyledButton>
                        ) : null}
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Box>
          )}
        </StyledPaper>
      </Container>
      
      {/* Loading backdrop */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(4px)'
        }}
        open={isSubmitting}
      >
        <Box sx={{ 
          textAlign: 'center',
          p: 4,
          borderRadius: 2,
          bgcolor: 'background.paper',
          color: 'text.primary'
        }}>
          <CircularProgress color="primary" size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 3 }}>
            Submitting your book...
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Please wait while we process your listing
          </Typography>
        </Box>
      </Backdrop>
      
      <Footer />
    </ThemeProvider>
  );
};

export default BookBidForm;