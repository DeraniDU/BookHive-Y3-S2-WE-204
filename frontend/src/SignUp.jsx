<<<<<<< HEAD
import React, { useState } from "react";
import { auth } from "./firebase";  
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./SignUp.css"; // Import the updated CSS
=======
import React, { useState } from 'react';
import './SignUp.css';
>>>>>>> parent of 7cb8d0d (Created SignUp & SignIn)

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
<<<<<<< HEAD
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("User created successfully!");
      navigate("/signin"); // Redirect to Sign In page after successful signup
    } catch (error) {
      alert(error.message);
=======
    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match");
      return;
>>>>>>> parent of 7cb8d0d (Created SignUp & SignIn)
    }
    // Simulate account creation logic here
    alert('Account created successfully');
    // Redirect to sign-in page or home
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
<<<<<<< HEAD
=======
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p className="error">{errorMessage}</p>}
>>>>>>> parent of 7cb8d0d (Created SignUp & SignIn)
        <button type="submit" className="signup-button">Sign Up</button>
      </form>
      <p className="alt-option">
        Already have an account? <a href="/signin">Sign In</a>
      </p>
    </div>
  );
};

export default SignUp;
