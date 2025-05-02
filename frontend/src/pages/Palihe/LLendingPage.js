import React, { useState, useEffect } from "react";
import { BookOpen, Search, ChevronRight, X, Plus, MessageSquare, Trash2, Edit, Download } from "lucide-react";
import Swal from "sweetalert2";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { PDFDownloadLink } from "@react-pdf/renderer";
import axios from "axios";
import bookBackground from "../../photo/book5.jpeg";
import Header from "../../components/Header"; // Import the Header component

// PDF Styles (unchanged)
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 20,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f5f5f5",
    padding: 5,
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  headerText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  bodyText: {
    fontSize: 9,
  },
  bookCover: {
    width: 40,
    height: 60,
  },
  borrowerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  borrowerAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  },
});

// PDF Document Component (unchanged)
const ApprovedBooksReport = ({ books }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Approved Books Report</Text>
        <Text style={styles.subtitle}>
          Generated on {new Date().toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.headerText}>Book Cover</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.headerText}>Title & Author</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.headerText}>Borrower Info</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.headerText}>Days Left</Text>
          </View>
        </View>

        {books.map((book, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}>
              <Image src={book.cover} style={styles.bookCover} />
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.bodyText}>{book.title}</Text>
              <Text style={[styles.bodyText, { color: "#666" }]}>
                By {book.author}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <View style={styles.borrowerInfo}>
                <Image
                  src={book.borrower.avatar}
                  style={styles.borrowerAvatar}
                />
                <Text style={styles.bodyText}>{book.borrower.name}</Text>
              </View>
              <Text style={[styles.bodyText, { fontSize: 8 }]}>
                {book.borrower.email}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text
                style={[
                  styles.bodyText,
                  {
                    color:
                      book.daysLeft <= 2
                        ? "red"
                        : book.daysLeft <= 5
                        ? "orange"
                        : "green",
                    fontWeight: "bold",
                  },
                ]}
              >
                {book.daysLeft} day{book.daysLeft !== 1 ? "s" : ""}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

function BookLendingPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    bookName: "",
    author: "",
    bookType: "",
    availableArea: "",
    review: "",
    bookPhoto: "",
  });
  const [editingBookId, setEditingBookId] = useState(null);
  const [approvedBooks, setApprovedBooks] = useState([]);
  const [waitingBooks, setWaitingBooks] = useState([]);
  const [currentChatBook, setCurrentChatBook] = useState(null);
  const [headerAnimated, setHeaderAnimated] = useState(false);

  // Header animation
  useEffect(() => {
    setHeaderAnimated(true);
  }, []);

  // Fetch approved books for the current user (lender)
  useEffect(() => {
    const fetchApprovedBooks = async () => {
      try {
        const userId = localStorage.getItem("firebaseUserId");
        if (!userId) {
          console.error("No userId found in localStorage");
          return;
        }
        const response = await axios.get("http://localhost:3000/api/approved-books", {
          params: { lenderId: userId },
        });
        setApprovedBooks(response.data.approvedBooks || []);
      } catch (error) {
        console.error("Failed to fetch approved books:", error.response?.data || error.message);
      }
    };

    fetchApprovedBooks();
  }, []);

  // Fetch books uploaded by current user
  useEffect(() => {
    const fetchUserLentBooks = async () => {
      try {
        const userId = localStorage.getItem("firebaseUserId");
        if (!userId) return;

        const response = await axios.get("http://localhost:3000/api/Lendbook");
        const allBooks = response.data.books || [];

        const userBooks = allBooks.filter(book => book.userId === userId);
        setWaitingBooks(userBooks);
      } catch (error) {
        console.error("Failed to fetch user lent books:", error.message);
      }
    };

    fetchUserLentBooks();
  }, []);

  const toggleChat = (book) => {
    setCurrentChatBook(book);
    setIsChatOpen(!isChatOpen);
  };

  const handleSendMessage = () => {
    console.log("Message sent:", message);
    setMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDeleteBook = async (bookId) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "This book will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmed.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/Lendbook/${bookId}`);
        setWaitingBooks(prev => prev.filter(book => book._id !== bookId));
        Swal.fire("Deleted!", "Your book has been removed.", "success");
      } catch (error) {
        console.error("❌ Delete failed:", error.message);
        Swal.fire("Error", "Could not delete the book.", "error");
      }
    }
  };

  const handleEditBook = (book) => {
    setFormData({
      bookName: book.title,
      author: book.author,
      bookType: book.bookType,
      availableArea: book.availableArea,
      review: book.review,
      bookPhoto: "",
    });

    setEditingBookId(book._id);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.bookName.trim()) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter the book name!",
      });
    }
    if (!formData.author.trim()) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter the author name!",
      });
    }
    if (!formData.bookType) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a book type!",
      });
    }
    if (!formData.availableArea.trim()) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter the available area!",
      });
    }
    if (!formData.review.trim()) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please write a brief review!",
      });
    }

    const userId = localStorage.getItem("firebaseUserId");
    if (!userId) {
      return Swal.fire({
        icon: "error",
        title: "Not Logged In",
        text: "Please sign in to add a book for lending!",
        showConfirmButton: true,
        confirmButtonText: "Sign In",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/signin";
        }
      });
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to add this book for lending?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, add it!",
    });

    if (result.isConfirmed) {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.bookName);
        formDataToSend.append("author", formData.author);
        formDataToSend.append("bookType", formData.bookType);
        formDataToSend.append("availableArea", formData.availableArea);
        formDataToSend.append("review", formData.review);
        formDataToSend.append("userId", userId);

        if (formData.bookPhoto) {
          formDataToSend.append("image", formData.bookPhoto);
        }

        if (editingBookId) {
          await axios.put(`http://localhost:3000/api/Lendbook/${editingBookId}`, {
            title: formData.bookName,
            author: formData.author,
            bookType: formData.bookType,
            availableArea: formData.availableArea,
            review: formData.review,
          });

          Swal.fire("Updated!", "Book details have been updated.", "success");

          const updatedBooks = await axios.get("http://localhost:3000/api/Lendbook");
          setWaitingBooks(updatedBooks.data.books.filter(b => b.userId === userId));

          setEditingBookId(null);
          setIsFormOpen(false);
          return;
        }

        const response = await axios.post(
          "http://localhost:3000/api/Lendbook",
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("✅ Book added successfully:", response.data);
        Swal.fire("Added!", "Your book has been added for lending.", "success");

        setFormData({
          bookName: "",
          author: "",
          bookType: "",
          availableArea: "",
          review: "",
          bookPhoto: "",
        });
        setIsFormOpen(false);

        // Refresh waiting books
        const updatedBooks = await axios.get("http://localhost:3000/api/Lendbook");
        setWaitingBooks(updatedBooks.data.books.filter(b => b.userId === userId));
      } catch (error) {
        console.error("❌ Failed to add book:", error.response?.data || error.message);
        Swal.fire("Error!", "Something went wrong. Please try again.", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Add Header Component */}
      <Header />

      {/* Animated Header */}
      <div
        className="relative h-64 bg-gradient-to-r from-blue-700 to-purple-800 flex items-center justify-center overflow-hidden"
        style={{
          opacity: headerAnimated ? 1 : 0,
          transition: "opacity 1s ease-in-out",
        }}
      >
        <div
          className="relative z-10 text-center text-white px-4"
          style={{
            transform: headerAnimated ? "translateY(0)" : "translateY(30px)",
            opacity: headerAnimated ? 1 : 0,
            transition: "transform 0.8s ease-out, opacity 0.8s ease-out",
          }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-2">Lending</h1>
          <p
            className="text-xl text-white/80 max-w-2xl mx-auto"
            style={{
              opacity: headerAnimated ? 1 : 0,
              transition: "opacity 0.8s ease-out 0.5s",
            }}
          >
            Share your books with the community
          </p>
        </div>

        <BookIcon
          size={120}
          className="absolute -bottom-10 right-10 text-white/30"
          initialDelay={0}
        />
        <BookIcon
          size={80}
          className="absolute top-10 left-20 text-white/20"
          initialDelay={0.5}
        />
      </div>

      {/* Add Book Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <span className="text-lg font-medium text-gray-700">Add a book for lending</span>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Book
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsFormOpen(false)}
          />
          <div
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4 relative z-10 overflow-y-auto max-h-[90vh]"
            style={{
              animation: "modalFadeIn 0.3s ease-out forwards",
            }}
          >
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <div className="border-b border-gray-200 pb-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingBookId ? "Edit Book" : "Add New Book"}
              </h2>
            </div>

            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Book Name *
                </label>
                <input
                  type="text"
                  name="bookName"
                  value={formData.bookName}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter book name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Author *
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter author name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Book Photo
                </label>
                <input
                  type="file"
                  name="bookPhoto"
                  onChange={handleInputChange}
                  accept="image/*"
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Book Type *
                </label>
                <select
                  name="bookType"
                  value={formData.bookType}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a type</option>
                  <option value="mystery">Mystery</option>
                  <option value="romance">Romance</option>
                  <option value="fantasy">Fantasy</option>
                  <option value="sci-fi">Sci-Fi</option>
                  <option value="non-fiction">Non-Fiction</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Available Area *
                </label>
                <input
                  type="text"
                  name="availableArea"
                  value={formData.availableArea}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter available area (e.g., city, library)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Small Review *
                </label>
                <textarea
                  name="review"
                  value={formData.review}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                  rows="4"
                  placeholder="Write a brief review of the book"
                ></textarea>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition hover:scale-105 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition hover:scale-105 active:scale-95"
                >
                  {editingBookId ? "Update Book" : "Add Book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {isChatOpen && currentChatBook && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsChatOpen(false)}
          />
          <div
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 relative z-10 h-[70vh] flex flex-col"
            style={{
              animation: "modalFadeIn 0.3s ease-out forwards",
            }}
          >
            <button
              onClick={() => setIsChatOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <div className="border-b border-gray-200 pb-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                  <img
                    src={currentChatBook.borrower.avatar}
                    alt="Borrower"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{currentChatBook.borrower.name}</h3>
                  <p className="text-xs text-gray-500">
                    Borrowing: {currentChatBook.title}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto bg-gray-50 p-4 space-y-3">
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-lg shadow max-w-xs">
                  <p>Hi there! You have to return the book soon. How is the book?</p>
                  <p className="text-xs text-gray-500 mt-1">10:30 AM</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-blue-500 text-white p-3 rounded-lg shadow max-w-xs">
                  <p>Thanks for reminding. The book is amazing!</p>
                  <p className="text-xs text-blue-100 mt-1">10:32 AM</p>
                </div>
              </div>
            </div>

            <div className="p-3 border-t bg-white">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition hover:scale-105 active:scale-95"
                >
                  <MessageSquare className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approved and Waiting Sections */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Approved for Users */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-gray-800">
                Approved for Users ({approvedBooks.length})
              </h2>
              <PDFDownloadLink
                document={<ApprovedBooksReport books={approvedBooks} />}
                fileName="approved_books_report.pdf"
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition hover:scale-105 active:scale-95"
              >
                {({ loading }) => (
                  <>
                    <Download className="w-4 h-4 mr-1" />
                    {loading ? "Generating PDF..." : "Download PDF"}
                  </>
                )}
              </PDFDownloadLink>
            </div>
            {approvedBooks.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-7xl mb-4">📚</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No Approved Books</h3>
                <p className="text-gray-500">No books have been approved yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {approvedBooks.map((book, index) => (
                  <ApprovedBookCard
                    key={book.id}
                    book={book}
                    index={index}
                    onChat={() => toggleChat(book)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Waiting for Borrowers */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-medium text-gray-800 mb-4">
              Waiting for Borrowers ({waitingBooks.length})
            </h2>
            {waitingBooks.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-7xl mb-4">📚</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No Books Waiting</h3>
                <p className="text-gray-500">Add a book to start lending!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {waitingBooks.map((book, index) => (
                  <WaitingBookCard
                    key={book._id}
                    book={book}
                    index={index}
                    onDelete={() => handleDeleteBook(book._id)}
                    onEdit={() => handleEditBook(book)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Animation Components (reused from BorrowBookPage)
function BookIcon({ size, className, initialDelay }) {
  const [position, setPosition] = useState({ y: 0, rotation: 0 });

  useEffect(() => {
    let startTime;
    let animationFrameId;
    let delay = initialDelay * 1000;
    let startAnimation = false;

    const animate = (timestamp) => {
      if (!startAnimation) {
        if (!startTime) startTime = timestamp;
        if (timestamp - startTime >= delay) {
          startAnimation = true;
          startTime = timestamp;
        }
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      if (!startTime) startTime = timestamp;
      const runtime = timestamp - startTime;
      const relativeProgress = runtime / 4000;

      const progress = relativeProgress % 1;
      const y = Math.sin(progress * 2 * Math.PI) * 10;
      const rotation = Math.sin(progress * 2 * Math.PI) * 3;

      setPosition({ y, rotation });
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [initialDelay]);

  return (
    <div
      className={className}
      style={{
        transform: `translateY(${position.y}px) rotate(${position.rotation}deg)`,
        transition: "transform 0.1s ease-out",
      }}
    >
      <BookOpen size={size} />
    </div>
  );
}

function AnimatedBookIcon({ size }) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let animationFrameId;
    let startTime;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const runtime = timestamp - startTime;
      const relativeProgress = runtime / 2000;

      const progress = relativeProgress % 1;
      const angle = Math.sin(progress * 2 * Math.PI) * 5;

      setRotation(angle);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <BookOpen
      size={size}
      style={{
        transform: `rotate(${rotation}deg)`,
        transition: "transform 0.1s ease-out",
      }}
    />
  );
}

// Card Components
function ApprovedBookCard({ book, index, onChat }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100 + index * 100);

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className="flex flex-col h-full"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
      }}
    >
      <div className="bg-gray-50 rounded-lg p-4 flex flex-col md:flex-row gap-4 hover:shadow-md transition-shadow duration-300">
        <div className="flex-shrink-0">
          <img
            src={book.cover}
            alt={`${book.title} cover`}
            className="w-24 h-32 object-cover rounded shadow"
          />
        </div>
        <div className="flex-grow">
          <h3 className="font-bold text-gray-800">{book.title}</h3>
          <p className="text-sm text-gray-600 mb-2">By {book.author}</p>
          <p className="text-sm text-gray-700 mb-3 line-clamp-2">{book.description}</p>

          <div className="flex items-center gap-2 mb-2">
            <img
              src={book.borrower.avatar}
              alt={book.borrower.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-gray-700">{book.borrower.name}</span>
          </div>

          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Search className="w-4 h-4" />
              <span>{book.borrower.email}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onChat}
                className="flex items-center bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1.5 rounded-lg transition hover:scale-105 active:scale-95"
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                Message
              </button>
              <span
                className={`text-sm px-2 py-1 rounded ${
                  book.daysLeft <= 2
                    ? "bg-red-100 text-red-800"
                    : book.daysLeft <= 5
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {book.daysLeft} day{book.daysLeft !== 1 ? "s" : ""} left
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WaitingBookCard({ book, index, onDelete, onEdit }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100 + index * 100);

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className="flex flex-col h-full"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
      }}
    >
      <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <img
              src={book.imageUrl}
              alt={`${book.title} cover`}
              className="w-16 h-20 object-cover rounded"
            />
          </div>
          <div className="flex-grow">
            <h3 className="font-bold text-gray-800">{book.title}</h3>
            <p className="text-sm text-gray-600 mb-1">By {book.author}</p>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2 capitalize">
              {book.bookType}
            </span>
            <p className="text-sm text-gray-700 mb-3 line-clamp-2">{book.review}</p>

            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Area: {book.availableArea}</span>
              <div className="flex gap-2">
                <button
                  onClick={onDelete}
                  className="text-red-500 hover:text-red-700 text-sm flex items-center transition hover:scale-105 active:scale-95"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
                <button
                  onClick={onEdit}
                  className="text-blue-500 hover:text-blue-700 text-sm flex items-center transition hover:scale-105 active:scale-95"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookLendingPage;