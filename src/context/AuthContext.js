'use client';

import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../utils/axiosConfig';
import { getMyData } from '@/services/authService'; // We only need getMyData here now

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      const userData = await getMyData();
      setUser(userData);
    } catch (error) {
      console.error("AuthContext Error:", error.message);
      // If fetching user data fails, the token is likely invalid.
      // We must log out to clear the bad state.
      logout();
    } finally {
      setLoading(false);
    }
  }, []); // useCallback with empty dependency array

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        fetchUserData();
      } else {
        setLoading(false);
      }
    };
    initializeAuth();
  }, [fetchUserData]);

  // OLD login function name, but with NEW internal logic
  const login = (newToken, silent = false) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    if (!silent) {
      setLoading(true); // Show loading state on explicit login
    }
    fetchUserData(); // Fetch user data with the new token
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };
  
  const value = {
    user,
    token,
    login, // This function name and signature has NOT changed
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}