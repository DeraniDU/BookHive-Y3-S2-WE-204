import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./Home";

import ExchangeBook from "./pages/samadi/ExchangeBook";
import AddRequest from './pages/samadi/AddRequest';
import ViewRequest from "./pages/samadi/ViewRequest";
import ExchangeAddBook from "./pages/samadi/ExchangeAddBook";
import ExchangeDeleteBook from "./pages/samadi/ExchangeDeleteBook";
import ExchangeEditBook from "./pages/samadi/ExchangeEditBook";
import ExchangeHome from "./pages/samadi/ExchangeHome";
import UserAddBook from "./pages/samadi/UserAddBook";
import UserEditBook from "./pages/samadi/UserEditBook";
import UserDeleteBook from "./pages/samadi/UserDeleteBook";
import MyBooks from "./pages/samadi/MyBooks";


import BookBidForm from "./pages/Deranindu/BookBidForm";
import BidHome from "./pages/Deranindu/BidHome";
import BiddingSuccess from "./pages/Deranindu/BiddingSuccess"; // Import BiddingSuccess page
import ViewPlaceBid from "./pages/Deranindu/view-placebid";
import LendingHome from "././pages/Palihe/LendingHome" ;
import Lending from "./pages/Palihe/LLendingPage";
import Borrowing from "./pages/Palihe/LBorrowing"
import Exbid from "./pages/Deranindu/Exbid";

function App() {
  return (
    
      <Routes>
       
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

       

        <Route path="/exchange/add" element={<UserAddBook />} />
        <Route path="/exchange/edit/:id" element={<UserEditBook />} />
        <Route path="/exchange/delete/:id" element={<UserDeleteBook />} />
        <Route path="/exchange/home" element={<ExchangeBook />} />
        <Route path="/request/add" element={<AddRequest />} />
        <Route path="/request/viewrequest" element={<ViewRequest />} />
        <Route path="/books/bookstable" element={<ExchangeHome />} />
        <Route path="/books/create" element={<ExchangeAddBook />} />
        <Route path="/books/delete/:id" element={<ExchangeDeleteBook />} />
        <Route path="/books/edit/:id" element={<ExchangeEditBook />} />
        <Route path ="/exchange/mybooks" element={<MyBooks/>} />


       
        <Route path="/bidding" element={<BookBidForm />} />
        <Route path="/bidhome" element={<BidHome />} />
        <Route path="/bidding-success" element={<BiddingSuccess />} /> {/* BiddingSuccess route */}
        <Route path="/view-placebid" element={<ViewPlaceBid />} /> {/* New route for view-placebid */}
        <Route path="/book-lending" element={<LendingHome/>}/>
        <Route path="/Lending2" element={<Lending/>}/>
        <Route path="/Borrowing" element={<Borrowing/>}/>
      </Routes>
    
  );
}
export default App;