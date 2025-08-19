'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/axiosConfig'; // 1. Use our new axios instance

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      // Set token on our new instance
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/me`);
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user data (token might be invalid), logging out.", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (newToken, silent = false) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    if (!silent) {
        setLoading(true);
    }
    fetchUserData();
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
    login,
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