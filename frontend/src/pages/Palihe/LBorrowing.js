import React, { useState } from "react";
import bookBackground from "../../photo/book1.jpg";
import book1 from "../../photo/book3.jpeg";
import book2 from "../../photo/book3.jpeg";
import book3 from "../../photo/book3.jpeg";
import book4 from "../../photo/book3.jpeg";
import book5 from "../../photo/book3.jpeg";
import Navbar from "../../components/Header";

function BorrowBookPage() {
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    "all",
    "fiction",
    "non-fiction",
    "biography",
    "science",
    "history",
    "children",
  ];

  // Sample book data with cover images from your photo folder
  const books = [
    {
      id: 1,
      title: "The Journey of Nimal and Kamal",
      author: "Author Name",
      category: "fiction",
      cover: book1,
      description: "This book is based on a true story of Nimal and Kamal",
    },
    {
      id: 2,
      title: "Science Fundamentals",
      author: "Dr. Researcher",
      category: "science",
      cover: book2,
      description: "Comprehensive guide to basic scientific principles",
    },
    {
      id: 3,
      title: "Historical Events",
      author: "Professor History",
      category: "history",
      cover: book3,
      description: "Key moments that shaped our world",
    },
    {
      id: 4,
      title: "My Life Story",
      author: "Famous Person",
      category: "biography",
      cover: book4,
      description: "Autobiography of a remarkable life journey",
    },
    {
      id: 5,
      title: "Children's Adventure",
      author: "Story Teller",
      category: "children",
      cover: book5,
      description: "Magical tales for young readers",
    },
  ];

  const handleBorrowClick = (book) => {
    setSelectedBook(book);
    setShowBorrowModal(true);
  };

  const handleCloseModal = () => {
    setShowBorrowModal(false);
    setSelectedBook(null);
  };

  const handleProceed = () => {
    alert(`Borrowing process initiated for: ${selectedBook.title}`);
    setShowBorrowModal(false);
    setSelectedBook(null);
  };

  // Filter and sort books
  const filteredBooks = books
    .filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(
      (book) => selectedCategory === "all" || book.category === selectedCategory
    )
    .sort((a, b) => {
      if (sortOrder === "a-z") return a.title.localeCompare(b.title);
      if (sortOrder === "z-a") return b.title.localeCompare(a.title);
      return 0; // default order
    });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with picture */}
      <header
        className="relative h-[20vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${bookBackground})` }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Borrowing</h1>
        </div>
      </header>

      {/* Search and Filter Bar */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search books by title or author..."
                className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Alphabetical Sort */}
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

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm capitalize ${
                    selectedCategory === category
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div key={book.id} className="flex flex-col h-full">
              <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
                {/* Cart icon (top right) */}
                <div className="flex justify-end p-3">
                  <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      1
                    </span>
                  </div>
                </div>

                {/* Book cover - Fixed size container */}
                <div className="flex justify-center px-4">
                  <div className="w-48 h-64 overflow-hidden rounded shadow-md">
                    <img
                      src={book.cover}
                      alt={`${book.title} cover`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Book info - Fixed height container */}
                <div className="p-4 flex-grow">
                  <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {book.title}
                  </h2>

                  <p className="text-md text-gray-600 mb-2">
                    By: {book.author}
                  </p>

                  <p className="text-sm text-gray-500 italic mb-3 capitalize">
                    {book.category}
                  </p>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {book.description}
                  </p>
                </div>

                {/* Borrow button - Fixed at bottom */}
                <div className="p-4">
                  <button
                    onClick={() => handleBorrowClick(book)}
                    className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    Borrow
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Borrow Confirmation Modal */}
      {showBorrowModal && selectedBook && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            {/* Modal Header */}
            <div className="border-b pb-3 mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Borrow {selectedBook.title}
              </h2>
            </div>

            {/* Modal Content */}
            <div className="mb-6">
              <div className="flex justify-center mb-4">
                <img
                  src={selectedBook.cover}
                  alt={`${selectedBook.title} cover`}
                  className="h-40 object-contain"
                />
              </div>
              <p className="text-gray-600 mb-4">
                Delivery charges for deliver and receive will apply.
              </p>
              <p className="text-gray-600 mb-2">
                Late fees will be applied if the book is not returned on time.
              </p>
              <ul className="list-disc pl-5 text-gray-600 mb-4">
                <li>Delivery charge: $2.50</li>
                <li>Late fee: $1.00 per day</li>
                <li>Maximum borrowing period: 14 days</li>
              </ul>
              <p className="font-medium text-gray-800">
                Do you wish to proceed with borrowing this book?
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleProceed}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
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

export default BorrowBookPage;
