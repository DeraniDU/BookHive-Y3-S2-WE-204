import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./Home";
import BookBidForm from "./pages/Deranindu/BookBidForm";
import BidHome from "./pages/Deranindu/BidHome";
import BiddingSuccess from "./pages/Deranindu/BiddingSuccess"; // Import BiddingSuccess page
import ViewPlaceBid from "./pages/Deranindu/view-placebid"; // Import the new view-placebid component

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/bidding" element={<BookBidForm />} />
        <Route path="/bidhome" element={<BidHome />} />
        <Route path="/bidding-success" element={<BiddingSuccess />} /> {/* BiddingSuccess route */}
        <Route path="/view-placebid" element={<ViewPlaceBid />} /> {/* New route for view-placebid */}
      </Routes>
    
  );
}

export default App;
