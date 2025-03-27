// src/components/SignUp.js
import React, { useState } from "react";
import Swal from "sweetalert2";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import bookBackground from "../src/photo/book1.jpg";
import "./index.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    age: "",
    postalCode: "",
    district: "",
    state: "",
    bookCategories: [],
    educationLevel: "",
    favoriteBook: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const bookCategoriesOptions = ["Mystery", "Romance", "Science Fiction", "Fantasy", "Non-Fiction", "Thriller"];
  const educationLevels = ["High School", "Bachelor's", "Master's", "PhD", "Other"];
  const favoriteBooks = ["The Great Gatsby", "To Kill a Mockingbird", "1984", "Pride and Prejudice"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        bookCategories: checked
          ? [...prev.bookCategories, value]
          : prev.bookCategories.filter((cat) => cat !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSignUp = async () => {
    const {
      username, age, postalCode, district, state, bookCategories, educationLevel, favoriteBook, email, password, confirmPassword
    } = formData;

    if (!username || !age || !postalCode || !district || !state || bookCategories.length === 0 || !educationLevel || !favoriteBook || !email || !password || !confirmPassword) {
      Swal.fire({ icon: "error", title: "Oops...", text: "All fields are required. Please fill them out." });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({ icon: "error", title: "Oops...", text: "Passwords do not match." });
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Swal.fire({ icon: "success", title: "Sign Up Success", text: "You have successfully signed up!" });

      setFormData({
        username: "",
        age: "",
        postalCode: "",
        district: "",
        state: "",
        bookCategories: [],
        educationLevel: "",
        favoriteBook: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      navigate("/signin");
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: error.message });
    }
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url(${bookBackground})` }}
    >
      <div className="form-box bg-white bg-opacity-90 p-12 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3 max-w-5xl">
        <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">Sign Up</h2>
        <form className="space-y-8">
          {/* Username */}
          <div className="input-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Age */}
          <div className="input-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              type="number"
              name="age"
              placeholder="Enter your age"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Postal Code */}
          <div className="input-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
            <input
              type="text"
              name="postalCode"
              placeholder="Enter your postal code"
              value={formData.postalCode}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* District */}
          <div className="input-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
            <input
              type="text"
              name="district"
              placeholder="Enter your district"
              value={formData.district}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* State */}
          <div className="input-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input
              type="text"
              name="state"
              placeholder="Enter your state"
              value={formData.state}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Book Categories (Checkboxes) */}
          <div className="input-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Interested Book Categories</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {bookCategoriesOptions.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-3 p-3 bg-gray-100 rounded-md hover:bg-gray-200 transition"
                >
                  <input
                    type="checkbox"
                    name="bookCategories"
                    value={category}
                    checked={formData.bookCategories.includes(category)}
                    onChange={handleChange}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Education Level (Dropdown) */}
          <div className="input-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
            <select
              name="educationLevel"
              value={formData.educationLevel}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Education Level</option>
              {educationLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Favorite Book (Radio Buttons) */}
          <div className="input-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Most Favorite Book</label>
            <div className="grid grid-cols-1 gap-4">
              {favoriteBooks.map((book) => (
                <label
                  key={book}
                  className="flex items-center gap-3 p-3 bg-gray-100 rounded-md hover:bg-gray-200 transition cursor-pointer w-full"
                >
                  <input
                    type="radio"
                    name="favoriteBook"
                    value={book}
                    checked={formData.favoriteBook === book}
                    onChange={handleChange}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{book}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Email */}
          <div className="input-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter a valid email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="button"
            className="btn-submit w-full bg-blue-600 text-white py-4 rounded-md hover:bg-blue-700 transition duration-300"
            onClick={handleSignUp}
          >
            Sign Up
          </button>

          {/* Sign In Link */}
          <p className="login-link text-center text-gray-600 mt-6">
            Already have an account? <a href="/signin" className="text-blue-600 hover:underline">Sign In</a>
          </p>
        </form>
      </div>
    </section>
  );
};

export default SignUp;