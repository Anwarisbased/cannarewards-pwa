'use client';

import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import api from '../utils/axiosConfig';
import { getUserSession } from '@/services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserSession = useCallback(async () => {
    try {
      const userData = await getUserSession();
      setUser(userData);
    } catch (error) {
      console.error('AuthContext Error:', error.message);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        fetchUserSession();
      } else {
        setLoading(false);
      }
    };
    initializeAuth();
  }, [fetchUserSession]);

  const login = (newToken, silent = false) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    if (!silent) {
      setLoading(true);
    }
    fetchUserSession();
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const updateUserPoints = (newBalance) => {
    if (user) {
      setUser((prevUser) => ({ ...prevUser, points_balance: newBalance }));
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
    updateUserPoints,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
