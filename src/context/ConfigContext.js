'use client';

import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import { getAppConfig } from '../services/ConfigService';
import { useAuth } from './AuthContext';

const ConfigContext = createContext();

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchConfigData = useCallback(async () => {
    // Only fetch if the user is authenticated and we don't have config yet.
    if (isAuthenticated && !config) {
      setLoading(true);
      try {
        const configData = await getAppConfig();
        setConfig(configData);
      } catch (error) {
        console.error('ConfigContext Error:', error.message);
        // Handle error, maybe show a global error message
      } finally {
        setLoading(false);
      }
    } else if (!isAuthenticated) {
      // If user logs out, clear the config
      setConfig(null);
      setLoading(false);
    }
  }, [isAuthenticated, config]);

  useEffect(() => {
    fetchConfigData();
  }, [fetchConfigData]);

  const value = {
    config,
    loading,
    // Exposing all_ranks and all_achievements for easier access in components
    allRanks: config?.all_ranks || {},
    allAchievements: config?.all_achievements || {},
    settings: config?.settings || {},
  };

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
}

export function useConfig() {
  return useContext(ConfigContext);
}
