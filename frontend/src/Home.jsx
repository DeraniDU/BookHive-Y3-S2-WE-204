import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/signin'); // Redirect if not logged in
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      navigate('/signin');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="navbar-title">BookHive</h1>
          <div className="navbar-links">
            <a href="#home" className="navbar-link">Home</a>
            <a href="#services" className="navbar-link">Services</a>
            <a href="#contact" className="navbar-link">Contact</a>
            {user && (
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero">
        <h2 className="hero-title">Welcome to BookHive</h2>
        <p className="hero-description">Exchange, lend, or bid for books with ease!</p>
        <a href="#explore" className="hero-button">Explore Now</a>
      </section>

      {/* Featured Services */}
      <section id="explore" className="featured-services">
        <h2 className="featured-services-title">Our Services</h2>
        <div className="service-list">
          {/* Book Exchange */}
          <div className="service-item">
            <img src="https://via.placeholder.com/400" alt="Book Exchange" className="service-image" />
            <h3 className="service-title">Book Exchange</h3>
            <p className="service-info">Swap books with others and expand your collection.</p>
            <p className="service-price">Free</p>
            <a href="#book-exchange" className="service-button">Start Exchanging</a>
          </div>
          {/* Book Lending */}
          <div className="service-item">
            <img src="https://via.placeholder.com/400" alt="Book Lending" className="service-image" />
            <h3 className="service-title">Book Lending</h3>
            <p className="service-info">Lend your books to others and borrow from the community.</p>
            <p className="service-price">Free</p>
            <a href="#book-lending" className="service-button">Start Lending</a>
          </div>
          {/* Book Bidding */}
          <div className="service-item">
            <img src="https://via.placeholder.com/400" alt="Book Bidding" className="service-image" />
            <h3 className="service-title">Book Bidding</h3>
            <p className="service-info">Bid for books and get the best deals.</p>
            <p className="service-price">Varies</p>
            <a href="#book-bidding" className="service-button">Start Bidding</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 BookHive. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
