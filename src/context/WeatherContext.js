// Weather data context

// src/context/WeatherContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useLocation } from './LocationContext';
import * as weatherApi from '../api/weatherApi';
import { CACHE_TTL } from '../constants/apiConfig';

// Create context
const WeatherContext = createContext();

// Storage keys
const CURRENT_WEATHER_KEY = '@weatherwiz_current_weather';
const HOURLY_FORECAST_KEY = '@weatherwiz_hourly_forecast';
const DAILY_FORECAST_KEY = '@weatherwiz_daily_forecast';
const WEATHER_ALERTS_KEY = '@weatherwiz_weather_alerts';
const CACHE_TIMESTAMP_KEY = '@weatherwiz_cache_timestamp';

export const WeatherProvider = ({ children }) => {
  const { currentLocation } = useLocation();
  
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState(null);
  const [dailyForecast, setDailyForecast] = useState(null);
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load weather data when current location changes
  useEffect(() => {
    if (currentLocation) {
      loadWeatherData();
    }
  }, [currentLocation]);
  
  // Check if cached data is still valid
  const isCacheValid = async () => {
    try {
      const timestampString = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
      
      if (!timestampString) return false;
      
      const cachedTimestamp = parseInt(timestampString, 10);
      const currentTimestamp = Date.now();
      
      // Check if cache has expired (15 minutes)
      return currentTimestamp - cachedTimestamp < CACHE_TTL.CURRENT_WEATHER;
    } catch (error) {
      console.error('Error checking cache validity:', error);
      return false;
    }
  };
  
  // Load weather data (from cache or API)
  const loadWeatherData = async () => {
    if (!currentLocation) return;
    setIsLoading(true);
    setError(null);
    try {
      // Try to load from cache if valid
      const cacheValid = await isCacheValid();
      if (cacheValid) {
        const [cachedCurrent, cachedHourly, cachedDaily, cachedAlerts] = await Promise.all([
          AsyncStorage.getItem(CURRENT_WEATHER_KEY),
          AsyncStorage.getItem(HOURLY_FORECAST_KEY),
          AsyncStorage.getItem(DAILY_FORECAST_KEY),
          AsyncStorage.getItem(WEATHER_ALERTS_KEY),
        ]);
        if (cachedCurrent && cachedHourly && cachedDaily) {
          setCurrentWeather(JSON.parse(cachedCurrent));
          setHourlyForecast(JSON.parse(cachedHourly));
          setDailyForecast(JSON.parse(cachedDaily));
          setWeatherAlerts(cachedAlerts ? JSON.parse(cachedAlerts) : []);
          setIsLoading(false);
          return;
        }
      }
      // Fetch from API
      const [current, hourly, daily, alerts] = await Promise.all([
        weatherApi.fetchCurrentWeather(currentLocation.lat, currentLocation.lon),
        weatherApi.fetchHourlyForecast(currentLocation.lat, currentLocation.lon),
        weatherApi.fetchDailyForecast(currentLocation.lat, currentLocation.lon),
        weatherApi.fetchWeatherAlerts(currentLocation.lat, currentLocation.lon),
      ]);
      setCurrentWeather(current);
      setHourlyForecast(hourly);
      setDailyForecast(daily);
      setWeatherAlerts(alerts);
      // Save to cache
      await Promise.all([
        AsyncStorage.setItem(CURRENT_WEATHER_KEY, JSON.stringify(current)),
        AsyncStorage.setItem(HOURLY_FORECAST_KEY, JSON.stringify(hourly)),
        AsyncStorage.setItem(DAILY_FORECAST_KEY, JSON.stringify(daily)),
        AsyncStorage.setItem(WEATHER_ALERTS_KEY, JSON.stringify(alerts)),
        AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString()),
      ]);
    } catch (err) {
      setError(err.message || 'Failed to load weather data');
    } finally {
      setIsLoading(false);
    }
  };

  const reloadWeather = () => {
    loadWeatherData();
  };

  const value = {
    currentWeather,
    hourlyForecast,
    dailyForecast,
    weatherAlerts,
    isLoading,
    error,
    reloadWeather,
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
