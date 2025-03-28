import React, { useState } from 'react';

function BookLendingPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
          <img 
            src="https://via.placeholder.com/40" 
            alt="Book Icon" 
            className="w-10 h-10 mr-3"
          />
          <h1 className="text-xl font-semibold text-gray-800">Book Lending</h1>
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
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4v16m8-8H4" 
              />
            </svg>
            Add
          </button>
        </div>
      </div>

      {/* Form Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Blurred Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center filter blur-sm"
            style={{
              backgroundImage: 'url(https://via.placeholder.com/1920x1080?text=Book+Background)',
            }}
          ></div>
          {/* Overlay to darken background */}
          <div className="absolute inset-0 bg-black opacity-50"></div>

          {/* Form */}
          <div className="relative w-3/4 max-h-[90vh] bg-white rounded-lg shadow-xl p-6 overflow-y-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Book</h2>
            <form className="space-y-4">
              {/* Book Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Book Name</label>
                <input 
                  type="text" 
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter book name"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Author</label>
                <input 
                  type="text" 
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter author name"
                />
              </div>

              {/* Book Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Book Photo</label>
                <input 
                  type="file" 
                  accept="image/*"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Book Type Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Book Type</label>
                <select 
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
                <label className="block text-sm font-medium text-gray-700">Available Area</label>
                <input 
                  type="text" 
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter available area (e.g., city, library)"
                />
              </div>

              {/* Small Review */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Small Review</label>
                <textarea 
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

      {/* Approved and Waiting Sections */}
      <div className="max-w-7xl mx-auto px-4 pb-6 flex flex-col md:flex-row gap-6">
        {/* Approved for Users */}
        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-sm min-h-[50vh]">
          <h2 className="text-xl font-medium text-gray-800 mb-4">Approved for Users</h2>
          <div className="h-[calc(50vh-4rem)] overflow-y-auto">
            {/* ... Previous Approved for Users content ... */}
          </div>
        </div>

        {/* Waiting for Borrowers */}
        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-sm min-h-[50vh]">
          <h2 className="text-xl font-medium text-gray-800 mb-4">Waiting for Borrowers</h2>
          <div className="h-[calc(50vh-4rem)] overflow-y-auto">
            {/* ... Previous Waiting for Borrowers content ... */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookLendingPage;