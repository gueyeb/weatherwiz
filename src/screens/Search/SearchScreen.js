// src/screens/Forecast/SearchScreen.js

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  FadeIn
} from 'react-native-reanimated';

import { useWeather } from '../../hooks/useWeather';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../context/SettingsContext';

import DailyForecastItem from '../../components/forecast/DailyForecastItem';
import HourlyChart from '../../components/forecast/HourlyChart';
import SunriseSunsetInfo from '../../components/forecast/SunriseSunsetInfo';
import BackHeader from '../../components/common/BackHeader';

const SearchScreen = ({ navigation }) => {
  const { colors, shadows } = useTheme();
  const { 
    recentLocations, 
    setCurrentLocation, 
    addRecentLocation 
  } = useLocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [locationPermission, setLocationPermission] = useState(null);
  
  const searchInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  
  // Check location permissions on mount
  useEffect(() => {
    checkLocationPermission();
  }, []);
  
  // Auto-focus search input
  useEffect(() => {
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 300);
  }, []);
  
  // Clear search timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);
  
  // Check if the app has location permission
  const checkLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status);
  };
  
  // Handle search input change with debounce
  const handleSearchChange = (text) => {
    setSearchQuery(text);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (text.trim().length > 2) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(text);
      }, 500);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };
  
  // Perform location search
  const performSearch = async (query) => {
    try {
      const results = await searchLocations(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Search Error', 'Unable to search for locations. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };
  
  // Handle location selection
  const handleLocationSelect = (location) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentLocation(location);
    addRecentLocation(location);
    navigation.goBack();
  };
  
  // Use current device location
  const useCurrentLocation = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (locationPermission !== 'granted') {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'Please enable location services to use your current location.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      setLocationPermission(status);
    }
    
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });
      
      const { latitude, longitude } = location.coords;
      
      // Create a location object for the current position
      const currentLocation = {
        id: `current_${latitude}_${longitude}`,
        name: 'Current Location',
        lat: latitude,
        lon: longitude,
        current: true
      };
      
      setCurrentLocation(currentLocation);
      addRecentLocation(currentLocation);
      navigation.goBack();
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please check your device settings.',
        [{ text: 'OK' }]
      );
    }
  };
  
  // Clear search input
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    Keyboard.dismiss();
  };
  
  // Render recent location item
  const renderRecentItem = ({ item }) => (
    <LocationItem
      location={item}
      onPress={() => handleLocationSelect(item)}
    />
  );
  
  // Render search result item
  const renderSearchResultItem = ({ item }) => (
    <LocationItem
      location={item}
      onPress={() => handleLocationSelect(item)}
    />
  );
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <BackHeader
          title="Location"
          onBackPress={() => navigation.goBack()}
        />
        
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchInputContainer, shadows.sm]}>
            <MaterialCommunityIcons 
              name="magnify" 
              size={22} 
              color={colors.text.secondary}
              style={styles.searchIcon}
            />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Search for a city or country"
              placeholderTextColor={colors.text.tertiary}
              value={searchQuery}
              onChangeText={handleSearchChange}
              autoCapitalize="words"
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <MaterialCommunityIcons name="close-circle" size={18} color={colors.text.tertiary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {/* Current Location Button */}
        <TouchableOpacity
          style={[styles.currentLocationButton, shadows.sm]}
          onPress={useCurrentLocation}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="crosshairs-gps" size={20} color={colors.primary} />
          <Text style={styles.currentLocationText}>Use Current Location</Text>
        </TouchableOpacity>
        
        {/* Search Results or Recent Locations */}
        {isSearching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : searchQuery.length > 0 ? (
          <FlatList
            data={searchResults}
            renderItem={renderSearchResultItem}
            keyExtractor={(item) => `search_${item.id}`}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No locations found</Text>
              </View>
            }
          />
        ) : (
          <>
            {recentLocations.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>RECENT SEARCHES</Text>
                <FlatList
                  data={recentLocations}
                  renderItem={renderRecentItem}
                  keyExtractor={(item) => `recent_${item.id}`}
                  contentContainerStyle={styles.listContent}
                />
              </>
            )}
          </>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFC',
  },
  safeArea: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333333',
  },
  clearButton: {
    padding: 8,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    paddingVertical: 14,
  },
  currentLocationText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#375DB0',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchScreen;