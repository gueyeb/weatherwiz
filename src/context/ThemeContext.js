// src/context/ThemeContext.js
// App theming and appearance context

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../constants/theme';

// Create context
const ThemeContext = createContext();

// Storage key
const THEME_STORAGE_KEY = '@weatherwiz_theme';

export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('auto'); // 'light', 'dark', or 'auto'
  
  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          setThemeMode(savedTheme);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };
    
    loadTheme();
  }, []);
  
  // Determine active theme based on mode
  const getActiveTheme = () => {
    if (themeMode === 'auto') {
      return deviceTheme || 'light';
    }
    return themeMode;
  };
  
  // Current active theme
  const activeTheme = getActiveTheme();
  
  // Toggle theme mode
  const toggleTheme = () => {
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    setThemeMode(newTheme);
    AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };
  
  // Set specific theme mode
  const setTheme = (mode) => {
    setThemeMode(mode);
    AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
  };
  
  // Colors based on active theme
  const colors = {
    ...theme.COLORS,
    background: theme.COLORS.background[activeTheme],
    card: theme.COLORS.card[activeTheme],
    text: theme.COLORS.text[activeTheme],
  };
  
  // Shadows based on active theme
  const shadows = theme.SHADOWS[activeTheme];
  
  const value = {
    theme: activeTheme,
    colors,
    fonts: theme.FONTS,
    sizes: theme.SIZES,
    shadows,
    toggleTheme,
    setTheme,
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook for using theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
