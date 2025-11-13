// src/screens/Settings/SettingsScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../context/SettingsContext';
import { useWeather } from '../../hooks/useWeather';

import BackHeader from '../../components/common/BackHeader';
import SettingsRow from '../../components/settings/SettingsRow';
import SettingsSection from '../../components/settings/SettingsSection';
import SegmentedControl from '../../components/common/SegmentedControl';

const SettingsScreen = ({ navigation }) => {
  const { colors, toggleTheme, theme } = useTheme();
  const { settings, updateSettings } = useSettings();
  const { clearCache } = useWeather();
  
  // Toggle theme handler
  const handleThemeToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleTheme();
  };
  
  // Temperature unit change handler
  const handleTemperatureUnitChange = (value) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateSettings({ temperatureUnit: value ? 'fahrenheit' : 'celsius' });
  };
  
  // Wind speed unit change handler
  const handleWindSpeedUnitChange = (index) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const units = ['kph', 'mph', 'ms'];
    updateSettings({ windSpeedUnit: units[index] });
  };
  
  // Time format change handler
  const handleTimeFormatChange = (value) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateSettings({ timeFormat: value ? '24h' : '12h' });
  };
  
  // Notification toggle handler
  const handleNotificationToggle = (value) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateSettings({ notificationsEnabled: value });
  };
  
  // Alert notifications toggle handler
  const handleAlertNotificationsToggle = (value) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateSettings({ alertNotifications: value });
  };
  
  // Clear cache handler
  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear the app cache? This will remove all stored weather data.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            clearCache();
          }
        }
      ]
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background.light }]}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <BackHeader
          title="Settings"
          onBackPress={() => navigation.goBack()}
        />
        
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Units Section */}
          <SettingsSection title="Units">
            <SettingsRow
              label="Temperature"
              rightComponent={
                <SegmentedControl
                  values={['°C', '°F']}
                  selectedIndex={settings.temperatureUnit === 'fahrenheit' ? 1 : 0}
                  onChange={(index) => handleTemperatureUnitChange(index === 1)}
                  width={100}
                />
              }
            />
            
            <SettingsRow
              label="Wind Speed"
              rightComponent={
                <SegmentedControl
                  values={['km/h', 'mph', 'm/s']}
                  selectedIndex={['kph', 'mph', 'ms'].indexOf(settings.windSpeedUnit)}
                  onChange={handleWindSpeedUnitChange}
                  width={150}
                />
              }
            />
            
            <SettingsRow
              label="Time Format"
              rightComponent={
                <SegmentedControl
                  values={['12h', '24h']}
                  selectedIndex={settings.timeFormat === '24h' ? 1 : 0}
                  onChange={(index) => handleTimeFormatChange(index === 1)}
                  width={100}
                />
              }
            />
          </SettingsSection>
          
          {/* Notifications Section */}
          <SettingsSection title="Notifications">
            <SettingsRow
              label="Enable Notifications"
              rightComponent={
                <Switch
                  value={settings.notificationsEnabled}
                  onValueChange={handleNotificationToggle}
                  trackColor={{ false: '#E0E0E0', true: 'rgba(55, 93, 176, 0.4)' }}
                  thumbColor={settings.notificationsEnabled ? colors.primary : '#FFFFFF'}
                  ios_backgroundColor="#E0E0E0"
                />
              }
            />
            
            <SettingsRow
              label="Weather Alerts"
              rightComponent={
                <Switch
                  value={settings.alertNotifications}
                  onValueChange={handleAlertNotificationsToggle}
                  trackColor={{ false: '#E0E0E0', true: 'rgba(55, 93, 176, 0.4)' }}
                  thumbColor={settings.alertNotifications ? colors.primary : '#FFFFFF'}
                  ios_backgroundColor="#E0E0E0"
                  disabled={!settings.notificationsEnabled}
                />
              }
              disabled={!settings.notificationsEnabled}
            />
          </SettingsSection>
          
          {/* Appearance Section */}
          <SettingsSection title="Appearance">
            <SettingsRow
              label="Dark Mode"
              rightComponent={
                <Switch
                  value={theme === 'dark'}
                  onValueChange={handleThemeToggle}
                  trackColor={{ false: '#E0E0E0', true: 'rgba(55, 93, 176, 0.4)' }}
                  thumbColor={theme === 'dark' ? colors.primary : '#FFFFFF'}
                  ios_backgroundColor="#E0E0E0"
                />
              }
            />
          </SettingsSection>
          
          {/* About Section */}
          <SettingsSection title="About">
            <SettingsRow
              label="Version"
              detail="1.0.0"
            />
            
            <SettingsRow
              label="Weather Data"
              detail="OpenWeatherMap API"
            />
            
            <TouchableOpacity onPress={handleClearCache}>
              <SettingsRow
                label="Clear Cache"
                rightComponent={
                  <MaterialCommunityIcons name="trash-can-outline" size={20} color={colors.error} />
                }
                labelStyle={{ color: colors.error }}
              />
            </TouchableOpacity>
          </SettingsSection>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
});

export default SettingsScreen; '../../components/common/BackHeader';