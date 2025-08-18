'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On initial app load, check localStorage for a saved token
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      // If a token is found, set it in our state and on all future axios requests
      setToken(storedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      // Now, fetch the user's data with this token
      fetchUserData();
    } else {
      // If no token is found, we're done loading and know the user is not authenticated
      setLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      // Fetch the user's profile data from our custom /me endpoint
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/me`);
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user data (token might be invalid), logging out.", error);
      // If the token is expired or invalid, the API call will fail. We should log the user out.
      logout();
    } finally {
      // No matter what, we're done with the initial loading process
      setLoading(false);
    }
  };

  const login = (newToken) => {
    // This function is called by LoginForm and RegisterForm after a successful login
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setLoading(true); // Set loading while we fetch the new user data
    fetchUserData();
  };
  
  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };
  
  // This is the object that all components will have access to when they use our hook
  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user, // A handy boolean: true if the user object is not null
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// This is the custom hook that our components will use to access the context
export function useAuth() {
  return useContext(AuthContext);
}