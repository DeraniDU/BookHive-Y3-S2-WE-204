// src/components/HomePage.js
import React, { useRef, useEffect, useState } from "react";
import BookCard from "../../components/LBookCart";
import bookBackground from "../../photo/book1.jpg";
import bookBackground1 from "../../photo/book1.jpg";
import { FaBars } from "react-icons/fa";
import Navbar from "../../components/Header";
import { Link } from "react-router-dom";

const HomePage = () => {
  const popularBooks = [
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      imageUrl: "https://via.placeholder.com/128x192",
    },
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      imageUrl: "https://via.placeholder.com/128x192",
    },
    {
      title: "1984",
      author: "George Orwell",
      imageUrl: "https://via.placeholder.com/128x192",
    },
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      imageUrl: "https://via.placeholder.com/128x192",
    },
    {
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      imageUrl: "https://via.placeholder.com/128x192",
    },
    {
      title: "Brave New World",
      author: "Aldous Huxley",
      imageUrl: "https://via.placeholder.com/128x192",
    },
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      imageUrl: "https://via.placeholder.com/128x192",
    },
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      imageUrl: "https://via.placeholder.com/128x192",
    },
    {
      title: "1984",
      author: "George Orwell",
      imageUrl: "https://via.placeholder.com/128x192",
    },
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      imageUrl: "https://via.placeholder.com/128x192",
    },
    {
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      imageUrl: "https://via.placeholder.com/128x192",
    },
    {
      title: "Brave New World",
      author: "Aldous Huxley",
      imageUrl: "https://via.placeholder.com/128x192",
    },
  ];

  const scrollRef = useRef(null);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (scrollRef.current) {
        const scrollAmount = 300; // Adjust this value for scroll distance
        if (event.key === "ArrowRight") {
          scrollRef.current.scrollBy({
            left: scrollAmount,
            behavior: "smooth",
          });
        }
        if (event.key === "ArrowLeft") {
          scrollRef.current.scrollBy({
            left: -scrollAmount,
            behavior: "smooth",
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  const toggleNavbar = () => {
    setIsNavbarOpen((prev) => !prev); // Toggle state between true and false
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Menu Button */}
      <button
        className="fixed top-4 left-4 z-40 p-2 bg-gray-800 text-white rounded-md"
        onClick={toggleNavbar}
      >
        <FaBars size={24} />
      </button>

      {/* Navbar */}
      <Navbar isOpen={isNavbarOpen} toggleNavbar={toggleNavbar} />

      {/* Scrolling Content */}
      <main className="flex-grow pb-40">
        {/* Header Section */}
        <header
          className="relative h-[60vh] bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: `url(${bookBackground})` }}
        >
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="relative z-10 text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              We Are Here To Solve Your Book Sick
            </h1>
            <p className="text-xl md:text-2xl">
              Find your perfect reading solution
            </p>
          </div>
        </header>

        {/* Popular Books Section - Horizontal Scroll */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-semibold text-center mb-12">
              Most Popular Books
            </h2>
            <div
              ref={scrollRef}
              className="flex overflow-x-auto space-x-8 pb-4 snap-x snap-mandatory
                scrollbar-hide" // Custom class to hide scrollbar
              style={{ scrollBehavior: "smooth" }}
            >
              {popularBooks.map((book, index) => (
                <div key={index} className="flex-shrink-0 snap-start">
                  <BookCard
                    title={book.title}
                    author={book.author}
                    imageUrl={book.imageUrl}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to Borrow Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-center mb-12">
              How to Borrow a Book
            </h2>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  1
                </span>
                <div>
                  <h3 className="text-xl font-medium">Sign Up</h3>
                  <p className="text-gray-600">
                    Create an account with your email and password
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  2
                </span>
                <div>
                  <h3 className="text-xl font-medium">Browse Books</h3>
                  <p className="text-gray-600">
                    Explore our collection and find your next read
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  3
                </span>
                <div>
                  <h3 className="text-xl font-medium">Request to Borrow</h3>
                  <p className="text-gray-600">
                    Click borrow and wait for approval
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  4
                </span>
                <div>
                  <h3 className="text-xl font-medium">Enjoy Reading</h3>
                  <p className="text-gray-600">
                    Receive your book and start reading
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Fixed Footer Choice Section */}
      <footer
        className="fixed bottom-0 left-0 right-0 z-20 bg-cover bg-center py-4 px-4"
        style={{ backgroundImage: `url(${bookBackground1})` }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-8">
            What Would You Like To Do?
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <button className="bg-blue-600 text-white py-4 px-8 rounded-lg text-xl hover:bg-blue-700 transition duration-300">
              <Link to="/Lending2" className="button">
                Lend a Book{" "}
              </Link>
            </button>
            <button className="bg-green-600 text-white py-4 px-8 rounded-lg text-xl hover:bg-green-700 transition duration-300">
              <Link to="/Borrowing" className="button">
                {" "}
                Borrow a Book
              </Link>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
