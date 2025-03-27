import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./Home";
import ExchangeBook from "./ExchangeBook";
import BookRequest from './BookRequest';
import MyRequestsPage from "./MyRequestsPage";
import ExchangeAddBook from "./ExchangeAddBook";
import ExchangeDeleteBook from "./ExchangeDeleteBook";
import ExchangeEditBook  from "./ExchangeEditBook "


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exchangebook" element={<ExchangeBook />} />
        <Route path="/bookrequest" element={<BookRequest />} />
        <Route path="/request" element={< MyRequestsPage/>} />
        <Route path="/exchangeadd" element={< ExchangeAddBook/>} />
        <Route path ="/exchangedelete" element ={<ExchangeDeleteBook/>}/>
        <Route path ="/exedit" element ={<ExchangeEditBook/>}/>
       
        
        

        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
