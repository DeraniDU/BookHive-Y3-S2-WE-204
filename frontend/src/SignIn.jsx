import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase"; // Importing Firebase auth
import "./index.css"; // Ensure the index.css file is imported

const SignIn = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email) {
      Swal.fire({ icon: "error", title: "Oops...", text: "Please enter email" });
      return;
    }

    if (!password) {
      Swal.fire({ icon: "error", title: "Oops...", text: "Please enter password." });
      return;
    }

    try {
      // Firebase Sign In
      await signInWithEmailAndPassword(auth, email, password);

      Swal.fire({ icon: "success", title: "Login Success", text: "You have successfully logged in" });

      // Store the user login status in localStorage (optional)
      localStorage.setItem("isLogged", "true");

      // Redirect to Home page after successful login
      navigate("/"); // Redirect to home page after successful login
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: error.message });
    }
  };

  return (
    <section className="form-container">
      <div className="form-box">
        <h2>Sign In</h2>
        <form>
          <div className="input-group">
            <input
              type="email"
              placeholder="Enter a valid email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="button" className="btn-submit" onClick={handleLogin}>
            Sign In
          </button>

          <p className="register-link">
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </form>
      </div>
    </section>
  );
};

export default SignIn;
