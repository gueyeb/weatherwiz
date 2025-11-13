// src/hooks/useWeather.js
// useWeather custom hook

import { useContext } from 'react';
import { WeatherContext } from '../context/WeatherContext';

// This hook is a simple re-export of the WeatherContext
// We already defined the logic in the context provider
export const useWeather = () => {
  return useContext(WeatherContext);
};