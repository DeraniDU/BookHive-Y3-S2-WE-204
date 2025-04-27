import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./Home";
import BookBidForm from "./pages/Deranindu/BookBidForm";
import BidHome from "./pages/Deranindu/BidHome";
import BiddingSuccess from "./pages/Deranindu/BiddingSuccess"; // Import BiddingSuccess page
import ViewPlaceBid from "./pages/Deranindu/view-placebid"; // Import the new view-placebid component
import Lending from "../src/pages/Palihe/LendingHome"
import Lending2 from "../src/pages/Palihe/LLendingPage"
import Borrowing from "../src/pages/Palihe/LBorrowing"
import 'semantic-ui-css/semantic.min.css';



function App() {
  return (
    
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/bidding" element={<BookBidForm />} />
        <Route path="/bidhome" element={<BidHome />} />
        <Route path="/bidding-success" element={<BiddingSuccess />} /> {/* BiddingSuccess route */}
        <Route path="/view-placebid" element={<ViewPlaceBid />} /> {/* New route for view-placebid */}
        <Route path="/lending" element= {<Lending/>} />
        <Route path = "/Lending2" element = {<Lending2/>}/>
        <Route path="/Borrowing" element = {<Borrowing/>}/>
      </Routes>
    
  );
}

export default App;
