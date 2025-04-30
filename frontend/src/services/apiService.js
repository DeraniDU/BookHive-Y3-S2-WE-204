// src/services/apiService.js
import { authHeader } from './authService';

export const fetchProtectedData = async () => {
  const response = await fetch('/api/protected-route', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader()
    }
  });
  
  if (!response.ok) throw new Error('Request failed');
  return await response.json();
};