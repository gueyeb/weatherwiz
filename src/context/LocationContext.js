// src/context/LocationContext.js
// Location management context

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

// Create context
const LocationContext = createContext();

// Storage keys
const CURRENT_LOCATION_KEY = '@weatherwiz_current_location';
const RECENT_LOCATIONS_KEY = '@weatherwiz_recent_locations';

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [recentLocations, setRecentLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load saved location data
  useEffect(() => {
    const loadLocationData = async () => {
      try {
        // Load current location
        const savedLocation = await AsyncStorage.getItem(CURRENT_LOCATION_KEY);
        if (savedLocation) {
          const parsedLocation = JSON.parse(savedLocation);
          setCurrentLocation(parsedLocation);
          setLocationName(parsedLocation.name);
        } else {
          // Try to get device location if no saved location
          await getDeviceLocation();
        }
        
        // Load recent locations
        const savedRecentLocations = await AsyncStorage.getItem(RECENT_LOCATIONS_KEY);
        if (savedRecentLocations) {
          const parsedRecentLocations = JSON.parse(savedRecentLocations);
          setRecentLocations(parsedRecentLocations);
        }
      } catch (error) {
        console.error('Failed to load location data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLocationData();
  }, []);
  
  // Try to get the device's current location
  const getDeviceLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        // Use default location if permission not granted
        useDefaultLocation();
        return;
      }
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      const { latitude, longitude } = location.coords;
      
      // Get location name using reverse geocoding
      const [address] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      
      if (address) {
        const locationData = {
          id: `current_${latitude}_${longitude}`,
          name: address.city || address.region || 'Current Location',
          country: address.country || '',
          lat: latitude,
          lon: longitude,
          current: true,
        };
        
        setCurrentLocation(locationData);
        setLocationName(locationData.name);
        await AsyncStorage.setItem(CURRENT_LOCATION_KEY, JSON.stringify(locationData));
        
        // Add to recent locations
        addRecentLocation(locationData);
      } else {
        useDefaultLocation();
      }
    } catch (error) {
      console.error('Error getting device location:', error);
      useDefaultLocation();
    }
  };
  
  // Use a default location (New York) if we can't determine location
  const useDefaultLocation = () => {
    const defaultLocation = {
      id: 'default_nyc',
      name: 'New York',
      country: 'US',
      lat: 40.7128,
      lon: -74.0060,
    };
    
    setCurrentLocation(defaultLocation);
    setLocationName('New York, US');
    AsyncStorage.setItem(CURRENT_LOCATION_KEY, JSON.stringify(defaultLocation));
  };
  
  // Set current location
  const updateCurrentLocation = (location) => {
    setCurrentLocation(location);
    setLocationName(location.name + (location.country ? `, ${location.country}` : ''));
    AsyncStorage.setItem(CURRENT_LOCATION_KEY, JSON.stringify(location));
  };
  
  // Add a location to recent locations
  const addRecentLocation = (location) => {
    setRecentLocations((prevLocations) => {
      // Remove if already exists
      const filteredLocations = prevLocations.filter((loc) => loc.id !== location.id);
      
      // Add to beginning of array
      const updatedLocations = [location, ...filteredLocations].slice(0, 5);
      
      // Save to storage
      AsyncStorage.setItem(RECENT_LOCATIONS_KEY, JSON.stringify(updatedLocations));
      
      return updatedLocations;
    });
  };
  
  // Remove a location from recent locations
  const removeRecentLocation = (locationId) => {
    setRecentLocations((prevLocations) => {
      const updatedLocations = prevLocations.filter((loc) => loc.id !== locationId);
      AsyncStorage.setItem(RECENT_LOCATIONS_KEY, JSON.stringify(updatedLocations));
      return updatedLocations;
    });
  };
  
  const value = {
    currentLocation,
    locationName,
    recentLocations,
    isLoading,
    setCurrentLocation: updateCurrentLocation,
    addRecentLocation,
    removeRecentLocation,
    getDeviceLocation,
  };
  
  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

// Hook for using location context
export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
