// api/index.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Book Listing API calls
export const getBookListings = () => api.get('/booklistings');
export const getBookListingById = (id) => api.get(`/booklistings/${id}`);
export const createBookListing = (bookData) => {
  // For text-only data
  if (!bookData.photos || bookData.photos.length === 0) {
    return api.post('/booklistings', bookData);
  }
  
  // For data with files
  const formData = new FormData();
  
  // Add text fields
  Object.keys(bookData).forEach(key => {
    if (key !== 'photos') {
      formData.append(key, bookData[key]);
    }
  });
  
  // Add photos if they exist
  if (bookData.photos && bookData.photos.length > 0) {
    Array.from(bookData.photos).forEach(file => {
      formData.append('photos', file);
    });
  }
  
  return axios.post(`${API_URL}/booklistings`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const updateBookListing = (id, bookData) => api.put(`/booklistings/${id}`, bookData);
export const deleteBookListing = (id) => api.delete(`/booklistings/${id}`);

// Bid API calls
export const getBids = () => api.get('/bids');
export const getBidById = (id) => api.get(`/bids/${id}`);
export const createBid = (bidData) => api.post('/bids', bidData);
export const updateBid = (id, bidData) => api.put(`/bids/${id}`, bidData);
export const deleteBid = (id) => api.delete(`/bids/${id}`);
export const placeBid = (id, bidData) => api.post(`/bids/${id}/place`, bidData);
export const getHighestBid = (id) => api.get(`/bids/${id}/highest`);
export const getBidsByBookListing = (bookListingId) => api.get(`/bids/book/${bookListingId}`);

// User Response API calls (if implemented)
export const getUserResponses = () => api.get('/responses');
export const getUserResponseById = (id) => api.get(`/responses/${id}`);
export const createUserResponse = (responseData) => api.post('/responses', responseData);
export const updateUserResponse = (id, responseData) => api.put(`/responses/${id}`, responseData);
export const deleteUserResponse = (id) => api.delete(`/responses/${id}`);
export const getUserResponsesByBid = (bidId) => api.get(`/responses/bid/${bidId}`);
export const getUserResponsesByBookListing = (bookListingId) => api.get(`/responses/book/${bookListingId}`);

export default api;