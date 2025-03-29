import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./Home";
import BookBidForm from "./pages/Deranindu/BookBidForm";
import BidHome from "./pages/Deranindu/BidHome";
import BiddingSuccess from "./pages/Deranindu/BiddingSuccess";
import ViewPlaceBid from "./pages/Deranindu/view-placebid";
import Exbid from "./pages/Deranindu/Exbid";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/bidding" element={<BookBidForm />} />
        <Route path="/bidhome" element={<BidHome />} />
        <Route path="/bidding-success" element={<BiddingSuccess />} />
        <Route path="/view-placebid" element={<ViewPlaceBid />} />
        <Route path="/exbid" element={<Exbid />} /> {/* Route to view bids */}
      </Routes>
    </Router>
  );
}

export default App;
