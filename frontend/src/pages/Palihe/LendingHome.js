import React, { useState, useEffect } from "react";
import { BookOpen, Search, ChevronRight, ArrowLeft, X } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

function BorrowBookPage() {
  const [books, setBooks] = useState([]);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    "all",
    "mystery",
    "romance",
    "fantasy",
    "sci-fi",
    "non-fiction",
  ];

  // Fetch books from backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:3000/api/Lendbook");
        setBooks(response.data.books);
      } catch (error) {
        console.error("Failed to fetch books:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch books. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleBorrowClick = (book) => {
    setSelectedBook(book);
    setShowBorrowModal(true);
  };

  const handleCloseModal = () => {
    setShowBorrowModal(false);
    setSelectedBook(null);
  };

  const handleProceed = async () => {
    const userId = localStorage.getItem("firebaseUserId");
    const email = localStorage.getItem("email");

    if (!userId) {
      Swal.fire({
        icon: "error",
        title: "Not Logged In",
        text: "Please sign in to borrow a book!",
        showConfirmButton: true,
        confirmButtonText: "Sign In",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/signin";
        }
      });
      return;
    }

    if (!selectedBook.userId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "This book is missing lender information!",
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/borrow", {
        borrowerId: userId,
        borrowerEmail: email,
        bookId: selectedBook.id,
        lenderId: selectedBook.userId,
        title: selectedBook.title,
        author: selectedBook.author,
        cover: selectedBook.imageUrl,
        description: selectedBook.description,
        daysLeft: 14,
      });

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Borrowing request for "${selectedBook.title}" has been sent!`,
      });

      setBooks((prevBooks) =>
        prevBooks.filter((book) => book._id !== selectedBook._id)
      );

      setShowBorrowModal(false);
      setSelectedBook(null);
    } catch (error) {
      console.error("Failed to borrow book:", error.response?.data || error.message);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to process borrow request. Please try again.",
      });
    }
  };

  const filteredBooks = books
    .filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(
      (book) => selectedCategory === "all" || book.bookType === selectedCategory
    )
    .sort((a, b) => {
      if (sortOrder === "a-z") return a.title.localeCompare(b.title);
      if (sortOrder === "z-a") return b.title.localeCompare(a.title);
      return 0;
    });

  const [headerAnimated, setHeaderAnimated] = useState(false);
  useEffect(() => {
    setHeaderAnimated(true);
  }, []);

  const navigateToLending = () => {
    window.location.href = "/lending2";
  };

  return (
      
    <div className="min-h-screen bg-slate-50">
      {/* Animated Header with Navigation */}
      <div
        className="relative h-64 bg-gradient-to-r from-blue-700 to-purple-800 flex items-center justify-center overflow-hidden"
        style={{
          opacity: headerAnimated ? 1 : 0,
          transition: "opacity 1s ease-in-out",
        }}
      >
        <div className="absolute top-0 left-4 z-20 w-2/6 min-w-[200px] h-36 flex items-center">
          <button
            className="flex items-center justify-between gap-2 w-full h-full px-4 py-3 bg-white/20 backdrop-blur-sm text-white rounded-b-lg hover:bg-white/30 transition-colors animate-pulse-slow"
            onClick={navigateToLending}
          >
            <div className="flex items-center gap-2">
              <ArrowLeft size={16} />
              <span className="text-lg font-medium">Lending Page</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-l italic text-white/80">
                Books were made to be shared, not shelved.
              </span>
              <AnimatedBookIcon size={40} />
            </div>
          </button>
        </div>

        <div
          className="relative z-10 text-center text-white px-4"
          style={{
            transform: headerAnimated ? "translateY(0)" : "translateY(30px)",
            opacity: headerAnimated ? 1 : 0,
            transition: "transform 0.8s ease-out, opacity 0.8s ease-out",
          }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-2">Borrowing</h1>
          <p
            className="text-xl text-white/80 max-w-2xl mx-auto"
            style={{
              opacity: headerAnimated ? 1 : 0,
              transition: "opacity 0.8s ease-out 0.5s",
            }}
          >
            Discover and borrow amazing books from our community
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

      {/* Search and Filter Bar */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search books by title or author..."
                className="w-full p-3 pl-12 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Sort:</span>
              <select
                className="border rounded-md p-2 text-sm"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="default">Default</option>
                <option value="a-z">A-Z</option>
                <option value="z-a">Z-A</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-1.5 rounded-full text-sm capitalize transition-all hover:scale-105 active:scale-95 ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Book Listings */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-7xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Books Found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book, index) => (
              <BookCard
                key={book.id}
                book={book}
                index={index}
                onClick={() => handleBorrowClick(book)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Borrow Confirmation Modal */}
      {showBorrowModal && selectedBook && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={handleCloseModal}
          />
          <div
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 relative z-10"
            style={{
              animation: "modalFadeIn 0.3s ease-out forwards",
            }}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <div className="border-b border-gray-200 pb-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Borrow {selectedBook.title}
              </h2>
            </div>

            <div className="mb-6">
              <div className="flex justify-center mb-6">
                <img
                  src={selectedBook.imageUrl}
                  alt={`${selectedBook.title} cover`}
                  className="h-48 object-contain rounded-md shadow-md"
                />
              </div>

              <div>
                <p className="text-gray-600 mb-4">
                  Delivery charges for deliver and receive will apply.
                </p>
                <p className="text-gray-600 mb-2">
                  Late fees will be applied if the book is not returned on time.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg my-4">
                  <h3 className="font-medium text-blue-800 mb-2">Borrowing Terms:</h3>
                  <ul className="space-y-2 text-blue-800">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                      Delivery charge: $2.50
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                      Late fee: $1.00 per day
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                      Maximum borrowing period: 14 days
                    </li>
                  </ul>
                </div>

                <p className="font-medium text-gray-800 mt-4">
                  Do you wish to proceed with borrowing this book?
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition hover:scale-105 active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleProceed}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition hover:scale-105 active:scale-95"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
      const relativeProgress = runtime / 2000; // 2-second cycle

      const progress = relativeProgress % 1;
      // Wiggle effect: rotate between -5 and 5 degrees
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

function Spinner() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let animationFrameId;

    const animate = () => {
      setRotation((prevRotation) => (prevRotation + 5) % 360);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"
      style={{ transform: `rotate(${rotation}deg)` }}
    />
  );
}

function BookCard({ book, index, onClick }) {
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
      <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-full border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <div className="relative p-4 flex justify-center">
          <div className="w-40 h-56 overflow-hidden rounded-lg shadow-md">
            <img
              src={book.imageUrl}
              alt={`${book.title} cover`}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="absolute -right-1 -top-1 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full capitalize">
            {book.bookType || "Book"}
          </div>
        </div>

        <div className="p-4 flex-grow">
          <h2 className="text-xl font-bold text-gray-800 mb-1.5 line-clamp-2">
            {book.title}
          </h2>
          <p className="text-md text-gray-600 mb-2">By: {book.author}</p>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {book.review || book.description}
          </p>
        </div>

        <div className="p-4 pt-0">
          <button
            onClick={onClick}
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg transition-colors hover:scale-102 active:scale-98"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Borrow
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default BorrowBookPage;