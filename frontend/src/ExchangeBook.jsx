import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const booksData = [
  { id: 1, title: "Atomic Habits", author: "James Clear", genre: "Self-help", status: "Available", image: "https://via.placeholder.com/150" },
  { id: 2, title: "The Alchemist", author: "Paulo Coelho", genre: "Fiction", status: "Unavailable", image: "https://via.placeholder.com/150" },
  { id: 3, title: "Clean Code", author: "Robert C. Martin", genre: "Programming", status: "Available", image: "https://via.placeholder.com/150" },
  { id: 4, title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", genre: "Finance", status: "Available", image: "https://via.placeholder.com/150" },
  { id: 5, title: "The Lean Startup", author: "Eric Ries", genre: "Business", status: "Available", image: "https://via.placeholder.com/150" },
  { id: 6, title: "Becoming", author: "Michelle Obama", genre: "Biography", status: "Unavailable", image: "https://via.placeholder.com/150" },
  { id: 7, title: "The Catcher in the Rye", author: "J.D. Salinger", genre: "Fiction", status: "Available", image: "https://via.placeholder.com/150" },
  { id: 8, title: "Sapiens", author: "Yuval Noah Harari", genre: "History", status: "Available", image: "https://via.placeholder.com/150" },
  { id: 9, title: "The Power of Habit", author: "Charles Duhigg", genre: "Self-help", status: "Unavailable", image: "https://via.placeholder.com/150" },
  { id: 10, title: "The Art of War", author: "Sun Tzu", genre: "Strategy", status: "Available", image: "https://via.placeholder.com/150" },
  { id: 11, title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson", genre: "Self-help", status: "Available", image: "https://via.placeholder.com/150" },
  { id: 12, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction", status: "Available", image: "https://via.placeholder.com/150" },
  { id: 13, title: 'The 4-Hour Workweek', author: 'Tim Ferriss', genre: 'Business', status: 'Available', image: 'https://images.unsplash.com/photo-1518828675897-798ed85a06a9' },
  { id: 14, title: 'Principles', author: 'Ray Dalio', genre: 'Business', status: 'Available', image: 'https://images.unsplash.com/photo-1515440761180-03b7bc89e4eb' },
  { id: 15, title: 'The Art of War', author: 'Sun Tzu', genre: 'Strategy', status: 'Available', image: 'https://images.unsplash.com/photo-1529156093063-2dcd25d37862' },
  { id: 16, title: 'The Catcher in the Rye', author: 'J.D. Salinger', genre: 'Fiction', status: 'Available', image: 'https://images.unsplash.com/photo-1518680732560-c6e30ba12f71' },
  { id: 17, title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', status: 'Available', image: 'https://images.unsplash.com/photo-1574713022773-3ca4fc5511ca' },
  { id: 18, title: '1984', author: 'George Orwell', genre: 'Fiction', status: 'Borrowed', image: 'https://images.unsplash.com/photo-1587590770418-17c745c10887' },
  { id: 19, title: 'Brave New World', author: 'Aldous Huxley', genre: 'Fiction', status: 'Available', image: 'https://images.unsplash.com/photo-1565725724-cd8722b8c29d' },
  { id: 20, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Fiction', status: 'Available', image: 'https://images.unsplash.com/photo-1553838989-b0fd877c2e6b' },
  { id: 21, title: "The Power of Habit", author: "Charles Duhigg", genre: "Self-help", status: "Available", image: "https://via.placeholder.com/150" },
  { id: 22, title: "Sapiens", author: "Yuval Noah Harari", genre: "History", status: "Unavailable", image: "https://via.placeholder.com/150" },
  { id: 23, title: "The Art of War", author: "Sun Tzu", genre: "Philosophy", status: "Available", image: "https://via.placeholder.com/150" },
  { id: 24, title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", status: "Available", image: "https://via.placeholder.com/150" },
  { id: 25, title: "The 7 Habits of Highly Effective People", author: "Stephen R. Covey", genre: "Self-help", status: "Unavailable", image: "https://via.placeholder.com/150" },
  { id: 26, title: "Educated", author: "Tara Westover", genre: "Biography", status: "Available", image: "https://via.placeholder.com/150" },
  { id: 27, title: "The 48 Laws of Power", author: "Robert Greene", genre: "Self-help", status: "Available", image: "https://via.placeholder.com/150" },
  { id: 28, title: "The Four Agreements", author: "Don Miguel Ruiz", genre: "Self-help", status: "Unavailable", image: "https://via.placeholder.com/150" },
  { id: 29, title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson", genre: "Self-help", status: "Available", image: "https://via.placeholder.com/150" },
  { id: 30, title: "The Silent Patient", author: "Alex Michaelides", genre: "Thriller", status: "Unavailable", image: "https://via.placeholder.com/150" }
];

const BookExchange = () => {
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
      {/* Header */}
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
    </div>
  );
};

export default BookExchange;
