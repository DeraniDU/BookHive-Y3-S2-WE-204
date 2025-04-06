import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const ExchangeHome = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const navigate = useNavigate();

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await axios.get(process.env.REACT_APP_API_URL || "http://localhost:3000/exchange", {
          timeout: 8000, // 8-second timeout
          headers: {
            'Accept': 'application/json',
          }
        });
        
        const responseData = response.data.data || response.data;
        
        if (!Array.isArray(responseData)) {
          throw new Error("Invalid data format received from server");
        }
        
        setBooks(responseData.filter(book => 
          book.available === true || 
          book.available === "true" ||
          book.status === "available"
        ));
        
      } catch (error) {
        console.error("Error fetching books:", error);
        if (error.code === "ECONNABORTED") {
          setError("Request timeout. Please check your connection and try again.");
        } else if (error.response) {
          // Server responded with non-2xx status
          setError(`Server error: ${error.response.status}. Please try again later.`);
        } else if (error.request) {
          // Request made but no response received
          setError("No response from server. Please check your connection and try again.");
        } else {
          setError(error.message || "Failed to load books");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Extract available genres for filtering
  const availableGenres = useMemo(() => {
    const genres = [...new Set(books.map(book => book.genre).filter(Boolean))];
    return genres.sort();
  }, [books]);

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    let result = [...books];
    
    // Apply search filter
    if (searchTerm) {
      const normalizedSearch = searchTerm.toLowerCase();
      result = result.filter(book => 
        (book.title && book.title.toLowerCase().includes(normalizedSearch)) || 
        (book.author && book.author.toLowerCase().includes(normalizedSearch)) ||
        (book.description && book.description.toLowerCase().includes(normalizedSearch))
      );
    }
    
    // Apply genre filter
    if (filterGenre) {
      result = result.filter(book => book.genre === filterGenre);
    }
    
    // Apply sorting
    switch (sortOption) {
      case "title":
        result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      case "author":
        result.sort((a, b) => (a.author || "").localeCompare(b.author || ""));
        break;
      case "condition":
        const conditionOrder = { "New": 1, "Like New": 2, "Good": 3, "Fair": 4, "Poor": 5 };
        result.sort((a, b) => (conditionOrder[a.condition] || 99) - (conditionOrder[b.condition] || 99));
        break;
      default:
        // Default sorting (newest first, assuming _id is time-based like MongoDB)
        result.sort((a, b) => b._id?.localeCompare(a._id));
    }
    
    return result;
  }, [books, searchTerm, filterGenre, sortOption]);

  const handleAddBook = () => navigate("/exchange/add");
  const handleRequestExchange = (id) => navigate(`/request/add?bookId=${id}`);

  // Improved image URL handling
  const getOptimizedImageUrl = (url) => {
    if (!url) return null;
    
    // If it's a Cloudinary URL, optimize it
    if (url.includes('res.cloudinary.com')) {
      return url.replace('/upload/', '/upload/w_400,h_300,c_fill,q_auto,f_auto/');
    }
    
    // If it's a Google Books thumbnail, enhance it
    if (url.includes('books.google.com')) {
      return url.replace('zoom=1', 'zoom=0').replace('&edge=curl', '');
    }
    
    // For other URLs, return as is
    return url;
  };

  // Get condition style
  const getConditionStyle = (condition) => {
    switch (condition) {
      case 'New':
        return { backgroundColor: "#d4edda", color: "#155724" };
      case 'Like New':
        return { backgroundColor: "#d1ecf1", color: "#0c5460" };
      case 'Good':
        return { backgroundColor: "#d1e7dd", color: "#0f5132" };
      case 'Fair':
        return { backgroundColor: "#fff3cd", color: "#856404" };
      default:
        return { backgroundColor: "#f8d7da", color: "#721c24" };
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <div style={{
          width: "3rem", 
          height: "3rem", 
          borderRadius: "50%",
          border: "4px solid #f3f3f3", 
          borderTop: "4px solid #3498db", 
          animation: "spin 1s linear infinite"
        }}></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem"
      }}>
        <div style={{
          backgroundColor: "#fef2f2",
          border: "1px solid #fee2e2",
          borderRadius: "0.5rem",
          padding: "1.5rem",
          maxWidth: "32rem",
          width: "100%",
          textAlign: "center"
        }}>
          <h3 style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            color: "#b91c1c",
            marginBottom: "0.75rem"
          }}>Error Loading Books</h3>
          <p style={{
            marginBottom: "1rem",
            color: "#ef4444"
          }}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
              transition: "background-color 0.2s"
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column"
    }}>
      <Header />
      
      <main style={{
        flex: "1",
        padding: "1rem 1.5rem",
        maxWidth: "1280px",
        margin: "0 auto",
        width: "100%"
      }}>
        {/* Page Header */}
        <div style={{
          display: "flex",
          flexDirection: window.innerWidth < 640 ? "column" : "row",
          justifyContent: "space-between",
          alignItems: window.innerWidth < 640 ? "flex-start" : "center",
          marginBottom: "1.5rem",
          gap: "1rem"
        }}>
          <h2 style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#1f2937",
            margin: 0
          }}>Available Books for Exchange</h2>
          
          <button 
            onClick={handleAddBook}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
              transition: "background-color 0.2s"
            }}
          >
            + Add Your Book
          </button>
        </div>
        
        {/* Search and Filters */}
        <div style={{
          backgroundColor: "#f9fafb",
          padding: "1rem",
          borderRadius: "0.5rem",
          marginBottom: "1.5rem"
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: window.innerWidth < 768 ? "1fr" : "2fr 1fr 1fr",
            gap: "1rem"
          }}>
            <div>
              <label htmlFor="search" style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#4b5563",
                marginBottom: "0.25rem"
              }}>Search Books</label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, author, or description..."
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.25rem",
                  fontSize: "0.875rem"
                }}
              />
            </div>
            
            <div>
              <label htmlFor="genre" style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#4b5563",
                marginBottom: "0.25rem"
              }}>Filter by Genre</label>
              <select
                id="genre"
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.25rem",
                  fontSize: "0.875rem",
                  backgroundColor: "white"
                }}
              >
                <option value="">All Genres</option>
                {availableGenres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="sort" style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#4b5563",
                marginBottom: "0.25rem"
              }}>Sort By</label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.25rem",
                  fontSize: "0.875rem",
                  backgroundColor: "white"
                }}
              >
                <option value="default">Newest First</option>
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="condition">Condition</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Results summary */}
        <div style={{
          marginBottom: "1rem",
          color: "#6b7280",
          fontSize: "0.875rem"
        }}>
          Showing {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
          {searchTerm && ` matching "${searchTerm}"`}
          {filterGenre && ` in ${filterGenre}`}
        </div>

        {/* Empty state */}
        {filteredBooks.length === 0 ? (
          <div style={{
            backgroundColor: "#f9fafb",
            border: "2px dashed #e5e7eb",
            borderRadius: "0.5rem",
            padding: "2rem",
            textAlign: "center"
          }}>
            <h3 style={{
              fontSize: "1.25rem",
              fontWeight: "500",
              color: "#6b7280",
              marginBottom: "0.5rem"
            }}>
              {books.length === 0 ? "No Books Available" : "No Matching Books Found"}
            </h3>
            <p style={{
              color: "#9ca3af",
              marginBottom: "1.5rem"
            }}>
              {books.length === 0 
                ? "There are currently no books available for exchange."
                : "Try changing your search criteria or filters."}
            </p>
            {books.length === 0 ? (
              <button 
                onClick={handleAddBook}
                style={{
                  padding: "0.5rem 1.5rem",
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "0.25rem",
                  cursor: "pointer",
                  transition: "background-color 0.2s"
                }}
              >
                Add First Book
              </button>
            ) : (
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setFilterGenre("");
                  setSortOption("default");
                }}
                style={{
                  padding: "0.5rem 1.5rem",
                  backgroundColor: "#4b5563",
                  color: "white",
                  border: "none",
                  borderRadius: "0.25rem",
                  cursor: "pointer",
                  transition: "background-color 0.2s"
                }}
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(auto-fill, minmax(${window.innerWidth < 640 ? "100%" : "280px"}, 1fr))`,
            gap: "1.5rem"
          }}>
            {filteredBooks.map((book) => {
              const optimizedImageUrl = getOptimizedImageUrl(book.bookImage?.url);
              const fallbackImageUrl = `https://via.placeholder.com/400x300?text=${encodeURIComponent(book.title || 'Book Cover')}`;
              const conditionStyles = book.condition ? getConditionStyle(book.condition) : {};
              
              return (
                <div 
                  key={book._id}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
                    transition: "box-shadow 0.3s ease"
                  }}
                >
                  {/* Book Image */}
                  <div style={{
                    height: "256px",
                    overflow: "hidden",
                    position: "relative",
                    backgroundColor: "#f3f4f6"
                  }}>
                    {optimizedImageUrl ? (
                      <>
                        <img
                          src={optimizedImageUrl}
                          alt={`Cover of ${book.title}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "opacity 0.3s ease",
                            opacity: loadedImages[book._id] ? 1 : 0
                          }}
                          onLoad={() => setLoadedImages(prev => ({ ...prev, [book._id]: true }))}
                          onError={(e) => {
                            e.target.src = fallbackImageUrl;
                            setLoadedImages(prev => ({ ...prev, [book._id]: true }));
                          }}
                        />
                        {!loadedImages[book._id] && (
                          <div style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#f3f4f6"
                          }}>
                            <div style={{
                              width: "2rem", 
                              height: "2rem", 
                              borderRadius: "50%",
                              border: "4px solid #f3f3f3", 
                              borderTop: "4px solid #3498db", 
                              animation: "spin 1s linear infinite"
                            }}></div>
                          </div>
                        )}
                      </>
                    ) : (
                      <img
                        src={fallbackImageUrl}
                        alt={`Cover of ${book.title}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                      />
                    )}
                  </div>

                  {/* Book Details */}
                  <div style={{ padding: "1rem" }}>
                    <h3 style={{
                      fontWeight: "bold",
                      color: "#1f2937",
                      fontSize: "1.125rem",
                      marginBottom: "0.25rem",
                      lineHeight: "1.25",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical"
                    }}>
                      {book.title || "Untitled Book"}
                    </h3>
                    
                    <div style={{ marginBottom: "0.5rem", fontSize: "0.875rem" }}>
                      <p style={{ color: "#4b5563", margin: "0.125rem 0" }}>
                        <span style={{ fontWeight: "500" }}>Author:</span> {book.author || "Unknown"}
                      </p>
                      {book.genre && (
                        <p style={{ color: "#4b5563", margin: "0.125rem 0" }}>
                          <span style={{ fontWeight: "500" }}>Genre:</span> {book.genre}
                        </p>
                      )}
                    </div>

                    <p style={{
                      color: "#6b7280",
                      fontSize: "0.875rem",
                      marginBottom: "0.75rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      lineHeight: "1.5"
                    }}>
                      {book.description || "No description available for this book."}
                    </p>

                    <div style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                      marginBottom: "1rem"
                    }}>
                      {book.condition && (
                        <span style={{
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                          ...conditionStyles
                        }}>
                          {book.condition} condition
                        </span>
                      )}
                      
                      {book.location && (
                        <span style={{
                          backgroundColor: "#f3f4f6",
                          color: "#4b5563",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                          fontSize: "0.75rem",
                          fontWeight: "500"
                        }}>
                          {book.location}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleRequestExchange(book._id)}
                      style={{
                        width: "100%",
                        padding: "0.5rem 0",
                        backgroundColor: "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: "0.25rem",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "background-color 0.2s"
                      }}
                    >
                      Request Exchange
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ExchangeHome;