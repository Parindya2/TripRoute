// app/stations/[type].tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppSelector } from '@/store/hooks';
import { useTheme } from '@/app/context/ThemeContext';
import { getThemeColors } from '@/app/theme/colors';

const StationsScreen = () => {
  const router = useRouter();
  const { type } = useLocalSearchParams();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  // Get stations from Redux
  const allStations = useAppSelector(state => state.nearby.stations);

  // Filter stations by type
  const stations = allStations.filter(s => s.type === type);

  const getTitle = () => {
    switch (type) {
      case 'bus':
        return 'Bus Stations';
      case 'train':
        return 'Train Stations';
      case 'flight':
        return 'Airports';
      default:
        return 'Stations';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'bus':
        return 'bus-outline';
      case 'train':
        return 'train-outline';
      case 'flight':
        return 'airplane-outline';
      default:
        return 'location-outline';
    }
  };

  const renderStationCard = ({ item }: any) => (
    <TouchableOpacity style={[styles.stationCard, { backgroundColor: colors.surface }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
          <Ionicons name={getIcon()} size={24} color={colors.primary} />
        </View>
        <View style={styles.stationInfo}>
          <Text style={[styles.stationName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.stationAddress, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.address}
          </Text>
        </View>
        <View style={[styles.ratingContainer, { backgroundColor: isDarkMode ? '#3A3000' : '#FFF9E6' }]}>
          <Ionicons name="star" size={16} color="#FFC107" />
          <Text style={[styles.ratingText, { color: colors.textSecondary }]}>{item.rating}</Text>
        </View>
      </View>

      <View style={[styles.cardDetails, { borderBottomColor: colors.border }]}>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>{item.distance} km away</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>{item.operatingHours}</Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.viewButton, { backgroundColor: colors.primary }]}>
        <Text style={styles.viewButtonText}>View Schedules</Text>
        <Ionicons name="arrow-forward" size={16} color="#FFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{getTitle()}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Summary */}
      <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
        <View style={[styles.summaryIcon, { backgroundColor: colors.primary + '20' }]}>
          <Ionicons name={getIcon()} size={32} color={colors.primary} />
        </View>
        <View style={styles.summaryContent}>
          <Text style={[styles.summaryTitle, { color: colors.text }]}>
            {stations.length} {getTitle().toLowerCase()}
          </Text>
          <Text style={[styles.summarySubtitle, { color: colors.textSecondary }]}>
            near your location
          </Text>
        </View>
      </View>

      {/* Stations List */}
      {stations.length > 0 ? (
        <FlatList
          data={stations}
          renderItem={renderStationCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name={getIcon()} size={48} color={colors.textTertiary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No {getTitle().toLowerCase()} found
          </Text>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  summaryContent: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 13,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  stationCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stationInfo: {
    flex: 1,
  },
  stationName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  stationAddress: {
    fontSize: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
  },
  cardDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  detailText: {
    fontSize: 12,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
  },
});

export default StationsScreen;