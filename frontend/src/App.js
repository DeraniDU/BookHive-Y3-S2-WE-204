import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./Home";
import ExchangeBook from "./pages/samadi/ExchangeBook";
import BookRequest from './pages/samadi/BookRequest';
import MyRequestsPage from "./pages/samadi/MyRequestsPage";
import ExchangeAddBook from "./pages/samadi/ExchangeAddBook";
import ExchangeDeleteBook from "./pages/samadi/ExchangeDeleteBook";
import ExchangeEditBook  from "./pages/samadi/ExchangeEditBook"
import ExchangeHome from "./pages/samadi/ExchangeHome"
import UserAddBook from "./pages/samadi/UserAddBook"
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
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
      </Routes>
    </Router>
  );
}

export default App;
