'use client';

import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../utils/axiosConfig';
import { getMyData } from '@/services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      const userData = await getMyData();

      // --- NEW: Logic to check for new rewards ---
      if (userData.eligibleRewards) {
        const allRewardIds = userData.eligibleRewards.map(r => r.id).sort();
        const seenRewardIds = JSON.parse(localStorage.getItem('seenRewardIds') || '[]');
        const newRewardIds = allRewardIds.filter(id => !seenRewardIds.includes(id));

        if (newRewardIds.length > 0) {
            userData.newRewardsCount = newRewardIds.length;
        } else {
            userData.newRewardsCount = 0;
        }
      }
      // --- END NEW LOGIC ---

      setUser(userData);
    } catch (error) {
      console.error("AuthContext Error:", error.message);
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
        fetchUserData();
      } else {
        setLoading(false);
      }
    };
    initializeAuth();
  }, [fetchUserData]);

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
  
  const updateUserPoints = (newBalance) => {
    if (user) {
        setUser(prevUser => ({ ...prevUser, points: newBalance }));
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
    setUser // Exposing setUser for optimistic UI updates in later tasks
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