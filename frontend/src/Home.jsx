import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const navigate = useNavigate();

  // Fetch books when the component mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/signin'); // Redirect if not logged in
      } else {
        setUser(currentUser);
      }
    });

    const fetchFeaturedBooks = async () => {
      try {
        const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=best+sellers&maxResults=5');
        const data = await response.json();

        // Filter out "The Complete Rhyming Dictionary and Poet's Craft Book"
        const filteredBooks = data.items.filter(book => book.volumeInfo.title !== "The Complete Rhyming Dictionary and Poet's Craft Book");
        
        // Add a new book to the list
        const newBook = {
          id: "newbook1",
          volumeInfo: {
            title: "The Art of Programming",
            authors: ["John Doe"],
            imageLinks: {
              thumbnail: "https://via.placeholder.com/150?text=New+Book"
            }
          }
        };

        filteredBooks.push(newBook); // Add the new book to the filtered list
        setFeaturedBooks(filteredBooks);
      } catch (error) {
        console.error("Error fetching featured books:", error);
      }
    };

    fetchFeaturedBooks();

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

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setBooks([]); // Clear previous search results

      try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchQuery}`);
        const data = await response.json();
        
        if (data.items) {
          setBooks(data.items);
        } else {
          setBooks([]);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      }
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

      {/* Featured Services (Cards) */}
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

      {/* Featured Books Section */}
      <section id="featured-books" className="featured-books">
        <h2 className="featured-books-title">Featured Books</h2>
        <div className="book-list">
          {featuredBooks && featuredBooks.length > 0 ? (
            featuredBooks.map((book) => (
              <div className="book-item" key={book.id}>
                <img
                  src={book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/150"}
                  alt={book.volumeInfo.title}
                  className="book-image"
                />
                <h3 className="book-title">{book.volumeInfo.title}</h3>
                <p className="book-author">{book.volumeInfo.authors?.join(', ') || 'Unknown Author'}</p>
              </div>
            ))
          ) : (
            <p>No featured books found.</p>
          )}
        </div>
      </section>

      {/* Search Section */}
      <section id="search" className="search-section">
        <h2 className="search-title">Search for Books</h2>
        <input
          type="text"
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search books..."
        />
        <button className="search-button" onClick={handleSearch}>Search</button>
        <div className="search-results">
          {books && books.length > 0 ? (
            <div className="book-list">
              {books.map((book) => (
                <div className="book-item" key={book.id}>
                  <img
                    src={book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/150"}
                    alt={book.volumeInfo.title}
                    className="book-image"
                  />
                  <h3 className="book-title">{book.volumeInfo.title}</h3>
                  <p className="book-author">{book.volumeInfo.authors?.join(', ') || 'Unknown Author'}</p>
                  <p className="book-price">{book.saleInfo.listPrice ? `$${book.saleInfo.listPrice.amount}` : 'Free'}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No books found.</p>
          )}
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
