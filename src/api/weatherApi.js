// src/api/weatherApi.js
// OpenWeatherMap API client
import axios from 'axios';
import { API_KEYS, BASE_URLS, CACHE_TTL } from '../constants/apiConfig';
import * as cacheService from '../services/cacheService';

// Create axios instances for primary and fallback APIs
const openWeatherApi = axios.create({
  baseURL: BASE_URLS.OPEN_WEATHER,
  params: {
    appid: API_KEYS.OPEN_WEATHER,
    units: 'metric' // Always fetch in metric and convert as needed
  }
});

const fallbackApi = axios.create({
  baseURL: BASE_URLS.WEATHER_API,
  params: {
    key: API_KEYS.WEATHER_API
  }
});

/**
 * Fetch current weather data for a location
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<CurrentWeather>}
 */
export const fetchCurrentWeather = async (lat, lon) => {
  const cacheKey = `current_${lat}_${lon}`;
  
  // Check cache first
  const cachedData = await cacheService.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  try {
    // Try primary API first
    const response = await openWeatherApi.get('/data/3.0/onecall', {
      params: {
        lat,
        lon,
        exclude: 'minutely,hourly,daily'
      }
    });
    
    // Transform API response to our domain model
    const transformedData = transformCurrentWeather(response.data);
    
    // Cache the data
    await cacheService.set(cacheKey, transformedData, CACHE_TTL.CURRENT_WEATHER);
    
    return transformedData;
  } catch (error) {
    // Fallback to secondary API
    try {
      const fallbackResponse = await fallbackApi.get('/v1/current.json', {
        params: {
          q: `${lat},${lon}`
        }
      });
      
      // Transform fallback API response
      const transformedData = transformFallbackCurrentWeather(fallbackResponse.data);
      
      // Cache the data
      await cacheService.set(cacheKey, transformedData, CACHE_TTL.CURRENT_WEATHER);
      
      return transformedData;
    } catch (fallbackError) {
      // Both APIs failed
      console.error('Weather API Error:', error);
      console.error('Fallback API Error:', fallbackError);
      throw new Error('Unable to fetch current weather data');
    }
  }
};

/**
 * Fetch 5-day hourly forecast
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<HourlyForecast[]>}
 */
export const fetchHourlyForecast = async (lat, lon) => {
  const cacheKey = `hourly_${lat}_${lon}`;
  
  // Check cache first
  const cachedData = await cacheService.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  try {
    const response = await openWeatherApi.get('/data/3.0/onecall', {
      params: {
        lat,
        lon,
        exclude: 'current,minutely,daily'
      }
    });
    
    // Transform API response to our domain model
    const transformedData = transformHourlyForecast(response.data);
    
    // Cache the data
    await cacheService.set(cacheKey, transformedData, CACHE_TTL.HOURLY_FORECAST);
    
    return transformedData;
  } catch (error) {
    // Fallback implementation
    try {
      const fallbackResponse = await fallbackApi.get('/v1/forecast.json', {
        params: {
          q: `${lat},${lon}`,
          days: 5,
          hour: 1
        }
      });
      
      // Transform fallback API response
      const transformedData = transformFallbackHourlyForecast(fallbackResponse.data);
      
      // Cache the data
      await cacheService.set(cacheKey, transformedData, CACHE_TTL.HOURLY_FORECAST);
      
      return transformedData;
    } catch (fallbackError) {
      console.error('Weather API Error:', error);
      console.error('Fallback API Error:', fallbackError);
      throw new Error('Unable to fetch hourly forecast data');
    }
  }
};

/**
 * Fetch 7-day daily forecast
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<DailyForecast[]>}
 */
