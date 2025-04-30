// src/services/authService.js

/**
 * Sets the Firebase ID token in storage
 * @param {string} token - Firebase ID token (JWT)
 */
export const setAuthToken = (token) => {
    // For development, we'll use localStorage
    // In production, replace with httpOnly cookies
    localStorage.setItem("firebaseToken", token);
  };
  
  /**
   * Retrieves the stored Firebase ID token
   * @returns {string|null} The token if exists
   */
  export const getAuthToken = () => {
    return localStorage.getItem("firebaseToken");
  };
  
  /**
   * Clears all auth-related storage
   */
  export const clearAuthToken = () => {
    localStorage.removeItem("firebaseToken");
    localStorage.removeItem("isLogged"); // Your existing flag
  };
  
  /**
   * Generates headers for authenticated API requests
   * @returns {Object} Headers object with Authorization if token exists
   */
  export const authHeader = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };
  
  /**
   * Checks if token exists and is valid (basic client-side check)
   * @returns {boolean} True if token exists
   */
  export const isAuthenticated = () => {
    return !!getAuthToken();
  };
  
  /**
   * Refreshes the Firebase ID token
   * @returns {Promise<string>} New token
   */
  export const refreshToken = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      
      const token = await user.getIdToken(true); // Force refresh
      setAuthToken(token);
      return token;
    } catch (error) {
      console.error("Token refresh failed:", error);
      clearAuthToken();
      throw error;
    }
  };