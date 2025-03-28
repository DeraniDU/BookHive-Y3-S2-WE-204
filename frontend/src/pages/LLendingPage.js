import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import bookBackground from '../photo/book1.jpg';
import Swal from 'sweetalert2';

// Import sample book covers
import book1 from '../photo/book1.jpg';
import book2 from '../photo/book2.jpg';
import book3 from '../photo/book3.jpeg';
import book4 from '../photo/book4.jpeg';
import book5 from '../photo/book5.jpeg';

function BookLendingPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    bookName: '',
    author: '',
    bookType: '',
    availableArea: '',
    review: '',
    bookPhoto: null
  });

  // Dummy data for approved books
  const approvedBooks = [
    {
      id: 1,
      title: "The Silent Patient",
      author: "Alex Michaelides",
      cover: book1,
      borrower: {
        name: "Sarah Johnson",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        address: "123 Library St, Colombo"
      },
      daysLeft: 3,
      description: "A psychological thriller about a woman who shoots her husband and then stops speaking."
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      cover: book2,
      borrower: {
        name: "David Wilson",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        address: "456 Book Ave, Kandy"
      },
      daysLeft: 5,
      description: "An easy way to build good habits and break bad ones."
    }
  ];

  // Dummy data for waiting books
  const waitingBooks = [
    {
      id: 3,
      title: "Educated",
      author: "Tara Westover",
      cover: book3,
      category: "Memoir",
      description: "A memoir about a woman who grew up in a survivalist family in Idaho and went on to earn a PhD from Cambridge University.",
      updated: "2023-05-15"
    },
    {
      id: 4,
      title: "Project Hail Mary",
      author: "Andy Weir",
      cover: book4,
      category: "Science Fiction",
      description: "A lone astronaut must save the earth from disaster in this science fiction adventure.",
      updated: "2023-05-10"
    },
    {
      id: 5,
      title: "The Midnight Library",
      author: "Matt Haig",
      cover: book5,
      category: "Fiction",
      description: "A library between life and death that lets you try out different lives you might have lived.",
      updated: "2023-05-05"
    }
  ];

  const toggleChat = (book) => {
    setCurrentChatBook(book);
    setIsChatOpen(!isChatOpen);
  };

  const [currentChatBook, setCurrentChatBook] = useState(null);

  const handleSendMessage = () => {
    console.log('Message sent:', message);
    setMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
   // Validate form fields
   if (!formData.bookName.trim()) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Please enter the book name!',
    });
    return;
  }

  if (!formData.author.trim()) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Please enter the author name!',
    });
    return;
  }

  if (!formData.bookType) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Please select a book type!',
    });
    return;
  }

  if (!formData.availableArea.trim()) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Please enter the available area!',
    });
    return;
  }

  if (!formData.review.trim()) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Please write a brief review!',
    });
    return;
  }

  // If validation passes
  Swal.fire({
    title: 'Are you sure?',
    text: "You want to add this book for lending?",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, add it!'
  }).then((result) => {
    if (result.isConfirmed) {
      // Here you would typically send the data to your backend
      console.log('Form submitted:', formData);
      
      Swal.fire(
        'Added!',
        'Your book has been added for lending.',
        'success'
      );
      
      // Reset form and close
      setFormData({
        bookName: '',
        author: '',
        bookType: '',
        availableArea: '',
        review: '',
        bookPhoto: null
      });
      setIsFormOpen(false);
    }
  });
};

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header 
        className="relative h-[20vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${bookBackground})` }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Book Lending</h1>
        </div>
      </header>

      {/* Add Book Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
          <span className="text-lg text-gray-700">Add a book for lending</span>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add
          </button>
        </div>
      </div>

      {/* Form Overlay - remains the same */}
     {/* Form Overlay */}
     {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div 
            className="absolute inset-0 bg-cover bg-center filter blur-sm"
            style={{
              backgroundImage: 'url(https://via.placeholder.com/1920x1080?text=Book+Background)',
            }}
          ></div>
          <div className="absolute inset-0 bg-black opacity-50"></div>

          <div className="relative w-3/4 max-h-[90vh] bg-white rounded-lg shadow-xl p-6 overflow-y-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Book</h2>
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              {/* Book Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Book Name *</label>
                <input 
                  type="text" 
                  name="bookName"
                  value={formData.bookName}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter book name"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Author *</label>
                <input 
                  type="text" 
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter author name"
                />
              </div>

              {/* Book Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Book Photo</label>
                <input 
                  type="file" 
                  name="bookPhoto"
                  onChange={handleInputChange}
                  accept="image/*"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Book Type Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Book Type *</label>
                <select 
                  name="bookType"
                  value={formData.bookType}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a type</option>
                  <option value="mystery">Mystery</option>
                  <option value="romance">Romance</option>
                  <option value="fantasy">Fantasy</option>
                  <option value="sci-fi">Sci-Fi</option>
                  <option value="non-fiction">Non-Fiction</option>
                </select>
              </div>

              {/* Available Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Available Area *</label>
                <input 
                  type="text" 
                  name="availableArea"
                  value={formData.availableArea}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter available area (e.g., city, library)"
                />
              </div>

              {/* Small Review */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Small Review *</label>
                <textarea 
                  name="review"
                  value={formData.review}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y"
                  rows="4"
                  placeholder="Write a brief review of the book"
                ></textarea>
              </div>

              {/* Submit and Cancel Buttons */}
              <div className="flex justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Add Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {isChatOpen && currentChatBook && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsChatOpen(false)}></div>
          <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b relative">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                    <img 
                      src={currentChatBook.borrower.avatar} 
                      alt="Borrower" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{currentChatBook.borrower.name}</h3>
                    <p className="text-xs text-gray-500">Borrowing: {currentChatBook.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-1"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
                <div className="space-y-3">
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
              </div>

              <div className="p-3 border-t bg-white">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Approved and Waiting Sections */}
      <div className="max-w-7xl mx-auto px-4 pb-6 flex flex-col md:flex-row gap-6">
        {/* Approved for Users */}
        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-medium text-gray-800 mb-4">Approved for Users ({approvedBooks.length})</h2>
          <div className="space-y-4">
            {approvedBooks.map(book => (
              <div key={book.id} className="bg-gray-50 rounded-lg p-4 flex flex-col md:flex-row gap-4">
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
                    <span className="text-sm">{book.borrower.name}</span>
                  </div>
                  
                  <div className="flex flex-wrap justify-between items-center">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{book.borrower.address}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => toggleChat(book)}
                        className="flex items-center bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5v-2l3-3 4 4 7-7" />
                        </svg>
                        Message
                      </button>
                      <span className={`text-sm px-2 py-1 rounded ${
                        book.daysLeft <= 2 ? 'bg-red-100 text-red-800' : 
                        book.daysLeft <= 5 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {book.daysLeft} day{book.daysLeft !== 1 ? 's' : ''} left
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Waiting for Borrowers */}
        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-medium text-gray-800 mb-4">Waiting for Borrowers ({waitingBooks.length})</h2>
          <div className="grid grid-cols-1 gap-4">
            {waitingBooks.map(book => (
              <div key={book.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <img 
                      src={book.cover} 
                      alt={`${book.title} cover`} 
                      className="w-16 h-20 object-cover rounded"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-gray-800">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">By {book.author}</p>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2 capitalize">
                      {book.category}
                    </span>
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">{book.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Updated: {new Date(book.updated).toLocaleDateString()}</span>
                      <div className="flex gap-2">
                        <button className="text-red-500 hover:text-red-700 text-sm flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                        <button className="text-blue-500 hover:text-blue-700 text-sm flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookLendingPage;