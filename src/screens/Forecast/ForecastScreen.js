// src/screens/Forecast/ForecastScreen.js

const tabOptions = [
  { id: 'hourly', label: 'Hourly' },
  { id: 'daily', label: 'Weekly' }
];

const ForecastScreen = ({ navigation }) => {
  const { colors, shadows } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('hourly');
  const { settings } = useSettings();
  
  const { 
    currentWeather, 
    hourlyForecast, 
    dailyForecast 
  } = useWeather();
  
  // Animation values
  const tabIndicatorPosition = useSharedValue(0);
  
  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Animate tab indicator
    tabIndicatorPosition.value = withTiming(
      tabId === 'hourly' ? 0 : 1, 
      { duration: 250 }
    );
  };
  
  // Tab indicator animation
  const tabIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: tabIndicatorPosition.value * (100) }
      ]
    };
  });
  
  // Render daily forecast list
  const renderDailyForecast = () => {
    if (!dailyForecast || dailyForecast.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No forecast data available</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.dailyForecastContainer}>
        {dailyForecast.map((item, index) => (
          <DailyForecastItem
            key={`day-${index}`}
            forecast={item}
            temperatureUnit={settings.temperatureUnit}
            onPress={() => {
              navigation.navigate('DailyDetail', { forecast: item });
            }}
            isToday={index === 0}
          />
        ))}
      </View>
    );
  };
  
  // Render hourly forecast chart and data
  const renderHourlyForecast = () => {
    if (!hourlyForecast || hourlyForecast.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hourly data available</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.hourlyForecastContainer}>
        {/* Temperature Chart */}
        <View style={[styles.chartCard, shadows.md]}>
          <Text style={styles.chartTitle}>Temperature</Text>
          <HourlyChart
            data={hourlyForecast.slice(0, 24)}
            dataKey="temperature"
            unit="°"
            color="#FF9800"
            temperatureUnit={settings.temperatureUnit}
          />
        </View>
        
        {/* Precipitation Chart */}
        <View style={[styles.chartCard, shadows.md]}>
          <Text style={styles.chartTitle}>Precipitation Chance</Text>
          <HourlyChart
            data={hourlyForecast.slice(0, 24)}
            dataKey="precipitation"
            unit="%"
            color="#4A90E2"
            valueFormatter={(value) => `${Math.round(value * 100)}%`}
          />
        </View>
        
        {/* Sunrise/Sunset Info */}
        {currentWeather && (
          <SunriseSunsetInfo
            sunrise={currentWeather.sunriseTime}
            sunset={currentWeather.sunsetTime}
            currentTime={new Date()}
            style={[styles.chartCard, shadows.md]}
          />
        )}
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <BackHeader
          title="Forecast"
          onBackPress={() => navigation.goBack()}
        />
        
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {tabOptions.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabButton}
              onPress={() => handleTabChange(tab.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabLabel,
                  { color: activeTab === tab.id ? colors.primary : colors.text.secondary }
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
          {/* Animated tab indicator */}
          <Animated.View 
            style={[
              styles.tabIndicator, 
              { backgroundColor: colors.primary }, 
              tabIndicatorStyle
            ]} 
          />
        </View>
        
        {/* Content based on active tab */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'hourly' ? (
            <Animated.View 
              entering={FadeIn.duration(300)}
              style={styles.tabContent}
            >
              {renderHourlyForecast()}
            </Animated.View>
          ) : (
            <Animated.View 
              entering={FadeIn.duration(300)}
              style={styles.tabContent}
            >
              {renderDailyForecast()}
            </Animated.View>
          )}
        </ScrollView>
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
  tabContainer: {
    flexDirection: 'row',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    position: 'relative',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '50%',
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  tabContent: {
    flex: 1,
  },
  dailyForecastContainer: {
    padding: 16,
  },
  hourlyForecastContainer: {
    padding: 16,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
  },
});

export default ForecastScreen;