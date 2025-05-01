import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { FaEnvelope, FaLock, FaGoogle, FaFacebook } from "react-icons/fa";
import "./SignUp.css"; // Using SignUp CSS

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    if (!email || !password) {
      Swal.fire({ icon: "error", title: "Oops...", text: "Please fill all fields!" });
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Swal.fire({ icon: "success", title: "Success!", text: "You are now logged in!" });
      localStorage.setItem("isLogged", true);
      navigate("/"); // Redirect to Home page
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: error.message });
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      Swal.fire({ icon: "success", title: "Signed In", text: "You have successfully signed in with Google!" });
      localStorage.setItem("isLogged", true);
      navigate("/");
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: error.message });
    }
  };

  const handleFacebookSignIn = async () => {
    const provider = new FacebookAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      Swal.fire({ icon: "success", title: "Signed In", text: "You have successfully signed in with Facebook!" });
      localStorage.setItem("isLogged", true);
      navigate("/");
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: error.message });
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <div className="signup-card">
          <h2 className="signup-title">Welcome Back</h2>
          <p className="signup-subtitle">Sign in to continue</p>
          
          <form className="signup-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <FaEnvelope />
                <input 
                  type="email" 
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <FaLock />
                <input 
                  type="password" 
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="button" 
              className="signup-button"
              onClick={handleSignIn}
            >
              Sign In
            </button>

            <div className="social-login">
              <button 
                type="button" 
                className="social-button google"
                onClick={handleGoogleSignIn}
              >
                <FaGoogle /> Sign in with Google
              </button>
              <button 
                type="button" 
                className="social-button facebook"
                onClick={handleFacebookSignIn}
              >
                <FaFacebook /> Sign in with Facebook
              </button>
            </div>

            <div className="signup-link">
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;