import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./Home";

import ExchangeBook from "./pages/samadi/ExchangeBook";
import AddRequest from './pages/samadi/AddRequest';
import ViewRequest from "./pages/samadi/ViewRequest";
import ExchangeAddBook from "./pages/samadi/ExchangeAddBook";
import ExchangeDeleteBook from "./pages/samadi/ExchangeDeleteBook";
import ExchangeEditBook  from "./pages/samadi/ExchangeEditBook"
import ExchangeHome from "./pages/samadi/ExchangeHome"
import UserAddBook from "./pages/samadi/UserAddBook"

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

        <Route path ="/books/usercreate" element = {<UserAddBook/>}/>
        <Route path="/books/home" element={<ExchangeBook />} />


        <Route path="/request/add" element={<AddRequest />} />
        <Route path="/request/viewrequest" element={< ViewRequest/>} />

        <Route path ="/books/bookstable" element = {<ExchangeHome/>}/>
        <Route path="/books/create" element={< ExchangeAddBook/>} />
        <Route path ="/books/delete/:id" element ={<ExchangeDeleteBook/>}/>
        <Route path ="/books/edit/:id" element ={<ExchangeEditBook/>}/>
        

        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

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
