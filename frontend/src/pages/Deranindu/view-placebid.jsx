import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { 
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Divider
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ViewPlaceBid = () => {
  const navigate = useNavigate();

  // Navigate to the Bidding page when Place Bid button is clicked
  const handlePlaceBidClick = () => {
    navigate("/bidding");
  };

  // Navigate to the Exbid page when View Bids button is clicked
  const handleViewBidsClick = () => {
    navigate("/Exbid");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <Container maxWidth="md" sx={{ flexGrow: 1, py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Choose an Action
          </Typography>
          
          <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Select an option to proceed with the bidding process
          </Typography>
          
          <Divider sx={{ mb: 4 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  height: "100%", 
                  transition: "0.3s",
                  "&:hover": { 
                    transform: "translateY(-8px)",
                    boxShadow: 6
                  }
                }}
              >
                <CardActionArea 
                  onClick={handlePlaceBidClick}
                  sx={{ 
                    height: "100%", 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center", 
                    p: 3 
                  }}
                >
                  <AddCircleOutlineIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography variant="h5" component="div" gutterBottom>
                      Place a Bid
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Create a new bid for an item and submit your offer
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  height: "100%", 
                  transition: "0.3s",
                  "&:hover": { 
                    transform: "translateY(-8px)",
                    boxShadow: 6
                  }
                }}
              >
                <CardActionArea 
                  onClick={handleViewBidsClick}
                  sx={{ 
                    height: "100%", 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center",
                    p: 3 
                  }}
                >
                  <VisibilityIcon sx={{ fontSize: 60, color: "secondary.main", mb: 2 }} />
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography variant="h5" component="div" gutterBottom>
                      View Bids
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Browse and track all current and previous bids
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Choose the option that best fits your needs
            </Typography>
          </Box>
        </Paper>
      </Container>

      <Footer />
    </Box>
  );
};

export default ViewPlaceBid;