// src/components/Navbar.js
import React from 'react';
import { FaHome, FaBook, FaUser, FaSignOutAlt } from 'react-icons/fa'; // Using react-icons for icons

const Navbar = ({ isOpen, toggleNavbar }) => {
  return (
    <>
      {/* Overlay for closing navbar when clicking outside on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden"
          onClick={toggleNavbar}
        ></div>
      )}

      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Navbar Header */}
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-2xl font-bold">Book Haven</h2>
          </div>

          {/* Menu Items */}
          <ul className="flex-1 p-4 space-y-4">
            <li className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded cursor-pointer">
              <FaHome size={20} />
              <span>Home</span>
            </li>
            <li className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded cursor-pointer">
              <FaBook size={20} />
              <span>Books</span>
            </li>
            <li className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded cursor-pointer">
              <FaUser size={20} />
              <span>Profile</span>
            </li>
          </ul>

          {/* Logout */}
          <div className="p-4 border-t border-gray-700">
            <button className="flex items-center gap-3 p-2 w-full hover:bg-gray-700 rounded">
              <FaSignOutAlt size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;