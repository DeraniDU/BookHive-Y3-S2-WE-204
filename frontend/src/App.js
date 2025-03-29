import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./Home";
<<<<<<< HEAD
import ExchangeBook from "./pages/samadi/ExchangeBook";
import BookRequest from './pages/samadi/BookRequest';
import MyRequestsPage from "./pages/samadi/MyRequestsPage";
import ExchangeAddBook from "./pages/samadi/ExchangeAddBook";
import ExchangeDeleteBook from "./pages/samadi/ExchangeDeleteBook";
import ExchangeEditBook  from "./pages/samadi/ExchangeEditBook"
import ExchangeHome from "./pages/samadi/ExchangeHome"
import UserAddBook from "./pages/samadi/UserAddBook"
=======
import BookBidForm from "./pages/Deranindu/BookBidForm";
import BidHome from "./pages/Deranindu/BidHome";
import BiddingSuccess from "./pages/Deranindu/BiddingSuccess";
import ViewPlaceBid from "./pages/Deranindu/view-placebid";
import Exbid from "./pages/Deranindu/Exbid";


>>>>>>> 0f906d588a1b3e85b3a4ed2b28e896148a8ff8f5
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
<<<<<<< HEAD
        <Route path="/exchangebook" element={<ExchangeBook />} />
        <Route path="/bookrequest" element={<BookRequest />} />
        <Route path="/viewrequest" element={< MyRequestsPage/>} />
        <Route path="/exchangeadd" element={< ExchangeAddBook/>} />
        <Route path ="/exchangedelete" element ={<ExchangeDeleteBook/>}/>
        <Route path ="/exedit" element ={<ExchangeEditBook/>}/>
        <Route path ="/exhome" element = {<ExchangeHome/>}/>
        <Route path ="/useradd" element = {<UserAddBook/>}/>
       
        
        

        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
=======
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/bidding" element={<BookBidForm />} />
        <Route path="/bidhome" element={<BidHome />} />
        <Route path="/bidding-success" element={<BiddingSuccess />} />
        <Route path="/view-placebid" element={<ViewPlaceBid />} />
        <Route path="/exbid" element={<Exbid />} /> {/* Route to view bids */}
>>>>>>> 0f906d588a1b3e85b3a4ed2b28e896148a8ff8f5
      </Routes>
    </Router>
  );
}

export default App;
