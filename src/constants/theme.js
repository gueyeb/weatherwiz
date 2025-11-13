// src/constants/theme.js
// UI theme definitions

import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Base color palette
export const COLORS = {
  // Primary colors
  primary: '#375DB0',      // Stormy blue
  secondary: '#FFD740',    // Electric yellow
  tertiary: '#50D0EC',     // Sky blue
  
  // Weather condition colors
  clear: {
    day: ['#4A90E2', '#87CEEB'],
    night: ['#172755', '#344C7A']
  },
  cloudy: {
    day: ['#B0C4DE', '#D3D3D3'],
    night: ['#2F4F4F', '#4F6367']
  },
  rain: {
    day: ['#708090', '#A9A9A9'],
    night: ['#1C2331', '#2C3E50']
  },
  thunderstorm: {
    day: ['#483D8B', '#6A5ACD'],
    night: ['#191970', '#2B2D42']
  },
  snow: {
    day: ['#E0FFFF', '#F0F8FF'],
    night: ['#B0C4DE', '#5D8AA8']
  },
  mist: {
    day: ['#E6E6FA', '#B0C4DE'],
    night: ['#708090', '#7B8B9E']
  },
  
  // UI colors
  background: {
    light: '#F9FAFC',
    dark: '#121212'
  },
  card: {
    light: '#FFFFFF',
    dark: '#1E1E1E'
  },
  text: {
    light: {
      primary: '#333333',
      secondary: '#666666',
      tertiary: '#999999'
    },
    dark: {
      primary: '#F5F5F5',
      secondary: '#B0B0B0',
      tertiary: '#808080'
    }
  },
  
  // Semantic colors
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#FF5252',
  info: '#2196F3',
  
  // Alert levels (customized to wizard theme)
  alertLevels: {
    minor: '#FFD740',    // Yellow
    moderate: '#FF9800', // Orange
    severe: '#FF5252',   // Red
    extreme: '#7B1FA2'   // Purple (extreme magical energy)
  }
};

// Typography
export const FONTS = {
  // Space Grotesk for headings
  heading: {
    light: 'SpaceGrotesk-Light',
    regular: 'SpaceGrotesk-Regular',
    medium: 'SpaceGrotesk-Medium',
    semiBold: 'SpaceGrotesk-SemiBold',
    bold: 'SpaceGrotesk-Bold',
  },
  // Inter for body text
  body: {
    light: 'Inter-Light',
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  }
};

// Font sizes
export const SIZES = {
  // Font sizes
  xxxs: 10,
  xxs: 12,
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
  xxl: 30,
  xxxl: 36,
  display: 48,
  
  // Standard spacing
  baseSpace: 8,
  
  // Derived spacing
  padding: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  
  margin: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  
  // Border radius
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    circle: 999
  },
  
  // Device dimensions
  width,
  height
};

// Shadows
export const SHADOWS = {
  light: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8
    }
  },
  dark: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.25,
      shadowRadius: 1.0,
      elevation: 1
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.30,
      shadowRadius: 2.5,
      elevation: 3
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 5.0,
      elevation: 8
    }
  }
};

// Animation timing constants
export const ANIMATION = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500
  },
  easing: {
    // Define custom easing functions here if needed
  }
};

// Weather condition mappings to icons and backgrounds
export const WEATHER_MAPPINGS = {
  // Clear
  '01d': {
    icon: 'clear-day',
    background: COLORS.clear.day
  },
  '01n': {
    icon: 'clear-night',
    background: COLORS.clear.night
  },
  
  // Few clouds
  '02d': {
    icon: 'partly-cloudy-day',
    background: COLORS.cloudy.day
  },
  '02n': {
    icon: 'partly-cloudy-night',
    background: COLORS.cloudy.night
  },
  
  // Scattered clouds
  '03d': {
    icon: 'cloudy',
    background: COLORS.cloudy.day
  },
  '03n': {
    icon: 'cloudy',
    background: COLORS.cloudy.night
  },
  
  // Broken clouds
  '04d': {
    icon: 'cloudy',
    background: COLORS.cloudy.day
  },
  '04n': {
    icon: 'cloudy',
    background: COLORS.cloudy.night
  },
  
  // Shower rain
  '09d': {
    icon: 'rain',
    background: COLORS.rain.day
  },
  '09n': {
    icon: 'rain',
    background: COLORS.rain.night
  },
  
  // Rain
  '10d': {
    icon: 'rain',
    background: COLORS.rain.day
  },
  '10n': {
    icon: 'rain',
    background: COLORS.rain.night
  },
  
  // Thunderstorm
  '11d': {
    icon: 'thunderstorm',
    background: COLORS.thunderstorm.day
  },
  '11n': {
    icon: 'thunderstorm',
    background: COLORS.thunderstorm.night
  },
  
  // Snow
  '13d': {
    icon: 'snow',
    background: COLORS.snow.day
  },
  '13n': {
    icon: 'snow',
    background: COLORS.snow.night
  },
  
  // Mist
  '50d': {
    icon: 'fog',
    background: COLORS.mist.day
  },
  '50n': {
    icon: 'fog',
    background: COLORS.mist.night
  }
};

// Time-based color themes
export const TIME_THEMES = {
  dawn: ['#F67280', '#C06C84'],           // 5:00 - 7:00
  morning: ['#6C5B7B', '#355C7D'],        // 7:00 - 11:00
  day: ['#4A90E2', '#87CEEB'],            // 11:00 - 16:00
  afternoon: ['#F8B195', '#F67280'],      // 16:00 - 19:00
  dusk: ['#C06C84', '#6C5B7B'],           // 19:00 - 21:00
  night: ['#355C7D', '#2A3D66']           // 21:00 - 5:00
};

// App-specific constants
export const APP_CONSTANTS = {
  headerHeight: 60,
  tabBarHeight: 55,
  animationDuration: 300,
  maxRecentLocations: 5,
  apiCacheTTL: 15 * 60 * 1000, // 15 minutes in milliseconds
};

export default {
  COLORS,
  FONTS,
  SIZES,
  SHADOWS,
  ANIMATION,
  WEATHER_MAPPINGS,
  TIME_THEMES,
  APP_CONSTANTS
};