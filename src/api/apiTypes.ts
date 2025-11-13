// Domain Models for WeatherWiz

// Location Model
export interface Location {
  id: string;         // Unique identifier
  name: string;       // City name
  country: string;    // Country name
  lat: number;        // Latitude
  lon: number;        // Longitude
  timezone: string;   // Timezone identifier
  lastUpdated?: Date; // Last time this location was queried
}

// Current Weather Model
export interface CurrentWeather {
  temperature: number;      // Current temperature
  feelsLike: number;        // "Feels like" temperature
  humidity: number;         // Humidity percentage
  windSpeed: number;        // Wind speed
  windDirection: number;    // Wind direction in degrees
  pressure: number;         // Atmospheric pressure
  uvIndex: number;          // UV index
  visibility: number;       // Visibility in meters
  condition: WeatherCondition;  // Weather condition
  precipitation: number;    // Precipitation amount
  timestamp: Date;          // Data timestamp
  sunriseTime: Date;        // Sunrise time
  sunsetTime: Date;         // Sunset time
  daytime: boolean;         // Whether it's daytime
}

// Weather Condition Model
export interface WeatherCondition {
  id: number;               // Condition ID (from API)
  main: string;             // Main condition (Rain, Clear, etc.)
  description: string;      // Detailed description
  icon: string;             // Icon code
  severity: number;         // Severity level (0-5)
}

// Hourly Forecast Item
export interface HourlyForecast {
  timestamp: Date;          // Forecast time
  temperature: number;      // Temperature
  feelsLike: number;        // "Feels like" temperature
  condition: WeatherCondition;  // Weather condition
  precipitation: number;    // Precipitation probability
  precipitationAmount: number;  // Precipitation amount
  windSpeed: number;        // Wind speed
  windDirection: number;    // Wind direction
}

// Daily Forecast Item
export interface DailyForecast {
  date: Date;               // Forecast date
  dayOfWeek: string;        // Day of week
  temperatureMin: number;   // Minimum temperature
  temperatureMax: number;   // Maximum temperature
  condition: WeatherCondition;  // Main weather condition
  precipitation: number;    // Precipitation probability
  sunriseTime: Date;        // Sunrise time
  sunsetTime: Date;         // Sunset time
  moonPhase: number;        // Moon phase (0-1)
}

// Weather Alert Model
export interface WeatherAlert {
  id: string;               // Alert ID
  type: string;             // Alert type
  severity: string;         // Alert severity
  title: string;            // Alert title
  description: string;      // Alert description
  start: Date;              // Start time
  end: Date;                // End time
  source: string;           // Alert source
  affectedZones: string[];  // Affected zones
}

// User Settings Model
export interface UserSettings {
  temperatureUnit: 'celsius' | 'fahrenheit';  // Temperature unit preference
  windSpeedUnit: 'kph' | 'mph' | 'ms';        // Wind speed unit preference
  timeFormat: '12h' | '24h';                  // Time format preference
  notificationsEnabled: boolean;              // Notifications toggle
  alertNotifications: boolean;                // Weather alerts toggle
  recentLocations: Location[];                // Recently searched locations
  defaultLocation?: Location;                 // Default location
  theme: 'light' | 'dark' | 'auto';           // App theme preference
}

// API Response Cache Item
export interface CacheItem<T> {
  data: T;                   // Cached data
  timestamp: number;         // Cache timestamp
  expiry: number;            // Expiry timestamp
  locationId: string;        // Associated location
} 