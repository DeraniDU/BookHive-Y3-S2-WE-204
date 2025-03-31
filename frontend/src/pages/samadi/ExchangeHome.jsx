import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdOutlineAddBox, MdOutlineDelete, MdMenuBook, MdSearch, MdFilterList } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
import { BiBookBookmark } from "react-icons/bi";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const ExchangeHome = () => {
  const [books, setBooks] = useState([
    { _id: "1", title: "Atomic Habits", author: "James Clear", publishYear: 2018, coverUrl: "https://books.google.com/books/content?id=XfFvDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" },
    { _id: "2", title: "The Pragmatic Programmer", author: "Andrew Hunt", publishYear: 1999, coverUrl: "https://books.google.com/books/content?id=5wBQEp6ruIAC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" },
    { _id: "3", title: "Clean Code", author: "Robert C. Martin", publishYear: 2008, coverUrl: "https://books.google.com/books/content?id=_i6bDeoCQzsC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" },
    { _id: "4", title: "The Pragmatic Programmer", author: "Andrew Hunt, David Thomas", publishYear: 1999, coverUrl: "https://books.google.com/books/content?id=5wBQEp6ruIAC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" },
    { _id: "5", title: "Code Complete", author: "Steve McConnell", publishYear: 2004, coverUrl: "https://books.google.com/books/content?id=LpVCAwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" },
    { _id: "6", title: "Clean Code", author: "Robert C. Martin", publishYear: 2008, coverUrl: "https://books.google.com/books/content?id=_i6bDeoCQzsC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" },
    { _id: "7", title: "Design Patterns", author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides", publishYear: 1994, coverUrl: "https://books.google.com/books/content?id=6oHuKQe3TjQC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" },
    { _id: "8", title: "Refactoring", author: "Martin Fowler", publishYear: 1999, coverUrl: "https://books.google.com/books/content?id=HmrDHwgkbPsC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" },
    { _id: "9", title: "You Don't Know JS", author: "Kyle Simpson", publishYear: 2015, coverUrl: "https://books.google.com/books/content?id=qZIZtAEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api" },
    { _id: "10", title: "The Mythical Man-Month", author: "Frederick P. Brooks Jr.", publishYear: 1975, coverUrl: "https://books.google.com/books/content?id=Yq35BY5Fk3gC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" }
  ]);

  const [displayMode, setDisplayMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("");

  // Filter books based on search term and year filter
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = filterYear === "" || book.publishYear.toString() === filterYear;
    return matchesSearch && matchesYear;
  });

  // Get unique years for the filter dropdown
  const uniqueYears = [...new Set(books.map(book => book.publishYear))].sort((a, b) => a - b);

  // Function to handle book deletion
  const handleDeleteBook = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      setBooks(books.filter(book => book._id !== id));
    }
  };

  return (
    <>
      <Header />
      <div className="book-exchange-container" style={{
        padding: "30px",
        maxWidth: "1200px",
        margin: "20px auto",
        backgroundColor: "#f8f9fa",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <BiBookBookmark style={{ fontSize: "38px", color: "#1E3A8A", marginRight: "12px" }} />
            <h1 style={{ fontSize: "32px", color: "#1E3A8A", margin: 0 }}>Book Exchange</h1>
          </div>
          <Link to="/exchangeadd" style={{ 
            textDecoration: "none",
            backgroundColor: "#1E3A8A",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}>
            <MdOutlineAddBox style={{ fontSize: "24px", marginRight: "8px" }} />
            Add New Book
          </Link>
        </div>

        {/* Search and filter section */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "15px",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "8px 16px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
            flexGrow: 1,
            maxWidth: "500px",
          }}>
            <MdSearch style={{ fontSize: "24px", color: "#666" }} />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                padding: "8px 12px",
                fontSize: "16px",
                width: "100%",
                backgroundColor: "transparent",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <MdFilterList style={{ fontSize: "24px", color: "#666", marginRight: "8px" }} />
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  outline: "none",
                  fontSize: "16px",
                }}
              >
                <option value="">All Years</option>
                {uniqueYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                onClick={() => setDisplayMode("grid")}
                style={{
                  padding: "10px",
                  backgroundColor: displayMode === "grid" ? "#1E3A8A" : "#fff",
                  color: displayMode === "grid" ? "#fff" : "#333",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Grid
              </button>
              <button
                onClick={() => setDisplayMode("table")}
                style={{
                  padding: "10px",
                  backgroundColor: displayMode === "table" ? "#1E3A8A" : "#fff",
                  color: displayMode === "table" ? "#fff" : "#333",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {/* Book count info */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ color: "#666" }}>
            Showing {filteredBooks.length} of {books.length} books
          </p>
        </div>

        {filteredBooks.length > 0 ? (
          displayMode === "grid" ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "24px",
              marginBottom: "30px",
            }}>
              {filteredBooks.map((book) => (
                <div key={book._id} style={{
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                  transition: "transform 0.3s ease",
                  cursor: "pointer",
                  ":hover": {
                    transform: "translateY(-5px)"
                  }
                }}>
                  <div style={{
                    height: "200px",
                    overflow: "hidden",
                    position: "relative",
                    backgroundColor: "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <img
                      src={book.coverUrl}
                      alt={`${book.title} cover`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/api/placeholder/220/320";
                      }}
                    />
                  </div>
                  <div style={{ padding: "16px" }}>
                    <h3 style={{ 
                      fontSize: "18px", 
                      margin: "0 0 8px 0",
                      color: "#333",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                      {book.title}
                    </h3>
                    <p style={{ 
                      fontSize: "14px",
                      color: "#666",
                      margin: "0 0 8px 0",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                      {book.author}
                    </p>
                    <p style={{ fontSize: "14px", color: "#888", margin: "0 0 16px 0" }}>
                      {book.publishYear}
                    </p>
                    <div style={{ 
                      display: "flex",
                      justifyContent: "space-between",
                      borderTop: "1px solid #eee",
                      paddingTop: "12px",
                    }}>
                      <Link to={`/exedit/${book._id}`} style={{ 
                        color: "#1E3A8A",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                      }}>
                        <AiOutlineEdit style={{ fontSize: "18px", marginRight: "4px" }} />
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDeleteBook(book._id)}
                        style={{ 
                          background: "none",
                          border: "none",
                          color: "#dc3545",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          fontSize: "14px",
                        }}
                      >
                        <MdOutlineDelete style={{ fontSize: "18px", marginRight: "4px" }} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              overflow: "auto",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: "#fff",
                overflow: "hidden",
              }}>
                <thead>
                  <tr style={{ backgroundColor: "#1E3A8A", color: "white" }}>
                    <th style={{ padding: "16px" }}>Cover</th>
                    <th style={{ padding: "16px", textAlign: "left" }}>Title</th>
                    <th style={{ padding: "16px", textAlign: "left" }}>Author</th>
                    <th style={{ padding: "16px" }}>Year</th>
                    <th style={{ padding: "16px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((book) => (
                    <tr key={book._id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "12px", width: "80px" }}>
                        <div style={{ width: "60px", height: "80px", overflow: "hidden", margin: "0 auto" }}>
                          <img
                            src={book.coverUrl}
                            alt={`${book.title} cover`}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/api/placeholder/60/80";
                            }}
                          />
                        </div>
                      </td>
                      <td style={{ padding: "12px", color: "#333", textAlign: "left" }}>
                        {book.title}
                      </td>
                      <td style={{ padding: "12px", color: "#555", textAlign: "left" }}>
                        {book.author}
                      </td>
                      <td style={{ padding: "12px", color: "#777", textAlign: "center" }}>
                        {book.publishYear}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
                          <Link 
                            to={`/exedit/${book._id}`} 
                            style={{ 
                              color: "#1E3A8A",
                              background: "#e6f0ff",
                              padding: "6px 12px",
                              borderRadius: "4px",
                              textDecoration: "none",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <AiOutlineEdit style={{ fontSize: "18px", marginRight: "4px" }} />
                            Edit
                          </Link>
                          <button 
                            onClick={() => handleDeleteBook(book._id)}
                            style={{ 
                              background: "#ffebee",
                              border: "none",
                              color: "#dc3545",
                              padding: "6px 12px",
                              borderRadius: "4px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <MdOutlineDelete style={{ fontSize: "18px", marginRight: "4px" }} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div style={{ 
            textAlign: "center", 
            padding: "40px", 
            backgroundColor: "#fff", 
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          }}>
            <MdMenuBook style={{ fontSize: "64px", color: "#ccc", marginBottom: "16px" }} />
            <p style={{ fontSize: "18px", color: "#666" }}>
              No books available matching your search criteria
            </p>
            <button 
              style={{ 
                marginTop: "16px", 
                padding: "10px 20px", 
                backgroundColor: "#1E3A8A", 
                color: "white", 
                border: "none", 
                borderRadius: "8px", 
                cursor: "pointer",
              }}
              onClick={() => {
                setSearchTerm("");
                setFilterYear("");
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ExchangeHome;