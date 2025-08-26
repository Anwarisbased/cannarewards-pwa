'use client';

import { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react'; // Import useRef
import api from '../utils/axiosConfig';
import { getMyData } from '@/services/authService';
import { showAchievementToast } from '@/components/AchievementUnlockedToast'; // Import the toast helper

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const previousUnlockedAchievementsRef = useRef([]); // Use useRef to store previous achievements

  const fetchUserData = useCallback(async () => {
    try {
      const userData = await getMyData();

      // Compare achievements before updating user state
      const currentUnlocked = userData.unlockedAchievementKeys || [];
      const oldUnlocked = previousUnlockedAchievementsRef.current;

      // Find newly unlocked achievements
      const newlyUnlockedKeys = currentUnlocked.filter(key => !oldUnlocked.includes(key));

      // Update the ref for the next comparison
      previousUnlockedAchievementsRef.current = currentUnlocked;

      setUser(userData); // Update user state

      // If there are newly unlocked achievements, show toasts
      if (newlyUnlockedKeys.length > 0 && userData.allAchievements) {
        newlyUnlockedKeys.forEach(key => {
          const unlockedAchievement = userData.allAchievements.find(ach => ach.achievement_key === key);
          if (unlockedAchievement) {
            showAchievementToast(unlockedAchievement);
          }
        });
      }

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
    previousUnlockedAchievementsRef.current = []; // Clear achievements on logout
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