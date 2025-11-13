# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm start              # Start Expo dev server
npm run android        # Run on Android
npm run ios            # Run on iOS
npm run web            # Run on web browser
```

### Testing
```bash
npm test               # Run Jest tests in watch mode
```

## Architecture

### Context-Based State Management
App uses React Context API for global state (no Redux). Four main contexts:

- **WeatherContext** (`src/context/WeatherContext.js`): Weather data with AsyncStorage caching (15min TTL). Auto-fetches when location changes.
- **LocationContext** (`src/context/LocationContext.js`): Location management with device GPS support. Stores current + 5 recent locations.
- **ThemeContext** (`src/context/ThemeContext.js`): Theme switching (light/dark/auto) with system theme detection.
- **SettingsContext** (`src/context/SettingsContext.js`): User preferences (units, notifications, time format).

All contexts persist state to AsyncStorage automatically.

### Weather API Layer
`src/api/weatherApi.js` provides dual-API architecture:
- Primary: OpenWeatherMap (OneCall 3.0)
- Fallback: WeatherAPI.com (automatic on primary failure)

All API calls check cacheService before hitting network. Transformation functions normalize responses to internal domain models.

Key functions:
- `fetchCurrentWeather(lat, lon)` - Current conditions
- `fetchHourlyForecast(lat, lon)` - 5-day hourly
- `fetchDailyForecast(lat, lon)` - 7-day daily
- `searchLocations(query)` - Geocoding search
- `fetchWeatherAlerts(lat, lon)` - Weather warnings

### Navigation Structure
Expo + React Navigation 5. Main navigator in `src/navigation/AppNavigator.js`:
- HomeStack: Home → Search → Settings
- ForecastStack: Daily/hourly forecast details

### Component Organization
- `src/components/weather/`: Weather-specific UI (WeatherMetric, ForecastCarousel, WeatherAlert)
- `src/components/common/`: Shared components (LocationHeader, etc.)
- `src/screens/`: Screen-level components organized by feature

### Utilities
- `src/utils/units.js`: Temperature/speed unit conversions
- `src/utils/dateTime.js`: Timestamp formatting
- `src/utils/permissions.js`: Location permission handling
- `src/utils/storage.js`: AsyncStorage wrappers

### Hooks Pattern
Custom hooks in `src/hooks/` export context values + logic:
- `useWeather()` - Weather data access
- `useLocation()` - Location management
- `usePermissions()` - Location permissions
- `useWeatherEffects()` - Side effects coordination

### Animation
Uses `react-native-reanimated` for smooth animations (e.g., HomeScreen header/content fade-in on data load). Haptic feedback via `expo-haptics` on interactions.

## Important Patterns

### Adding New Weather Data
1. Update API response transformation in `src/api/weatherApi.js`
2. Extend WeatherContext state in `src/context/WeatherContext.js`
3. Update cache keys/TTL in context if needed
4. Create/update components in `src/components/weather/`

### Adding New Settings
1. Add to `defaultSettings` in `src/context/SettingsContext.js`
2. Update SettingsScreen UI in `src/screens/Settings/SettingsScreen.js`
3. Use via `useSettings()` hook

### Working with Location
Location flow: User selects → LocationContext updates → WeatherContext detects change → Auto-fetches weather. Always use `updateCurrentLocation()` to trigger weather refresh.

## Tech Stack
- React Native via Expo SDK 36
- React Navigation 5
- AsyncStorage for persistence
- Axios for HTTP
- Jest + jest-expo for testing
- Node 14+ (see .nvmrc)
