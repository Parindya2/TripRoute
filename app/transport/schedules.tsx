// app/transport/schedules.tsx
import { useTheme } from '@/_context/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectCurrentDestination,
  selectSelectedType,
  selectTransportError,
  selectTransportLoading,
  selectTransportRoutes,
  setSelectedType,
} from '@/store/slices/transportSlice';
import { getThemeColors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TransportSchedulesScreen = () => {
  const { stationName, stationType } = useLocalSearchParams<{ 
    stationName: string; 
    stationType: 'bus' | 'train' 
  }>();
  
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const dispatch = useAppDispatch();

  // Redux state
  const selectedType = useAppSelector(selectSelectedType);
  const trainRoutes = useAppSelector(state => selectTransportRoutes(state, 'train'));
  const busRoutes = useAppSelector(state => selectTransportRoutes(state, 'bus'));
  const loading = useAppSelector(selectTransportLoading);
  const error = useAppSelector(selectTransportError);
  const currentDestination = useAppSelector(selectCurrentDestination);

  const currentRoutes = selectedType === 'bus' ? busRoutes : trainRoutes;

  // Set the initial type based on what was clicked
  React.useEffect(() => {
    if (stationType) {
      dispatch(setSelectedType(stationType));
    }
  }, [stationType]);

  const renderRoute = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.routeCard, { backgroundColor: colors.surface }]}
      onPress={() => {
        // You can add navigation to detailed route view if needed
      }}
    >
      <View style={styles.routeHeader}>
        <View style={[styles.typeIcon, { backgroundColor: colors.primary + '20' }]}>
          <Ionicons
            name={item.type === 'bus' ? 'bus' : 'train'}
            size={24}
            color={colors.primary}
          />
        </View>
        <View style={styles.routeMainInfo}>
          <Text style={[styles.vehicleName, { color: colors.text }]} numberOfLines={1}>
            {item.vehicleName}
          </Text>
          <Text style={[styles.operator, { color: colors.textSecondary }]}>
            {item.operator} • {item.vehicleNumber}
          </Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: colors.primary }]}>
            £{item.price}
          </Text>
        </View>
      </View>

      <View style={styles.routeDetails}>
        <View style={styles.timelineContainer}>
          {/* Departure */}
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: colors.primary }]} />
            <View style={styles.timelineContent}>
              <Text style={[styles.time, { color: colors.text }]}>
                {item.departureTime}
              </Text>
              <Text style={[styles.location, { color: colors.textSecondary }]} numberOfLines={1}>
                {item.departureLocation}
              </Text>
            </View>
          </View>

          {/* Duration */}
          <View style={styles.timelineLine}>
            <View style={[styles.durationLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.duration, { color: colors.textTertiary }]}>
              {item.duration}
            </Text>
          </View>

          {/* Arrival */}
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: colors.primary, opacity: 0.5 }]} />
            <View style={styles.timelineContent}>
              <Text style={[styles.time, { color: colors.text }]}>
                {item.arrivalTime}
              </Text>
              <Text style={[styles.location, { color: colors.textSecondary }]} numberOfLines={1}>
                {item.arrivalLocation}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.routeFooter}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { 
            backgroundColor: item.status?.includes('Delayed') ? '#FF6B6B' : '#4CAF50' 
          }]} />
          <Text style={[styles.status, { color: colors.textSecondary }]}>
            {item.status || 'On time'}
          </Text>
        </View>
        {item.platform && (
          <Text style={[styles.platform, { color: colors.textSecondary }]}>
            Platform {item.platform}
          </Text>
        )}
        <View style={styles.rating}>
          <Ionicons name="star" size={14} color="#FFC107" />
          <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
            {item.rating.toFixed(1)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Schedules
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {stationName}
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Type Selector */}
      <View style={styles.typeSelectorContainer}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            {
              backgroundColor: selectedType === 'train' ? colors.primary : colors.surface,
              borderColor: selectedType === 'train' ? colors.primary : colors.border,
            },
          ]}
          onPress={() => dispatch(setSelectedType('train'))}
        >
          <Ionicons
            name="train"
            size={20}
            color={selectedType === 'train' ? '#FFF' : colors.textSecondary}
          />
          <Text
            style={[
              styles.typeButtonText,
              { color: selectedType === 'train' ? '#FFF' : colors.textSecondary },
            ]}
          >
            Train ({trainRoutes.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeButton,
            {
              backgroundColor: selectedType === 'bus' ? colors.primary : colors.surface,
              borderColor: selectedType === 'bus' ? colors.primary : colors.border,
            },
          ]}
          onPress={() => dispatch(setSelectedType('bus'))}
        >
          <Ionicons
            name="bus"
            size={20}
            color={selectedType === 'bus' ? '#FFF' : colors.textSecondary}
          />
          <Text
            style={[
              styles.typeButtonText,
              { color: selectedType === 'bus' ? '#FFF' : colors.textSecondary },
            ]}
          >
            Bus ({busRoutes.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Loading State */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading schedules...
          </Text>
        </View>
      )}

      {/* Error State */}
      {error && !loading && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#FF6B6B" />
          <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
        </View>
      )}

      {/* Routes List */}
      {!loading && !error && (
        <FlatList
          data={currentRoutes}
          keyExtractor={(item) => item.id}
          renderItem={renderRoute}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name={selectedType === 'bus' ? 'bus-outline' : 'train-outline'}
                size={64}
                color={colors.textTertiary}
              />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No {selectedType} schedules available
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  typeSelectorContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
    paddingTop: 0,
  },
  routeCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  routeMainInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  operator: {
    fontSize: 13,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
  },
  routeDetails: {
    marginBottom: 12,
  },
  timelineContainer: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
  },
  time: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
  },
  timelineLine: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
    paddingVertical: 8,
  },
  durationLine: {
    width: 2,
    height: 24,
    marginRight: 10,
  },
  duration: {
    fontSize: 12,
  },
  routeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  status: {
    fontSize: 13,
  },
  platform: {
    fontSize: 13,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
});

export default TransportSchedulesScreen;