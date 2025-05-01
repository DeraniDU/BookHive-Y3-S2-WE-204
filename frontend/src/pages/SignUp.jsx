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

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
      Swal.fire({ 
        icon: "success", 
        title: "Account Created", 
        text: "You have successfully signed up! Please sign in to continue."
      });
      navigate("/signin"); // Redirect to Sign In page
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: error.message });
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      Swal.fire({ icon: "success", title: "Signed Up", text: "You have successfully signed up with Google!" });
      localStorage.setItem("isLogged", true);
      navigate("/home");
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: error.message });
    }
  };

  const handleFacebookSignUp = async () => {
    const provider = new FacebookAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      Swal.fire({ icon: "success", title: "Signed Up", text: "You have successfully signed up with Facebook!" });
      localStorage.setItem("isLogged", true);
      navigate("/home");
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

            <button 
              type="button" 
              className="signup-button"
              onClick={handleSignUp}
            >
              Sign Up
            </button>

            <div className="social-login">
              <button 
                type="button" 
                className="social-button google"
                onClick={handleGoogleSignUp}
              >
                <i className="google icon"></i> Sign up with Google
              </button>
              <button 
                type="button" 
                className="social-button facebook"
                onClick={handleFacebookSignUp}
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
