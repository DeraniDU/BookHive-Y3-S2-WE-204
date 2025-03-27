import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert"; // Import SweetAlert
import Header from "./components/Header";
import Footer from "./components/Footer";
import BookSearch from "./components/BookSearch";
import "./Home.css";

const Home = () => {
  const [user, setUser] = useState(null);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/signin"); // Redirect to SignIn if no user is logged in
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

        // Filter books with images and pick 6
        let booksWithImages = data.docs
          .filter((book) => book.cover_i) // Only books with cover images
          .slice(0, 6); // Get 6 books

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

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Ensure sign-out completes
      swal("Logged Out!", "You have been logged out successfully.", "success").then(() => {
        navigate("/signin"); // Redirect after SweetAlert confirmation
      });
    } catch (error) {
      swal("Error", error.message, "error");
    }
  };

  return (
    <div className="home-container">
      <Header />

      <section id="hero" className="hero">
        <h2 className="hero-title">Welcome to BookHive</h2>
        <p className="hero-description">
          Exchange, lend, or bid for books with ease!
        </p>
        <a href="#explore" className="hero-button">
          Explore Now
        </a>
      </section>

      {/* Featured Books Section */}
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

      {/* Book Search Section */}
      <section id="book-search">
        <BookSearch />
      </section>

      <Footer />
    </div>
  );
};

export default Home;
