// app/transport/[destinationId].tsx 
import { useTheme } from '@/app/_context/ThemeContext';
import { getThemeColors } from '@/app/theme/colors';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchNearbyStopsAndSchedules,
  selectCurrentDestination,
  selectTransportError,
  selectTransportLoading,
  selectTransportRoutes,
  setSelectedType,
} from '@/store/slices/transportSlice';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const TransportScreen = () => {
  const { destinationId } = useLocalSearchParams();
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const dispatch = useAppDispatch();
  
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  
  // Redux state
  const selectedType = useAppSelector(state => state.transport.selectedType);
  const trainRoutes = useAppSelector(state => selectTransportRoutes(state, 'train'));
  const busRoutes = useAppSelector(state => selectTransportRoutes(state, 'bus'));
  const loading = useAppSelector(selectTransportLoading);
  const error = useAppSelector(selectTransportError);
  const currentDestination = useAppSelector(selectCurrentDestination);

  const currentRoutes = selectedType === 'bus' ? busRoutes : trainRoutes;

  // Load transport data on mount
  useEffect(() => {
    loadTransportData();
  }, [destinationId]);

  const loadTransportData = async () => {
    try {
      // Get user location
      const { status } = await Location.requestForegroundPermissionsAsync();
      let location = { latitude: 51.5074, longitude: -0.1278 }; // Default to London
      
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        location = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };
      }
      
      setUserLocation(location);
      
      // Fetch transport schedules
      dispatch(fetchNearbyStopsAndSchedules({
        destinationId: String(destinationId),
        lat: location.latitude,
        lon: location.longitude,
      }));
    } catch (error) {
      console.error('Error loading transport data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTransportData();
    setRefreshing(false);
  };

  const handleTransportTypeChange = (type: 'bus' | 'train') => {
    dispatch(setSelectedType(type));
  };

  if (!currentDestination && loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading transport schedules...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.textTertiary} />
          <Text style={[styles.errorTitle, { color: colors.text }]}>Unable to Load Data</Text>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>{error}</Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={loadTransportData}
          >
            <Ionicons name="refresh" size={20} color="#FFF" />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.backButtonAlt, { borderColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.backButtonTextAlt, { color: colors.primary }]}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const destinationName = currentDestination?.name || 'Destination';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={loading}
        >
          <Ionicons name="refresh" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>Travel to {destinationName}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Live transport schedules from TransportAPI
        </Text>

        {/* Transport Type Selector */}
        <View style={styles.transportSelector}>
          <TouchableOpacity
            style={[
              styles.transportButton,
              { backgroundColor: colors.surface },
              selectedType === 'train' && { backgroundColor: colors.primary },
            ]}
            onPress={() => handleTransportTypeChange('train')}
          >
            <Ionicons 
              name="train" 
              size={20} 
              color={selectedType === 'train' ? '#FFF' : colors.primary} 
            />
            <Text
              style={[
                styles.transportButtonText,
                { color: selectedType === 'train' ? '#FFF' : colors.primary },
              ]}
            >
              Train
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.transportButton,
              { backgroundColor: colors.surface },
              selectedType === 'bus' && { backgroundColor: colors.primary },
            ]}
            onPress={() => handleTransportTypeChange('bus')}
          >
            <Ionicons 
              name="bus" 
              size={20} 
              color={selectedType === 'bus' ? '#FFF' : colors.primary} 
            />
            <Text
              style={[
                styles.transportButtonText,
                { color: selectedType === 'bus' ? '#FFF' : colors.primary },
              ]}
            >
              Bus
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.infoIconContainer, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name="information-circle" size={20} color={colors.primary} />
          </View>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Showing live departures to {destinationName}. Times are updated in real-time from UK transport networks.
          </Text>
        </View>

        {/* Available Routes Header */}
        <View style={styles.routesHeader}>
          <Text style={[styles.routesTitle, { color: colors.text }]}>
            {selectedType === 'bus' ? 'Bus' : 'Train'} Departures
          </Text>
          <Text style={[styles.routesCount, { color: colors.textSecondary }]}>
            {currentRoutes?.length || 0} departures found
          </Text>
        </View>

        {/* Loading State */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}

        {/* Route Cards */}
        {!loading && currentRoutes && currentRoutes.length > 0 ? (
          currentRoutes.map((route: any, index: number) => (
            <View 
              key={index} 
              style={[styles.routeContainer, { backgroundColor: colors.surface }]}
            >
              {/* Route Header */}
              <View style={styles.routeHeader}>
                <View style={[styles.routeIcon, { backgroundColor: colors.primary + '20' }]}>
                  <Ionicons 
                    name={selectedType === 'bus' ? 'bus' : 'train'} 
                    size={24} 
                    color={colors.primary} 
                  />
                </View>
                <View style={styles.routeHeaderText}>
                  <Text style={[styles.routeName, { color: colors.text }]}>{route.vehicleName}</Text>
                  <Text style={[styles.routeOperator, { color: colors.textTertiary }]}>
                    {route.operator}
                  </Text>
                </View>
                {route.status && (
                  <View style={[styles.statusBadge, { 
                    backgroundColor: route.status === 'On time' 
                      ? '#4CAF50' + '20' 
                      : '#FF9800' + '20' 
                  }]}>
                    <Text style={[styles.statusText, { 
                      color: route.status === 'On time' ? '#4CAF50' : '#FF9800' 
                    }]}>
                      {route.status}
                    </Text>
                  </View>
                )}
              </View>

              {/* Route Time and Location */}
              <View style={styles.routeItem}>
                <View style={styles.routeLeft}>
                  <View style={[styles.timeCircle, { backgroundColor: colors.primary + '20' }]}>
                    <Ionicons name="time-outline" size={16} color={colors.primary} />
                  </View>
                  <View>
                    <Text style={[styles.routeTime, { color: colors.text }]}>{route.departureTime}</Text>
                    <Text style={[styles.routeLabel, { color: colors.textTertiary }]}>Departure</Text>
                  </View>
                </View>
                <View style={styles.routeRight}>
                  <Text style={[styles.routeLocation, { color: colors.textSecondary }]} numberOfLines={2}>
                    {route.departureLocation}
                  </Text>
                </View>
              </View>

              {/* Connecting Dots */}
              <View style={styles.routeDots}>
                <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                <View style={[styles.dot, { backgroundColor: colors.primary }]} />
              </View>

              {/* Arrival */}
              <View style={styles.routeItem}>
                <View style={styles.routeLeft}>
                  <View style={[styles.timeCircle, { backgroundColor: colors.primary + '20' }]}>
                    <Ionicons name="checkmark-circle-outline" size={16} color={colors.primary} />
                  </View>
                  <View>
                    <Text style={[styles.routeTime, { color: colors.text }]}>
                      {route.arrivalTime !== 'N/A' ? route.arrivalTime : 'Varies'}
                    </Text>
                    <Text style={[styles.routeLabel, { color: colors.textTertiary }]}>Arrival</Text>
                  </View>
                </View>
                <View style={styles.routeRight}>
                  <Text style={[styles.routeLocation, { color: colors.textSecondary }]} numberOfLines={2}>
                    {route.arrivalLocation}
                  </Text>
                </View>
              </View>

              {/* Transport Details */}
              <View style={[styles.transportDetails, { borderTopColor: colors.border }]}>
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Ionicons name="pricetag-outline" size={14} color={colors.primary} />
                    <Text style={[styles.transportDetailText, { color: colors.textSecondary }]}>
                      {route.vehicleNumber}
                    </Text>
                  </View>
                  {route.platform && (
                    <View style={[styles.platformBadge, { backgroundColor: colors.primary + '20' }]}>
                      <Text style={[styles.platformText, { color: colors.primary }]}>
                        Platform {route.platform}
                      </Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.bottomDetails}>
                  <View style={styles.detailBadge}>
                    <Ionicons name="time-outline" size={14} color={colors.primary} />
                    <Text style={[styles.badgeText, { color: colors.text }]}>{route.duration}</Text>
                  </View>
                  
                  <View style={styles.detailBadge}>
                    <Ionicons name="star" size={14} color="#FFC107" />
                    <Text style={[styles.badgeText, { color: colors.text }]}>
                      {route.rating.toFixed(1)}
                    </Text>
                  </View>
                  
                  <View style={[styles.priceBadge, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={[styles.priceText, { color: colors.primary }]}>
                      £{route.price}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : !loading ? (
          <View style={[styles.noRoutesContainer, { backgroundColor: colors.surface }]}>
            <Ionicons name="sad-outline" size={48} color={colors.textTertiary} />
            <Text style={[styles.noRoutesText, { color: colors.textSecondary }]}>
              No {selectedType} departures available at this time
            </Text>
            <TouchableOpacity 
              style={[styles.refreshSmallButton, { backgroundColor: colors.primary }]}
              onPress={handleRefresh}
            >
              <Text style={styles.refreshSmallButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  transportSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  transportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transportButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  routesHeader: {
    marginBottom: 16,
  },
  routesTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  routesCount: {
    fontSize: 13,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  routeContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  routeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeHeaderText: {
    flex: 1,
  },
  routeName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  routeOperator: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  routeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 120,
  },
  timeCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeTime: {
    fontSize: 15,
    fontWeight: '600',
  },
  routeLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  routeRight: {
    flex: 1,
  },
  routeLocation: {
    fontSize: 14,
  },
  routeDots: {
    flexDirection: 'column',
    gap: 4,
    marginLeft: 17,
    marginVertical: 8,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  transportDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  transportDetailText: {
    fontSize: 13,
    fontWeight: '500',
  },
  platformBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  platformText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bottomDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  priceBadge: {
    marginLeft: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '700',
  },
  noRoutesContainer: {
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
  },
  noRoutesText: {
    fontSize: 15,
    marginTop: 12,
    textAlign: 'center',
    marginBottom: 16,
  },
  refreshSmallButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  refreshSmallButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    marginBottom: 12,
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  backButtonAlt: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
  },
  backButtonTextAlt: {
    fontWeight: '600',
    fontSize: 16,
  },
});

export default TransportScreen;