// src/hooks/useWeatherEffects.js

import { useState, useEffect } from 'react';
import { Vibration } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * Custom hook for weather-related effects (haptics, etc.)
 * @param {Object} currentWeather - Current weather data
 * @returns {Object} - Weather effects and helper functions
 */
export const useWeatherEffects = (currentWeather) => {
  const [previousCondition, setPreviousCondition] = useState(null);
  
  // Trigger effects when weather changes significantly
  useEffect(() => {
    if (!currentWeather || !currentWeather.condition) return;
    
    const currentCondition = currentWeather.condition.main;
    
    // Skip if this is the initial load
    if (!previousCondition) {
      setPreviousCondition(currentCondition);
      return;
    }
    
    // Check if condition changed
    if (currentCondition !== previousCondition) {
      // Trigger effects based on new weather
      triggerWeatherChangeEffects(currentWeather);
      setPreviousCondition(currentCondition);
    }
  }, [currentWeather]);
  
  // Trigger haptic effects based on weather type
  const triggerWeatherChangeEffects = (weather) => {
    const { condition } = weather;
    
    if (!condition) return;
    
    // Different haptic patterns for different weather conditions
    switch (condition.main) {
      case 'Thunderstorm':
        // Strong impact + vibration pattern
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setTimeout(() => {
          Vibration.vibrate([0, 100, 50, 100, 50, 100]);
        }, 200);
        break;
        
      case 'Rain':
      case 'Drizzle':
        // Light taps
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setTimeout(() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }, 100);
        setTimeout(() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }, 200);
        break;
        
      case 'Snow':
        // Soft, light impact
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setTimeout(() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }, 300);
        break;
        
      case 'Clear':
        // Single subtle notification
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
        
      case 'Clouds':
        // Light impact
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
        
      default:
        // Default subtle effect
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  // Manually trigger effects
  const triggerEffect = (type = 'default') => {
    switch (type) {
      case 'severe':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'refresh':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'alert':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      default:
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };
  
  return {
    triggerEffect,
  };
};