export const fetchDailyForecast = async (lat, lon) => {
  const cacheKey = `daily_${lat}_${lon}`;
  
  // Check cache first
  const cachedData = await cacheService.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  try {
    const response = await openWeatherApi.get('/data/3.0/onecall', {
      params: {
        lat,
        lon,
        exclude: 'current,minutely,hourly'
      }
    });
    
    // Transform API response to our domain model
    const transformedData = transformDailyForecast(response.data);
    
    // Cache the data
    await cacheService.set(cacheKey, transformedData, CACHE_TTL.DAILY_FORECAST);
    
    return transformedData;
  } catch (error) {
    // Fallback implementation
    try {
      const fallbackResponse = await fallbackApi.get('/v1/forecast.json', {
        params: {
          q: `${lat},${lon}`,
          days: 7
        }
      });
      
      // Transform fallback API response
      const transformedData = transformFallbackDailyForecast(fallbackResponse.data);
      
      // Cache the data
      await cacheService.set(cacheKey, transformedData, CACHE_TTL.DAILY_FORECAST);
      
      return transformedData;
    } catch (fallbackError) {
      console.error('Weather API Error:', error);
      console.error('Fallback API Error:', fallbackError);
      throw new Error('Unable to fetch daily forecast data');
    }
  }
};

/**
 * Search for locations by query
 * @param {string} query - Search query
 * @returns {Promise<Location[]>}
 */
export const searchLocations = async (query) => {
  try {
    const response = await openWeatherApi.get('/geo/1.0/direct', {
      params: {
        q: query,
        limit: 10
      }
    });
    
    // Transform and return locations
    return response.data.map(item => ({
      id: `${item.lat}_${item.lon}`,
      name: item.name,
      country: item.country,
      lat: item.lat,
      lon: item.lon,
      state: item.state || null
    }));
  } catch (error) {
    // Fallback to secondary API
    try {
      const fallbackResponse = await fallbackApi.get('/v1/search.json', {
        params: {
          q: query
        }
      });
      
      // Transform fallback API response
      return fallbackResponse.data.map(item => ({
        id: `${item.lat}_${item.lon}`,
        name: item.name,
        country: item.country,
        lat: item.lat,
        lon: item.lon,
        region: item.region || null
      }));
    } catch (fallbackError) {
      console.error('Location Search Error:', error);
      console.error('Fallback Search Error:', fallbackError);
      throw new Error('Unable to search for locations');
    }
  }
};

/**
 * Get weather alerts for a location
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<WeatherAlert[]>}
 */
export const fetchWeatherAlerts = async (lat, lon) => {
  const cacheKey = `alerts_${lat}_${lon}`;
  
  // Check cache first with a shorter TTL for alerts
  const cachedData = await cacheService.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  try {
    const response = await openWeatherApi.get('/data/3.0/onecall', {
      params: {
        lat,
        lon,
        exclude: 'current,minutely,hourly,daily'
      }
    });
    
    // Check if alerts exist
    if (!response.data.alerts || response.data.alerts.length === 0) {
      return [];
    }
    
    // Transform alerts data
    const transformedData = transformWeatherAlerts(response.data.alerts);
    
    // Cache alerts with shorter TTL
    await cacheService.set(cacheKey, transformedData, CACHE_TTL.ALERTS);
    
    return transformedData;
  } catch (error) {
    console.error('Weather Alerts Error:', error);
    return []; // Return empty array on error for non-critical alerts
  }
};

// Transformation functions for API responses will be implemented in separate files
// These are placeholder signatures
function transformCurrentWeather(data) {
  // Implementation will map OpenWeatherMap response to our domain model
  // Return CurrentWeather object
}

function transformFallbackCurrentWeather(data) {
  // Implementation will map WeatherAPI.com response to our domain model
  // Return CurrentWeather object
}

function transformHourlyForecast(data) {
  // Implementation will map OpenWeatherMap response to our domain model
  // Return array of HourlyForecast objects
}

function transformFallbackHourlyForecast(data) {
  // Implementation will map WeatherAPI.com response to our domain model
  // Return array of HourlyForecast objects
}

function transformDailyForecast(data) {
  // Implementation will map OpenWeatherMap response to our domain model
  // Return array of DailyForecast objects
}

function transformFallbackDailyForecast(data) {
  // Implementation will map WeatherAPI.com response to our domain model
  // Return array of DailyForecast objects
}

function transformWeatherAlerts(alerts) {
  // Implementation will map alerts to our domain model
  // Return array of WeatherAlert objects
}