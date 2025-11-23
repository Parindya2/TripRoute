// app/(tabs)/index.tsx 
import { useAuth } from '@/app/_context/AuthContext';
import { useTheme } from '@/app/_context/ThemeContext';
import { getThemeColors } from '@/app/theme/colors';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectAllDestinations,
  selectSearchQuery,
  selectSelectedCategory,
  setSearchQuery,
  setSelectedCategory
} from '@/store/slices/destinationsSlice';
import { toggleFavorite } from '@/store/slices/favoritesSlice';
import {
  fetchNearbyStations,
  selectNearbyLoading,
  selectNearbyStations,
  setUserLocation
} from '@/store/slices/nearbySlice1';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
  const [showSearchResults, setShowSearchResults] = React.useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const dispatch = useAppDispatch();

  // Redux state
  const destinations = useAppSelector(selectAllDestinations);
  const searchQuery = useAppSelector(selectSearchQuery);
  const selectedCategory = useAppSelector(selectSelectedCategory);
  const nearbyStations = useAppSelector(selectNearbyStations);
  const nearbyLoading = useAppSelector(selectNearbyLoading);

  // Group stations by type
  type NearbyStation = { id?: string; name?: string; type?: string; distance?: number; [key: string]: any };
  const busStations = nearbyStations.filter((s: NearbyStation) => s.type === 'bus');
  const trainStations = nearbyStations.filter((s: NearbyStation) => s.type === 'train');

  // Get user location and fetch nearby stations on mount
  useEffect(() => {
    loadUserLocation();
  }, []);

  const loadUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        
        dispatch(setUserLocation({ latitude, longitude }));
        dispatch(fetchNearbyStations({ latitude, longitude }));
      } else {
        // Use default location (London) if permission denied
        const defaultLocation = { latitude: 51.5074, longitude: -0.1278 };
        dispatch(setUserLocation(defaultLocation));
        dispatch(fetchNearbyStations(defaultLocation));
      }
    } catch (error) {
      console.error('Error loading location:', error);
      // Fallback to default location
      const defaultLocation = { latitude: 51.5074, longitude: -0.1278 };
      dispatch(setUserLocation(defaultLocation));
      dispatch(fetchNearbyStations(defaultLocation));
    }
  };

  const handleSearchChange = (text: string) => {
    dispatch(setSearchQuery(text));
    if (text.trim()) {
      setShowSearchResults(true);
    }
  };

  const handleCategoryChange = (category: string) => {
    dispatch(setSelectedCategory(category));
  };

  const handleClearSearch = () => {
    dispatch(setSearchQuery(''));
    setShowSearchResults(false);
  };

  // Get first 3 destinations for popular section
  const popularDestinations = destinations.slice(0, 3);

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']} // Only apply safe area to top
    >
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              Hello {user?.firstName || 'Traveler'},
            </Text>
            <Text style={[styles.title, { color: colors.text }]}>Travelling Today?</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
            <Image
              source={user?.image ? { uri: user.image } : require('../../assets/images/profile.jpg')}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
          <Ionicons name="search" size={20} color={colors.textTertiary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search UK Destinations"
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={handleSearchChange}
            onFocus={() => searchQuery && setShowSearchResults(true)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Search Results */}
        {showSearchResults && (
          <View style={[styles.searchResultsContainer, { backgroundColor: colors.surface }]}>
            <View style={[styles.searchResultsHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.searchResultsTitle, { color: colors.text }]}>
                {searchQuery ? 'Search Results' : 'All Destinations'}
              </Text>
              <TouchableOpacity onPress={() => setShowSearchResults(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView 
              style={styles.searchResultsList}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
            >
              {destinations.length > 0 ? (
                destinations.map((destination: any) => (
                  <SearchResultItem
                    key={destination.id}
                    destination={destination}
                    colors={colors}
                    onPress={() => {
                      setShowSearchResults(false);
                      router.push({
                        pathname: '/destination/[id]',
                        params: { id: destination.id },
                      })
                    }}
                  />
                ))
              ) : (
                <View style={styles.noResults}>
                  <Text style={[styles.noResultsText, { color: colors.textTertiary }]}>
                    No destinations found
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        )}

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <CategoryButton
            icon=""
            label="All"
            selected={selectedCategory === 'All'}
            colors={colors}
            onPress={() => handleCategoryChange('All')}
          />
          <CategoryButton
            icon="🏖️"
            label="Beach"
            selected={selectedCategory === 'Beach'}
            colors={colors}
            onPress={() => handleCategoryChange('Beach')}
          />
          <CategoryButton
            icon="🏙️"
            label="City"
            selected={selectedCategory === 'City'}
            colors={colors}
            onPress={() => handleCategoryChange('City')}
          />
        </View>

        {/* Popular Destinations Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular UK Destinations</Text>
          <TouchableOpacity onPress={() => router.push('/destinations/all')}>
            <Text style={[styles.viewAll, { color: colors.primary }]}>View all</Text>
          </TouchableOpacity>
        </View>

        {/* Destination Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.destinationsScroll}
        >
          {popularDestinations.map((destination: any) => (
            <DestinationCard 
              key={destination.id} 
              destination={destination} 
              colors={colors} 
            />
          ))}
        </ScrollView>

        {/* Near By From You Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Near By From You</Text>
          <TouchableOpacity onPress={loadUserLocation}>
            <Ionicons name="refresh" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {nearbyLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Finding nearby stations...
            </Text>
          </View>
        ) : (
          <View style={styles.nearbyContainer}>
            <NearbyCard
              icon="bus-outline"
              label="Bus Stops"
              count={busStations.length}
              stations={busStations}
              colors={colors}
              onPress={() => router.push({
                pathname: '/stations/[type]',
                params: { type: 'bus' }
              })}
            />
            <NearbyCard
              icon="train-outline"
              label="Train Stations"
              count={trainStations.length}
              stations={trainStations}
              colors={colors}
              onPress={() => router.push({
                pathname: '/stations/[type]',
                params: { type: 'train' }
              })}
            />
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Search Result Item Component
const SearchResultItem = ({ destination, colors, onPress }: any) => {
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector(state => state.favorites.items);
  const isFavorite = favoriteIds.includes(destination.id);

  const handleToggleFavorite = (e: any) => {
    e.stopPropagation();
    dispatch(toggleFavorite(destination.id));
  };

  return (
    <TouchableOpacity 
      style={[styles.searchResultItem, { borderBottomColor: colors.border }]} 
      onPress={onPress}
    >
      <Image source={{ uri: destination.image }} style={styles.searchResultImage} />
      <View style={styles.searchResultInfo}>
        <Text style={[styles.searchResultName, { color: colors.text }]}>
          {destination.name}
        </Text>
        <View style={styles.searchResultLocation}>
          <Ionicons name="location-outline" size={14} color={colors.primary} />
          <Text style={[styles.searchResultLocationText, { color: colors.textSecondary }]}>
            {destination.location}
          </Text>
        </View>
      </View>
      <View style={styles.searchResultRight}>
        <View style={[styles.searchResultRating, { backgroundColor: colors.primary + '20' }]}>
          <Ionicons name="star" size={14} color="#FFC107" />
          <Text style={[styles.searchResultRatingText, { color: colors.text }]}>
            {destination.rating}
          </Text>
        </View>
        <TouchableOpacity onPress={handleToggleFavorite} style={styles.searchFavoriteButton}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={20}
            color={isFavorite ? "#FF6B6B" : colors.textTertiary}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

// Category Button Component
const CategoryButton = ({ icon, label, selected, colors, onPress }: any) => (
  <TouchableOpacity
    style={[
      styles.categoryButton,
      {
        backgroundColor: selected ? colors.primary + '20' : colors.surface,
        borderColor: selected ? colors.primary : 'transparent',
        borderWidth: selected ? 1 : 0,
      }
    ]}
    onPress={onPress}
  >
    {icon && <Text style={styles.categoryIcon}>{icon}</Text>}
    <Text style={[styles.categoryLabel, { color: selected ? colors.primary : colors.textSecondary }]}>
      {label}
    </Text>
  </TouchableOpacity>
);

// Destination Card Component
const DestinationCard = ({ destination, colors }: { destination: any; colors: any }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector(state => state.favorites.items);
  const isFavorite = favoriteIds.includes(destination.id);

  const handleToggleFavorite = (e: any) => {
    e.stopPropagation();
    dispatch(toggleFavorite(destination.id));
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={() =>
        router.push({
          pathname: "/destination/[id]",
          params: { id: String(destination.id) },
        })
      }
    >
      <Image source={{ uri: destination.image }} style={styles.cardImage} />

      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={handleToggleFavorite}
      >
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={20}
          color={isFavorite ? "#FF6B6B" : "#FFF"}
        />
      </TouchableOpacity>

      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
          {destination.name}
        </Text>
        <View style={styles.cardFooter}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={14} color={colors.primary} />
            <Text style={[styles.locationText, { color: colors.textSecondary }]} numberOfLines={1}>
              {destination.location}
            </Text>
          </View>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFC107" />
            <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
              {destination.rating}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Nearby Card Component
const NearbyCard = ({ icon, label, count, stations, colors, onPress }: any) => (
  <TouchableOpacity 
    style={[styles.nearbyCard, { backgroundColor: colors.surface }]} 
    onPress={onPress}
  >
    <View style={[styles.nearbyIcon, { backgroundColor: colors.primary + '20' }]}>
      <Ionicons name={icon} size={28} color={colors.primary} />
    </View>
    <Text style={[styles.nearbyLabel, { color: colors.text }]}>{label}</Text>
    <Text style={[styles.nearbyCount, { color: colors.primary }]}>
      {count} nearby
    </Text>

    {/* Show first station preview */}
    {stations && stations.length > 0 && (
      <View style={[styles.stationPreview, { borderTopColor: colors.border }]}>
        <Text style={[styles.stationName, { color: colors.text }]} numberOfLines={1}>
          {stations[0].name}
        </Text>
        <Text style={[styles.stationDistance, { color: colors.textSecondary }]}>
          {stations[0].distance.toFixed(2)} km away
        </Text>
      </View>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16, // Reduced from 25 since SafeAreaView handles the top now
    paddingBottom: 15,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 15,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  searchResultsContainer: {
    position: 'absolute',
    top: 140,
    left: 20,
    right: 20,
    bottom: 100, // Leave space for keyboard and tab bar
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
  },
  searchResultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
  },
  searchResultsTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  searchResultsList: {
    flex: 1,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
  },
  searchResultImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
  },
  searchResultInfo: {
    flex: 1,
    marginLeft: 12,
  },
  searchResultName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  searchResultLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  searchResultLocationText: {
    fontSize: 13,
  },
  searchResultRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  searchResultRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  searchResultRatingText: {
    fontSize: 13,
    fontWeight: '600',
  },
  searchFavoriteButton: {
    padding: 4,
  },
  noResults: {
    padding: 40,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 15,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '500',
  },
  destinationsScroll: {
    paddingHorizontal: 20,
    gap: 15,
  },
  card: {
    width: 220,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  cardImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#E0E0E0',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    marginRight: 8,
  },
  locationText: {
    fontSize: 12,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  nearbyContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  nearbyCard: {
    flex: 1,
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  nearbyIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  nearbyLabel: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  nearbyCount: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  stationPreview: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    width: '100%',
  },
  stationName: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  stationDistance: {
    fontSize: 10,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default HomeScreen;