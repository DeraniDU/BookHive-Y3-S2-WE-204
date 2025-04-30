import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import "./SignUp.css";
import { setAuthToken } from "../services/authService"; // New import

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleAuthSuccess = async (user) => {
    try {
      const token = await user.getIdToken();
      setAuthToken(token);
      localStorage.setItem("isLogged", "true");
      Swal.fire({ 
        icon: "success", 
        title: "Welcome!", 
        text: "You're now signed in."
      });
      navigate("/");
    } catch (error) {
      Swal.fire({ icon: "error", title: "Token Error", text: error.message });
    }
  };

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Swal.fire({ icon: "error", title: "Oops...", text: "Please fill all the fields" });
      return;
    }
    if (password !== confirmPassword) {
      Swal.fire({ icon: "error", title: "Oops...", text: "Passwords do not match" });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      await handleAuthSuccess(userCredential.user);
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: error.message });
    }
  };

  const handleSocialSignUp = async (provider) => {
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
          <h2 className="signup-title">Create Account</h2>
          <p className="signup-subtitle">Sign up to get started</p>
          
          <form className="signup-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <i className="user icon"></i>
                <input 
                  type="text" 
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <i className="envelope icon"></i>
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
                <i className="lock icon"></i>
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

            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <div className="input-wrapper">
                <i className="lock icon"></i>
                <input 
                  type="password" 
                  id="confirm-password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="button" className="signup-button" onClick={handleSignUp}>
              Sign Up
            </button>

            <div className="social-login">
              <button 
                type="button" 
                className="social-button google"
                onClick={() => handleSocialSignUp(new GoogleAuthProvider())}
              >
                <i className="google icon"></i> Sign up with Google
              </button>
              <button 
                type="button" 
                className="social-button facebook"
                onClick={() => handleSocialSignUp(new FacebookAuthProvider())}
              >
                <i className="facebook icon"></i> Sign up with Facebook
              </button>
            </div>

            <div className="signup-link">
              Already have an account? <Link to="/signin">Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;