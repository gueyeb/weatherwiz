// src/context/SettingsContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create context
const SettingsContext = createContext();

// Storage key
const SETTINGS_STORAGE_KEY = '@weatherwiz_settings';

// Default settings
const defaultSettings = {
  temperatureUnit: 'celsius', // 'celsius' or 'fahrenheit'
  windSpeedUnit: 'kph',       // 'kph', 'mph', or 'ms'
  timeFormat: '12h',          // '12h' or '24h'
  notificationsEnabled: true,
  alertNotifications: true,
  theme: 'auto',              // 'light', 'dark', or 'auto'
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load saved settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  // Update settings
  const updateSettings = (newSettings) => {
    setSettings((prevSettings) => {
      const updatedSettings = { ...prevSettings, ...newSettings };
      AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
      return updatedSettings;
    });
  };
  
  // Reset settings to defaults
  const resetSettings = () => {
    setSettings(defaultSettings);
    AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultSettings));
  };
  
  const value = {
    settings,
    isLoading,
    updateSettings,
    resetSettings,
  };
  
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// Hook for using settings context
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};