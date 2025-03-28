import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Home from "./Home";
import Lending from "./pages/LendingHome"
import Lending2 from "./pages/LLendingPage"
import Lform from "./components/LendingForm"
import Borrowing from "./pages/LBorrowing"



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/lending" element= {<Lending/>} />
        <Route path = "/Lending2" element = {<Lending2/>}/>
        <Route path="/Lform" element = {<Lform/>}/>
        <Route path="/Borrowing" element = {<Borrowing/>}/>

      </Routes>
    </Router>
  );
}

export default App;
