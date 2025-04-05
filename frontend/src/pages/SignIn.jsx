import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import Swal from "sweetalert2";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { auth } from "../firebase";

import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Divider,
  Paper,
  Grid,
  Link,
  createTheme,
  ThemeProvider,
  CssBaseline
} from '@mui/material';

import {
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  Facebook as FacebookIcon
} from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4F5D75',
      dark: '#2D3142',
      light: '#BFC0C0',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#FF7043',
      dark: '#E64A19',
      light: '#FF8A65',
      contrastText: '#FFFFFF'
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#2D3142',
      secondary: '#4F5D75'
    }
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.5px' },
    h2: { fontWeight: 800, letterSpacing: '-0.5px' },
    h4: { fontWeight: 700, letterSpacing: '-0.3px' },
    button: { fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '12px 24px',
          boxShadow: '0 4px 10px rgba(79, 93, 117, 0.25)',
          '&:hover': {
            boxShadow: '0 6px 15px rgba(79, 93, 117, 0.3)',
            transform: 'translateY(-2px)'
          },
          '&.MuiButton-containedSecondary': {
            backgroundColor: '#FF7043',
            color: '#FFFFFF',
            boxShadow: '0 4px 10px rgba(255, 112, 67, 0.25)',
            '&:hover': {
              backgroundColor: '#E64A19',
              boxShadow: '0 6px 15px rgba(255, 112, 67, 0.3)',
              transform: 'translateY(-2px)'
            }
          }
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(255, 112, 67, 0.2)'
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        inputAdornmentEnd: {
          paddingRight: '0'
        }
      }
    }
  }
});

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSignIn = async () => {
    if (!email || !password) {
      Swal.fire({ icon: "error", title: "Oops...", text: "Please fill all fields!" });
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Swal.fire({ icon: "success", title: "Success!", text: "You are now logged in!" });
      localStorage.setItem("isLogged", true);
      navigate("/"); // Changed from "/" to "/home"
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: error.message });
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      Swal.fire({ icon: "success", title: "Signed In", text: "You have successfully signed in with Google!" });
      localStorage.setItem("isLogged", true);
      navigate("/"); // Changed from "/" to "/home"
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: error.message });
    }
  };

  const handleFacebookSignIn = async () => {
    const provider = new FacebookAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      Swal.fire({ icon: "success", title: "Signed In", text: "You have successfully signed in with Facebook!" });
      localStorage.setItem("isLogged", true);
      navigate("/"); // Changed from "/" to "/home"
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: error.message });
    }
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      height: '56px',
      '& input': {
        height: '100%',
        padding: '16.5px 14px',
        '&::-ms-reveal': {
          display: 'none'
        }
      },
      '& fieldset': {
        borderColor: 'primary.main'
      },
      '&:hover fieldset': {
        borderColor: 'primary.dark'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'primary.main',
        borderWidth: '2px'
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
          px: { xs: 2, sm: 4 },
          bgcolor: 'primary.light'
        }}
      >
        <Paper
          elevation={8}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            width: '100%',
            maxWidth: '1100px',
            overflow: 'hidden',
            borderRadius: 3
          }}
        >
          {/* Welcome Section */}
          <Box
            sx={{
              flex: 1,
              bgcolor: 'primary.dark',
              color: 'white',
              p: { xs: 4, sm: 5, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              minHeight: { xs: '280px', md: 'auto' },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%)',
                opacity: 0.6
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 2, maxWidth: '400px' }}>
              <Typography 
                variant="h1" 
                component="h1" 
                sx={{ 
                  fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' },
                  lineHeight: 1.1,
                  mb: 0
                }}
              >
                Welcome
              </Typography>
              <Typography 
                variant="h2" 
                component="h2" 
                sx={{ 
                  fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' },
                  lineHeight: 1.1,
                  mb: 3,
                  opacity: 0.9,
                  color: 'secondary.main'
                }}
              >
                To The BookHive
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mt: 3,
                  opacity: 0.6,
                  lineHeight: 1.7,
                  maxWidth: '90%'
                }}
              >
                Welcome back to BookHive! Sign in to access your personalized book recommendations, save your favorite reads, 
                and stay connected with a community of passionate readers. Whether you’re picking up where you left off or exploring new genres, your reading journey is just a click away.

                 Sign in today and dive back into the world of books with BookHive!
              </Typography>

              <Typography 
                variant="body1" 
                sx={{ 
                  mt: 1,
                  opacity: 0.6,
                  lineHeight: 1.7,
                  maxWidth: '90%',
                  color: 'secondary.main'
                }}
              >
                Sign in and start your literary adventure with BookHive.

                 


              </Typography>
            </Box>
          </Box>
          
          {/* Form Section */}
          <Box
            sx={{
              flex: 1,
              bgcolor: 'background.paper',
              p: { xs: 3, sm: 4, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <Container maxWidth="sm">
              <Typography 
                variant="h4" 
                component="h3" 
                align="center" 
                gutterBottom
                sx={{ mb: 4, color: 'primary.dark' }}
              >
                Sign In
              </Typography>
              
              <Box component="form" noValidate sx={{ mt: 1 }}>
                <TextField
                  fullWidth
                  required
                  margin="normal"
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  sx={inputStyle}
                />

                <TextField
                  fullWidth
                  required
                  margin="normal"
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  // InputProps={{
                  //   endAdornment: (
                  //     <InputAdornment position="end">
                  //       <IconButton
                  //         aria-label="toggle password visibility"
                  //         onClick={() => setShowPassword(!showPassword)}
                  //         edge="end"
                  //         sx={{ 
                  //           color: 'secondary.main',
                  //           '&:hover': {
                  //             backgroundColor: 'rgba(255, 112, 67, 0.1)'
                  //           }
                  //         }}
                  //       >
                  //         {showPassword ? <VisibilityOff /> : <Visibility />}
                  //       </IconButton>
                  //     </InputAdornment>
                  //   ),
                  // }}
                  sx={inputStyle}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                  <Link component={RouterLink} to="/forgot-password" variant="body2" color="secondary.main">
                    Forgot password?
                  </Link>
                </Box>
                
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={handleSignIn}
                  sx={{ mt: 3, mb: 2, height: '50px' }}
                >
                  SIGN IN
                </Button>
                
                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    OR
                  </Typography>
                </Divider>
                
                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      startIcon={<GoogleIcon />}
                      onClick={handleGoogleSignIn}
                      sx={{ 
                        height: '50px',
                        backgroundColor: 'secondary.main',
                        '&:hover': {
                          backgroundColor: 'secondary.dark'
                        },
                        '& .MuiSvgIcon-root': {
                          color: 'white'
                        }
                      }}
                    >
                      Google
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      startIcon={<FacebookIcon />}
                      onClick={handleFacebookSignIn}
                      sx={{ 
                        height: '50px',
                        backgroundColor: 'secondary.main',
                        '&:hover': {
                          backgroundColor: 'secondary.dark'
                        },
                        '& .MuiSvgIcon-root': {
                          color: 'white'
                        }
                      }}
                    >
                      Facebook
                    </Button>
                  </Grid>
                </Grid>
                
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
                  Don't have an account?{' '}
                  <Link component={RouterLink} to="/signup" color="secondary.main" fontWeight="600">
                    Sign Up
                  </Link>
                </Typography>
              </Box>
            </Container>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default SignIn;