import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { FaEnvelope, FaLock, FaGoogle, FaFacebook } from "react-icons/fa";
import "./SignUp.css";
import { setAuthToken } from "../services/authService"; // New import

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuthSuccess = async (user) => {
    try {
      const token = await user.getIdToken();
      setAuthToken(token); // Store token
      localStorage.setItem("isLogged", "true"); // Can keep for UI state
      Swal.fire({ icon: "success", title: "Success!", text: "You are now logged in!" });
      navigate("/");
    } catch (error) {
      Swal.fire({ icon: "error", title: "Token Error", text: error.message });
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Swal.fire({ icon: "error", title: "Oops...", text: "Please fill all fields!" });
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await handleAuthSuccess(userCredential.user);
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: error.message });
    }
  };

  const handleSocialSignIn = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      await handleAuthSuccess(result.user);
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

            <button type="button" className="signup-button" onClick={handleSignIn}>
              Sign In
            </button>

            <div className="social-login">
              <button 
                type="button" 
                className="social-button google"
                onClick={() => handleSocialSignIn(new GoogleAuthProvider())}
              >
                <FaGoogle /> Sign in with Google
              </button>
              <button 
                type="button" 
                className="social-button facebook"
                onClick={() => handleSocialSignIn(new FacebookAuthProvider())}
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