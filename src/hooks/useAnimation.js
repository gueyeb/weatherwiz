// src/hooks/useAnimation.js

import { useEffect } from 'react';
import { useSharedValue, withTiming, withSpring, withDelay, Easing } from 'react-native-reanimated';

/**
 * Custom hook for common animations
 * @param {Object} options - Animation options
 * @returns {Object} - Animation values and helper functions
 */
export const useAnimation = (options = {}) => {
  const {
    initialValue = 0,
    finalValue = 1,
    duration = 300,
    delay = 0,
    easing = Easing.bezier(0.25, 0.1, 0.25, 1),
    springConfig = { damping: 10, stiffness: 100 },
    type = 'timing', // 'timing' or 'spring'
    autoPlay = true,
  } = options;

  // Create animation value
  const animationValue = useSharedValue(initialValue);

  // Play animation
  const play = (config = {}) => {
    const {
      toValue = finalValue,
      newDuration = duration,
      newDelay = delay,
      newEasing = easing,
      newSpringConfig = springConfig,
      newType = type,
    } = config;

    if (newType === 'spring') {
      animationValue.value = withDelay(
        newDelay,
        withSpring(toValue, newSpringConfig)
      );
    } else {
      animationValue.value = withDelay(
        newDelay,
        withTiming(toValue, {
          duration: newDuration,
          easing: newEasing,
        })
      );
    }
  };

  // Reset animation
  const reset = () => {
    animationValue.value = initialValue;
  };

  // Auto-play animation on mount
  useEffect(() => {
    if (autoPlay) {
      play();
    }
  }, []);

  return {
    animationValue,
    play,
    reset,
  };
};