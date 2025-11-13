// src/hooks/usePermissions.js

import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

/**
 * Custom hook to check and request permissions
 * @returns {Object} - Object containing permission status and request functions
 */
export const usePermissions = () => {
  const [locationPermission, setLocationPermission] = useState(null);
  const [notificationPermission, setNotificationPermission] = useState(null);

  // Check permissions on mount
  useEffect(() => {
    checkLocationPermission();
    checkNotificationPermission();
  }, []);

  // Check location permission
  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setLocationPermission(status);
      return status;
    } catch (error) {
      console.error('Error checking location permission:', error);
      return 'error';
    }
  };

  // Request location permission
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);
      return status;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return 'error';
    }
  };

  // Check notification permission
  const checkNotificationPermission = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setNotificationPermission(status);
      return status;
    } catch (error) {
      console.error('Error checking notification permission:', error);
      return 'error';
    }
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setNotificationPermission(status);
      return status;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'error';
    }
  };

  return {
    locationPermission,
    notificationPermission,
    checkLocationPermission,
    requestLocationPermission,
    checkNotificationPermission,
    requestNotificationPermission,
  };
};