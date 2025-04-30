import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert"; 
import Header from "./components/Header";
import Footer from "./components/Footer";
import BookSearch from "./components/BookSearch";
import "./Home.css";
import { clearAuthToken } from "./services/authService";

const Home = () => {
  const [user, setUser] = useState(null);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/signin");
      } else {
        setUser(currentUser);
      }
    });

    // Fetch Featured Books
    const fetchFeaturedBooks = async () => {
      try {
        const response = await fetch(
          "https://openlibrary.org/search.json?q=technology&limit=20"
        );
        const data = await response.json();

        let booksWithImages = data.docs
          .filter((book) => book.cover_i)
          .slice(0, 6);

        setFeaturedBooks(booksWithImages);
      } catch (error) {
        console.error("Error fetching featured books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBooks();
    return () => unsubscribe();
  }, [navigate]);

  // Updated logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      clearAuthToken();
      
      // Verification check
      const tokenAfterLogout = localStorage.getItem("firebaseToken");
      console.log("Token after logout:", tokenAfterLogout); // Should be null
      
      swal("Success", "Logged out successfully", "success").then(() => {
        navigate("/signin");
      });
    } catch (error) {
      swal("Error", error.message, "error");
    }
  };

  return (
    <div className="home-container">
      <Header onLogout={handleLogout} />

      <section id="hero" className="hero">
        <h2 className="hero-title">Welcome to BookHive</h2>
        <p className="hero-description">
          Exchange, lend, or bid for books with ease!
        </p>
        <a href="#explore" className="hero-button">
          Explore Now
        </a>
      </section>

      <section id="featured-books" className="featured-books">
        <h2 className="featured-books-title">Featured Books</h2>
        {loading ? (
          <p>Loading books...</p>
        ) : (
          <div className="book-list">
            {featuredBooks.map((book) => (
              <div className="book-item" key={book.key}>
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                  alt={book.title}
                  className="book-image"
                />
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">
                  {book.author_name?.join(", ") || "Unknown Author"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section id="book-search">
        <BookSearch />
      </section>

      <Footer />
    </div>
  );
};

export default Home;