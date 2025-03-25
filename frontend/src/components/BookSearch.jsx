import React, { useState } from "react";
import axios from "axios";

const BookSearch = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

<<<<<<< HEAD
  const API_KEY = "AIzaSyAb0O_MywOx0cvRbMHRPs9MvqQvvjSvL6A"; // 🔴 WARNING: API Key is exposed
=======
  const API_KEY = "AIzaSyXXXXX-YOUR-KEY-HERE"; // 🔴 WARNING: API Key is exposed
>>>>>>> b802650f769afd032ef7c94e617070f8c448a732

  const searchBooks = async () => {
    if (!query) return;
    setLoading(true);

    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}`
      );
      setBooks(response.data.items || []);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-search">
      <h2>Search Books</h2>
      <input
        type="text"
        placeholder="Enter book title..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={searchBooks}>Search</button>

      {loading && <p>Loading...</p>}

      <div className="book-results">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.id} className="book-card">
              <h3>{book.volumeInfo.title}</h3>
              <p>{book.volumeInfo.authors?.join(", ")}</p>
              {book.volumeInfo.imageLinks?.thumbnail && (
                <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} />
              )}
              <a href={book.volumeInfo.infoLink} target="_blank" rel="noopener noreferrer">
                More Info
              </a>
            </div>
          ))
        ) : (
          <p>No books found.</p>
        )}
      </div>
    </div>
  );
};

export default BookSearch;
