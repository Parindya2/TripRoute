// app/stations/[type].tsx
import { useTheme } from '@/_context/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectNearbyStations } from '@/store/slices/nearbySlice1';
import { fetchAllTransportSchedules } from '@/store/slices/transportSlice';
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

const StationsScreen = () => {
  const { type } = useLocalSearchParams<{ type: 'bus' | 'train' }>();
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const dispatch = useAppDispatch();

  const nearbyStations = useAppSelector(selectNearbyStations);
  const [loadingSchedule, setLoadingSchedule] = React.useState<string | null>(null);

  // Filter stations by type
  const stations = nearbyStations.filter((s: any) => s.type === type);

  const handleViewSchedule = async (station: any) => {
    setLoadingSchedule(station.id);
    
    try {
      // Dispatch action to fetch schedules for this station
      await dispatch(fetchAllTransportSchedules({
        destinationId: station.id,
        destinationName: 'City Center', // You can make this dynamic
        stationName: station.name,
      })).unwrap();
      
      // Navigate to transport schedule screen (use typed dynamic route)
      router.push({
        pathname: '/transport/schedules',
        params: {
          destinationId: station.id,
          stationName: station.name,
          stationType: type,
        },
      });
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoadingSchedule(null);
    }
  };

  const renderStation = ({ item }: { item: any }) => (
    <View style={[styles.stationCard, { backgroundColor: colors.surface }]}>
      <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
        <Ionicons
          name={type === 'bus' ? 'bus' : 'train'}
          size={28}
          color={colors.primary}
        />
      </View>

      <View style={styles.stationInfo}>
        <Text style={[styles.stationName, { color: colors.text }]}>
          {item.name}
        </Text>
        <View style={styles.distanceRow}>
          <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.distance, { color: colors.textSecondary }]}>
            {item.distance.toFixed(2)} km away
          </Text>
        </View>
        {item.atcocode && (
          <Text style={[styles.code, { color: colors.textTertiary }]}>
            Code: {item.atcocode}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.scheduleButton, { backgroundColor: colors.primary }]}
        onPress={() => handleViewSchedule(item)}
        disabled={loadingSchedule === item.id}
      >
        {loadingSchedule === item.id ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <>
            <Ionicons name="time-outline" size={18} color="#FFF" />
            <Text style={styles.scheduleButtonText}>Schedule</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Nearby {type === 'bus' ? 'Bus Stops' : 'Train Stations'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Station Count */}
      <View style={styles.countContainer}>
        <Text style={[styles.countText, { color: colors.textSecondary }]}>
          {stations.length} {stations.length === 1 ? 'station' : 'stations'} found nearby
        </Text>
      </View>

      {/* Stations List */}
      <FlatList
        data={stations}
        keyExtractor={(item) => item.id}
        renderItem={renderStation}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name={type === 'bus' ? 'bus-outline' : 'train-outline'}
              size={64}
              color={colors.textTertiary}
            />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No {type} stations found nearby
            </Text>
          </View>
        }
      />
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  placeholder: {
    width: 40,
  },
  countContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  countText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    padding: 20,
    paddingTop: 8,
  },
  stationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stationInfo: {
    flex: 1,
  },
  stationName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  distance: {
    fontSize: 13,
  },
  code: {
    fontSize: 11,
    marginTop: 2,
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  scheduleButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
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

export default StationsScreen;