// src/components/BookCard.js
import React from 'react';

const BookCard = ({ title, author, imageUrl }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
      <img src={imageUrl} alt={title} className="w-32 h-48 object-cover mb-4" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600">{author}</p>
    </div>
  );
};

export default BookCard;