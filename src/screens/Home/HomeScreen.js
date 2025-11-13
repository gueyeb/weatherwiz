// src/screens/Home/HomeScreen.js

import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl, 
  StatusBar, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  interpolate,
  Extrapolation
} from 'react-native-reanimated';

import { useWeather } from '../../hooks/useWeather';
import { useLocation } from '../../hooks/useLocation';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../context/SettingsContext';

import WeatherMetric from '../../components/weather/WeatherMetric';
import ForecastCarousel from '../../components/weather/ForecastCarousel';
import WeatherAlert from '../../components/weather/WeatherAlert';
import LocationHeader from '../../components/common/LocationHeader';

import { formatDateTime } from '../../utils/dateTime';
import { getBackgroundGradient, getWeatherIcon } from '../../utils/weatherUtils';
import { formatTemperature } from '../../utils/units';

const HomeScreen = ({ navigation }) => {
  const { colors, fonts, shadows } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const { settings } = useSettings();
  
  const { 
    currentWeather, 
    hourlyForecast, 
    weatherAlerts,
    isLoading, 
    fetchWeatherData 
  } = useWeather();
  
  const { currentLocation, locationName } = useLocation();
  
  // Animation values
  const headerOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(100);
  
  useEffect(() => {
    // Animate elements when data is loaded
    if (currentWeather && !isLoading) {
      headerOpacity.value = withTiming(1, { duration: 500 });
      contentTranslateY.value = withTiming(0, { duration: 600 });
    }
  }, [currentWeather, isLoading]);
  
  // Pull to refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await fetchWeatherData(currentLocation);
    setRefreshing(false);
  };
  
  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [
        { 
          translateY: interpolate(
            headerOpacity.value, 
            [0, 1], 
            [-20, 0],
            Extrapolation.CLAMP
          ) 
        }
      ]
    };
  });
  
  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: contentTranslateY.value }],
      opacity: interpolate(
        contentTranslateY.value,
        [100, 0],
        [0, 1],
        Extrapolation.CLAMP
      )
    };
  });
  
  // Background gradient based on current weather and time
  const backgroundGradient = currentWeather 
    ? getBackgroundGradient(currentWeather.condition.icon, currentWeather.timestamp) 
    : ['#4A90E2', '#87CEEB'];
  
  if (!currentWeather || isLoading) {
    return (
      <LinearGradient
        colors={backgroundGradient}
        style={styles.loadingContainer}
      >
        <Text style={styles.loadingText}>Loading weather data...</Text>
      </LinearGradient>
    );
  }
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={backgroundGradient}
        style={styles.background}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Location Header */}
          <Animated.View style={[styles.header, headerAnimatedStyle]}>
            <LocationHeader 
              locationName={locationName}
              timestamp={currentWeather.timestamp}
              onLocationPress={() => navigation.navigate('Search')}
              onSettingsPress={() => navigation.navigate('Settings')}
            />
          </Animated.View>
          
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#FFFFFF"
                progressBackgroundColor="rgba(255,255,255,0.2)"
                colors={['#FFFFFF']}
              />
            }
          >
            {/* Current Weather */}
            <Animated.View style={[styles.currentWeather, contentAnimatedStyle]}>
              <View style={styles.tempContainer}>
                <MaterialCommunityIcons
                  name={getWeatherIcon(currentWeather.condition.icon)}
                  size={72}
                  color="#FFFFFF"
                />
                <Text style={styles.temperature}>
                  {formatTemperature(currentWeather.temperature, settings.temperatureUnit)}
                </Text>
              </View>
              
              <Text style={styles.conditionText}>
                {currentWeather.condition.main}
              </Text>
              
              <Text style={styles.feelsLike}>
                Feels like {formatTemperature(currentWeather.feelsLike, settings.temperatureUnit)}
              </Text>
              
              <Text style={styles.description}>
                {currentWeather.condition.description}
              </Text>
            </Animated.View>
            
            {/* Weather Metrics Grid */}
            <Animated.View style={[styles.metricsContainer, contentAnimatedStyle, shadows.md]}>
              <View style={styles.metricsRow}>
                <WeatherMetric
                  icon="weather-windy"
                  title="Wind"
                  value={currentWeather.windSpeed}
                  unit={settings.windSpeedUnit}
                  style={styles.metric}
                />
                <View style={styles.divider} />
                <WeatherMetric
                  icon="water-percent"
                  title="Humidity"
                  value={currentWeather.humidity}
                  unit="%"
                  style={styles.metric}
                />
              </View>
              
              <View style={styles.horizontalDivider} />
              
              <View style={styles.metricsRow}>
                <WeatherMetric
                  icon="weather-sunny-alert"
                  title="UV Index"
                  value={currentWeather.uvIndex}
                  unit={currentWeather.uvIndex >= 6 ? "High" : "Low"}
                  colorOverride={currentWeather.uvIndex >= 8 ? colors.error : null}
                  style={styles.metric}
                />
                <View style={styles.divider} />
                <WeatherMetric
                  icon="gauge"
                  title="Pressure"
                  value={currentWeather.pressure}
                  unit="hPa"
                  style={styles.metric}
                />
              </View>
            </Animated.View>
            
            {/* Weather Alerts */}
            {weatherAlerts?.length > 0 && (
              <Animated.View style={[styles.alertsContainer, contentAnimatedStyle]}>
                <Text style={styles.sectionTitle}>Weather Alerts</Text>
                {weatherAlerts.map((alert, index) => (
                  <WeatherAlert
                    key={`alert-${index}`}
                    alert={alert}
                    onPress={() => {
                      navigation.navigate('AlertDetails', { alert });
                    }}
                  />
                ))}
              </Animated.View>
            )}
            
            {/* Hourly Forecast */}
            <Animated.View style={[styles.forecastContainer, contentAnimatedStyle]}>
              <Text style={styles.sectionTitle}>Hourly Forecast</Text>
              <ForecastCarousel
                data={hourlyForecast?.slice(0, 24) || []}
                currentTime={currentWeather.timestamp}
                temperatureUnit={settings.temperatureUnit}
                onItemPress={(item) => {
                  // Navigate to hourly detail or show modal
                  navigation.navigate('ForecastDetail', { forecast: item, type: 'hourly' });
                }}
              />
            </Animated.View>
            
            {/* Extended Forecast Button */}
            <Animated.View style={[styles.extendedForecastButton, contentAnimatedStyle]}>
              <TouchableOpacity
                style={[styles.button, shadows.sm]}
                onPress={() => navigation.navigate('Forecast')}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>View 7-Day Forecast</Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color={colors.primary} />
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  currentWeather: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  temperature: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 16,
  },
  conditionText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 8,
  },
  feelsLike: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    textTransform: 'capitalize',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  metricsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    overflow: 'hidden',
  },
  metricsRow: {
    flexDirection: 'row',
  },
  metric: {
    flex: 1,
  },
  divider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  forecastContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  alertsContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  extendedForecastButton: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#375DB0',
    marginRight: 8,
  },
});

export default HomeScreen;