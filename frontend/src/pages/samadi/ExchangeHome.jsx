import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BsInfoCircle } from "react-icons/bs";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import Spinner from "../../components/Spinner";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const ExchangeHome = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3000/books")
      .then((response) => {
        setBooks(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const filteredBooks = books.filter((book) => {
    return (
      book.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.bookGenre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.availableDate.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const containerStyle = {
    padding: "20px",
  };

  const addButtonStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#28a745",
    color: "white",
    padding: "8px 12px",
    borderRadius: "5px",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    border: "none",
  };

  return (
    <div style={containerStyle}>
      <Header />

      <div style={{ marginTop: "20px", padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "32px", color: "#1e3a8a", textTransform: "uppercase" }}>
            Book Exchange Catalog
          </h2>

          {/* Add Manager Button - Placed Above Table, Right Side */}
          <Link to="/books/create" style={addButtonStyle}>
            <MdOutlineAddBox style={{ fontSize: "24px" }} />
            Add Book
          </Link>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "250px",
            }}
          />
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ padding: "10px", backgroundColor: "#f1f5f9", color: "#1e3a8a", textAlign: "center" }}>No</th>
                <th style={{ padding: "10px", backgroundColor: "#f1f5f9", color: "#1e3a8a", textAlign: "center" }}>Title</th>
                <th style={{ padding: "10px", backgroundColor: "#f1f5f9", color: "#1e3a8a", textAlign: "center" }}>Genre</th>
                <th style={{ padding: "10px", backgroundColor: "#f1f5f9", color: "#1e3a8a", textAlign: "center" }}>Condition</th>
                <th style={{ padding: "10px", backgroundColor: "#f1f5f9", color: "#1e3a8a", textAlign: "center" }}>Available Date</th>
                <th style={{ padding: "10px", backgroundColor: "#f1f5f9", color: "#1e3a8a", textAlign: "center" }}>Operations</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book, index) => (
                <tr key={book._id}>
                  <td style={{ padding: "8px", backgroundColor: "#f9fafb", textAlign: "center", borderBottom: "1px solid #ddd" }}>
                    {index + 1}
                  </td>
                  <td style={{ padding: "8px", backgroundColor: "#f9fafb", textAlign: "center", borderBottom: "1px solid #ddd" }}>
                    {book.bookTitle}
                  </td>
                  <td style={{ padding: "8px", backgroundColor: "#f9fafb", textAlign: "center", borderBottom: "1px solid #ddd" }}>
                    {book.bookGenre}
                  </td>
                  <td style={{ padding: "8px", backgroundColor: "#f9fafb", textAlign: "center", borderBottom: "1px solid #ddd" }}>
                    {book.condition}
                  </td>
                  <td style={{ padding: "8px", backgroundColor: "#f9fafb", textAlign: "center", borderBottom: "1px solid #ddd" }}>
                    {book.availableDate}
                  </td>
                  <td style={{ padding: "8px", backgroundColor: "#f9fafb", textAlign: "center", borderBottom: "1px solid #ddd" }}>
                    <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                      <Link to={`/books/details/${book._id}`} style={{ color: "yellow", fontSize: "20px" }}>
                        <BsInfoCircle />
                      </Link>
                      <Link to={`/books/edit/${book._id}`} style={{ color: "#4B8DFF", fontSize: "20px" }}>
                        <AiOutlineEdit />
                      </Link>
                      <Link to={`/books/delete/${book._id}`} style={{ color: "red", fontSize: "20px" }}>
                        <MdOutlineDelete />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ExchangeHome;
