import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import atomicHabitsImage from '../../images/exchange/atomichabits.jpeg';
import image48 from "../../images/exchange/1948.jpeg"
import cleancode from "../../images/exchange/cleancode.jpeg"
import richdad from "../../images/exchange/richdad.jpeg"
import startup from "../../images/exchange/startup.jpeg"
import Becoming from "../../images/exchange/becoming.jpeg"
import rye from "../../images/exchange/rye.jpeg"
import sapiens from "../../images/exchange/sapiens.jpeg"
import habit from "../../images/exchange/habit.jpeg"
import sun from "../../images/exchange/sun.jpeg"
import art from "../../images/exchange/art.jpeg"
import bird from "../../images/exchange/bird.jpeg"
import week from "../../images/exchange/week.jpeg"
import PP from "../../images/exchange/PP.jpeg"
import brave from "../../images/exchange/brave.jpeg"
import theguest from "../../images/exchange/theguest.jpeg"
import hobbit from "../../images/exchange/hobbit.jpeg"
import seven from "../../images/exchange/seven.jpeg"
import edu from "../../images/exchange/edu.jpeg"
import power from "../../images/exchange/power.jpeg"
import four from "../../images/exchange/four.jpeg"
import silent from "../../images/exchange/silent.jpeg"

const booksData = [
  { id: 1, title: "Atomic Habits", author: "James Clear", genre: "Self-help", status: "Available", image: atomicHabitsImage  },
  { id: 2, title: "The Alchemist", author: "Paulo Coelho", genre: "Fiction", status: "Unavailable", image: image48 },
  { id: 3, title: "Clean Code", author: "Robert C. Martin", genre: "Programming", status: "Available", image: cleancode },
  { id: 4, title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", genre: "Finance", status: "Available", image: richdad },
  { id: 5, title: "The Lean Startup", author: "Eric Ries", genre: "Business", status: "Available", image: startup },
  { id: 6, title: "Becoming", author: "Michelle Obama", genre: "Biography", status: "Unavailable", image: Becoming },
  { id: 7, title: "The Catcher in the Rye", author: "J.D. Salinger", genre: "Fiction", status: "Available", image: rye },
  { id: 8, title: "Sapiens", author: "Yuval Noah Harari", genre: "History", status: "Available", image:sapiens },
  { id: 9, title: "The Power of Habit", author: "Charles Duhigg", genre: "Self-help", status: "Unavailable", image: habit },
  { id: 10, title: "The Art of War", author: "Sun Tzu", genre: "Strategy", status: "Available", image:sun },
  { id: 11, title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson", genre: "Self-help", status: "Available", image: art },
  { id: 12, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction", status: "Available", image: bird },
  { id: 13, title: 'The 4-Hour Workweek', author: 'Tim Ferriss', genre: 'Business', status: 'Available', image: week },
  { id: 14, title: 'Principles', author: 'Ray Dalio', genre: 'Business', status: 'Available', image: PP },
  { id: 15, title: 'The Art of War', author: 'Sun Tzu', genre: 'Strategy', status: 'Available', image:  sun },
  { id: 16, title: 'The Catcher in the Rye', author: 'J.D. Salinger', genre: 'Fiction', status: 'Available', image: rye },
  { id: 17, title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', status: 'Available', image: bird },
  { id: 18, title: '1984', author: 'George Orwell', genre: 'Fiction', status: 'Borrowed', image: image48 },
  { id: 19, title: 'Brave New World', author: 'Aldous Huxley', genre: 'Fiction', status: 'Available', image: brave },
  { id: 20, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Fiction', status: 'Available', image: theguest },
  { id: 21, title: "The Power of Habit", author: "Charles Duhigg", genre: "Self-help", status: "Available", image: habit },
  { id: 22, title: "Sapiens", author: "Yuval Noah Harari", genre: "History", status: "Unavailable", image: sapiens },
  { id: 23, title: "The Art of War", author: "Sun Tzu", genre: "Philosophy", status: "Available", image: sun },
  { id: 24, title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", status: "Available", image: hobbit },
  { id: 25, title: "The 7 Habits of Highly Effective People", author: "Stephen R. Covey", genre: "Self-help", status: "Unavailable", image: seven },
  { id: 26, title: "Educated", author: "Tara Westover", genre: "Biography", status: "Available", image: edu },
  { id: 27, title: "The 48 Laws of Power", author: "Robert Greene", genre: "Self-help", status: "Available", image:power },
  { id: 28, title: "The Four Agreements", author: "Don Miguel Ruiz", genre: "Self-help", status: "Unavailable", image: four },
  { id: 29, title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson", genre: "Self-help", status: "Available", image: art },
  { id: 30, title: "The Silent Patient", author: "Alex Michaelides", genre: "Thriller", status: "Unavailable", image: silent }
];

const ExchangeBook = () => {
  const navigate = useNavigate();
  // State for search, filtered books, and selected genre
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState(booksData);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterBooks(query, selectedGenre, sortOrder);
  };

  // Filter books based on search query, genre, and sort order
  const filterBooks = (query, genre, sort) => {
    const filtered = booksData.filter((book) => {
      const matchesSearch = book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query);
      const matchesGenre = genre === "All" || book.genre === genre;
      return matchesSearch && matchesGenre;
    });

    // Sort books
    filtered.sort((a, b) => {
      const compare = sort === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
      return compare;
    });

    setFilteredBooks(filtered);
  };

  // Handle genre button click
  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    filterBooks(searchQuery, genre, sortOrder);
  };

  // Handle sorting change
  const handleSortChange = (order) => {
    setSortOrder(order);
    filterBooks(searchQuery, selectedGenre, order);
  };

  // Modal for book details (to view more information about the book)
  const [selectedBook, setSelectedBook] = useState(null);

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
       <Header />
       
      <h1 style={{ textAlign: 'center', fontSize: '36px', fontWeight: '800', color: '#1D4ED8', marginBottom: '24px' }}>
        📚 Book Exchange Platform
      </h1>

      {/* Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Search books..."
          style={{
            width: '100%',
            maxWidth: '600px',
            padding: '12px',
            border: '1px solid #D1D5DB',
            borderRadius: '8px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            outline: 'none',
            fontSize: '16px'
          }}
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Sorting & Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '24px' }}>
        <select
          onChange={(e) => handleSortChange(e.target.value)}
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '16px' }}
        >
          <option value="asc">Sort by Title (A-Z)</option>
          <option value="desc">Sort by Title (Z-A)</option>
        </select>

        <button
          onClick={() => handleGenreClick("All")}
          style={{
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: '#F3F4F6',
            border: '1px solid #D1D5DB',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          All
        </button>
        <button
          onClick={() => handleGenreClick("Fiction")}
          style={{
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: '#F3F4F6',
            border: '1px solid #D1D5DB',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Fiction
        </button>
        <button
          onClick={() => handleGenreClick("Self-help")}
          style={{
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: '#F3F4F6',
            border: '1px solid #D1D5DB',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Self-help
        </button>
        <button
          onClick={() => handleGenreClick("Finance")}
          style={{
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: '#F3F4F6',
            border: '1px solid #D1D5DB',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Finance
        </button>
        <button
          onClick={() => handleGenreClick("Programming")}
          style={{
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: '#F3F4F6',
            border: '1px solid #D1D5DB',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Programming
        </button>
        <button
          onClick={() => handleGenreClick("Business")}
          style={{
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: '#F3F4F6',
            border: '1px solid #D1D5DB',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Business
        </button>
        <button
          onClick={() => handleGenreClick("Biography")}
          style={{
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: '#F3F4F6',
            border: '1px solid #D1D5DB',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Biography
        </button>
        <button
          onClick={() => handleGenreClick("History")}
          style={{
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: '#F3F4F6',
            border: '1px solid #D1D5DB',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          History
        </button>
        <button
          onClick={() => handleGenreClick("Strategy")}
          style={{
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: '#F3F4F6',
            border: '1px solid #D1D5DB',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Strategy
        </button>
      </div>

      {/* Book Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            style={{
              backgroundColor: '#fff',
              padding: '16px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transform: 'scale(1)',
              transition: 'all 0.3s ease',
            }}
            onClick={() => handleBookClick(book)}
          >
            <img src={book.image} alt={book.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#2D3748', marginBottom: '8px' }}>{book.title}</h2>
            <p style={{ color: '#4A5568', marginBottom: '8px' }}>By {book.author}</p>
            <p style={{ fontSize: '14px', color: '#A0AEC0', marginBottom: '16px' }}>{book.genre}</p>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent the card click from firing
                if (book.status === "Available") {
                  // Navigate to BookRequest page. You can pass book details if needed.
                  navigate("/bookrequest", { state: { book } });
                }
              }}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                color: '#fff',
                backgroundColor: book.status === "Available" ? '#48BB78' : '#A0AEC0',
                cursor: book.status === "Available" ? 'pointer' : 'not-allowed',
              }}
            >
              {book.status === "Available" ? "Request Exchange" : "Unavailable"}
            </button>
          </div>
        ))}
      </div>

      {/* Modal for Book Details */}
      {selectedBook && (
        <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', width: '80%', maxWidth: '800px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px' }}>{selectedBook.title}</h2>
            <img src={selectedBook.image} alt={selectedBook.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }} />
            <p style={{ fontSize: '18px', color: '#4A5568', marginBottom: '16px' }}><strong>Author:</strong> {selectedBook.author}</p>
            <p style={{ fontSize: '16px', color: '#718096', marginBottom: '16px' }}><strong>Genre:</strong> {selectedBook.genre}</p>
            <p style={{ fontSize: '16px', color: '#4A5568', marginBottom: '24px' }}><strong>Status:</strong> {selectedBook.status}</p>
            <button
              onClick={closeModal}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                backgroundColor: '#E53E3E',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
        <Footer />
    </div>
  );
};

export default ExchangeBook;
