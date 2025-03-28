import React from "react";
import { Link } from "react-router-dom";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import { BsInfoCircle } from "react-icons/bs";
import { AiOutlineEdit } from "react-icons/ai";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const ExchangeHome = () => {
  const books = [
    { _id: "1", title: "Atomic Habits", author: "James Clear", publishYear: 2018 },
    { _id: "2", title: "The Pragmatic Programmer", author: "Andrew Hunt", publishYear: 1999 },
    { _id: "3", title: "Clean Code", author: "Robert C. Martin", publishYear: 2008 },
    { _id: "4", title: "The Pragmatic Programmer", author: "Andrew Hunt, David Thomas", publishYear: 1999 },
    { _id: "5", title: "Code Complete", author: "Steve McConnell", publishYear: 2004 },
    { _id: "6", title: "Clean Code", author: "Robert C. Martin", publishYear: 2008 },
    { _id: "7", title: "Design Patterns", author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides", publishYear: 1994 },
    { _id: "8", title: "Refactoring", author: "Martin Fowler", publishYear: 1999 },
    { _id: "9", title: "You Don't Know JS", author: "Kyle Simpson", publishYear: 2015 },
    { _id: "10", title: "The Mythical Man-Month", author: "Frederick P. Brooks Jr.", publishYear: 1975 }
  ];

  return (
    <>
      <Header />
      <div
        style={{
          padding: "24px",
          maxWidth: "800px",
          margin: "auto",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h1 style={{ fontSize: "28px", color: "#333" }}>Books List</h1>
          <Link to="/exchangeadd" style={{ textDecoration: "none" }}>
            <MdOutlineAddBox
              style={{ fontSize: "36px", color: "#1E3A8A", cursor: "pointer" }}
            />
          </Link>
        </div>

        {books.length > 0 ? (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#fff",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#1E3A8A", color: "white" }}>
                <th style={{ padding: "12px" }}>No</th>
                <th style={{ padding: "12px" }}>Title</th>
                <th style={{ padding: "12px" }}>Author</th>
                <th style={{ padding: "12px" }}>Publish Year</th>
                <th style={{ padding: "12px" }}>Operations</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr key={book._id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ textAlign: "center", padding: "12px", color: "#333" }}>
                    {index + 1}
                  </td>
                  <td style={{ textAlign: "center", padding: "12px", color: "#333" }}>
                    {book.title}
                  </td>
                  <td style={{ textAlign: "center", padding: "12px", color: "#555" }}>
                    {book.author}
                  </td>
                  <td style={{ textAlign: "center", padding: "12px", color: "#777" }}>
                    {book.publishYear}
                  </td>
                  <td style={{ textAlign: "center", padding: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
                      <Link to={`/exchangebook`} style={{ color: "green" }}>
                        <BsInfoCircle style={{ fontSize: "20px", cursor: "pointer" }} />
                      </Link>
                      <Link to={`/exedit`} style={{ color: "orange" }}>
                        <AiOutlineEdit style={{ fontSize: "20px", cursor: "pointer" }} />
                      </Link>
                      <Link to={`/exchangedelete`} style={{ color: "red" }}>
                        <MdOutlineDelete style={{ fontSize: "20px", cursor: "pointer" }} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: "center", color: "gray", fontSize: "18px" }}>
            No books available
          </p>
        )}
      </div>
      <Footer />
    </>
  );

};

export default ExchangeHome;
