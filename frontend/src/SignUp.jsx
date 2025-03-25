import React, { useState } from "react";
import Swal from "sweetalert2";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase"; // Importing Firebase auth
import { useNavigate } from "react-router-dom"; // To handle navigation
import "./index.css";  // Ensure the index.css file is imported

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Swal.fire({ icon: "error", title: "Oops...", text: "Please fill all the fields." });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({ icon: "error", title: "Oops...", text: "Passwords do not match." });
      return;
    }

    try {
      // Firebase Sign Up
      await createUserWithEmailAndPassword(auth, email, password);

      Swal.fire({ icon: "success", title: "Sign Up Success", text: "You have successfully signed up!" });

      // Redirect to Sign In page
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      navigate("/signin"); // Redirect to sign-in after successful sign-up
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: error.message });
    }
  };

  return (
    <section className="form-container">
      <div className="form-box">
        <h2>Sign Up</h2>
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

          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="button" className="btn-submit" onClick={handleSignUp}>
            Sign Up
          </button>

          <p className="login-link">
            Already have an account? <a href="/signin">Sign In</a>
          </p>
        </form>
      </div>
    </section>
  );
};

export default SignUp;
