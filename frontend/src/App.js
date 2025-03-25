import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Home from "./Home";
<<<<<<< HEAD
import Dashboard from "./Dashboard";
import Profile from "./pages/Samadi/Profile";

=======
>>>>>>> b802650f769afd032ef7c94e617070f8c448a732

function App() {
  return (
    <Router>
      <Routes>
<<<<<<< HEAD
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
=======
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Home />} />
>>>>>>> b802650f769afd032ef7c94e617070f8c448a732
      </Routes>
    </Router>
  );
}

export default App;
