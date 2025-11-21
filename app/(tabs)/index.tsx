// app/(tabs)/index.tsx 
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/app/context/AuthContext';
import { useTheme } from '@/app/context/ThemeContext';
import { getThemeColors } from '@/app/theme/colors';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleFavorite } from '@/store/slices/favoritesSlice';

interface Destination {
  id: string;
  name: string;
  location: string;
  rating: number;
  image: any;
}

interface Transport {
  id: string;
  name: string;
  type: 'bus' | 'train' | 'flight';
  price: number;
  duration: string;
  departure: string;
  rating: number;
}

interface TrendingRoute {
  id: string;
  from: string;
  to: string;
  travelers: number;
  image: any;
}

const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showSearchResults, setShowSearchResults] = React.useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);

  // Get nearby stations from Redux
  const nearbyStations = useAppSelector(state => state.nearby.stations);

  // Group stations by type
  const busStations = nearbyStations.filter(s => s.type === 'bus');
  const trainStations = nearbyStations.filter(s => s.type === 'train');
  const flightStations = nearbyStations.filter(s => s.type === 'flight');

  const allDestinations: Destination[] = [
    {
      id: '1',
      name: 'St. Regis Bora Bora',
      location: 'French Polynesia',
      rating: 4.8,
      image: require('../../assets/images/image1.jpg'),
    },
    {
      id: '2',
      name: 'St. Regis Bora',
      location: 'French Polynesia',
      rating: 4.8,
      image: require('../../assets/images/image2.jpg'),
    },
    {
      id: '3',
      name: 'Santorini',
      location: 'Greece',
      rating: 4.8,
      image: require('../../assets/images/image3.jpg'),
    },
    {
      id: '4',
      name: 'Maldives Resort',
      location: 'Maldives',
      rating: 4.9,
      image: require('../../assets/images/image1.jpg'),
    },
    {
      id: '5',
      name: 'Bali Paradise',
      location: 'Indonesia',
      rating: 4.7,
      image: require('../../assets/images/image2.jpg'),
    },
    {
      id: '6',
      name: 'Dubai Marina',
      location: 'UAE',
      rating: 4.6,
      image: require('../../assets/images/image3.jpg'),
    },
    {
      id: '7',
      name: 'Swiss Alps',
      location: 'Switzerland',
      rating: 4.9,
      image: require('../../assets/images/image1.jpg'),
    },
    {
      id: '8',
      name: 'Tokyo Tower',
      location: 'Japan',
      rating: 4.8,
      image: require('../../assets/images/image2.jpg'),
    },
  ];

  const destinations: Destination[] = allDestinations.slice(0, 3);

  const transportOptions: Transport[] = [
    {
      id: 't1',
      name: 'Express Coach',
      type: 'bus',
      price: 25,
      duration: '4h 30m',
      departure: '08:00 AM',
      rating: 4.5,
    },
    {
      id: 't2',
      name: 'Rapid Train',
      type: 'train',
      price: 45,
      duration: '3h 15m',
      departure: '09:30 AM',
      rating: 4.7,
    },
    {
      id: 't3',
      name: 'Direct Flight',
      type: 'flight',
      price: 120,
      duration: '1h 45m',
      departure: '11:00 AM',
      rating: 4.8,
    },
  ];

  const trendingRoutes: TrendingRoute[] = [
    {
      id: 'tr1',
      from: 'New York',
      to: 'Miami',
      travelers: 1234,
      image: require('../../assets/images/image1.jpg'),
    },
    {
      id: 'tr2',
      from: 'London',
      to: 'Paris',
      travelers: 2105,
      image: require('../../assets/images/image2.jpg'),
    },
    {
      id: 'tr3',
      from: 'Tokyo',
      to: 'Kyoto',
      travelers: 892,
      image: require('../../assets/images/image3.jpg'),
    },
  ];

  const filteredDestinations = searchQuery.trim()
    ? allDestinations.filter((dest) =>
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allDestinations;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              Hello {user?.firstName || 'Traveler'},
            </Text>
            <Text style={[styles.title, { color: colors.text }]}>Travelling Today ?</Text>
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
            placeholder="Search Destination"
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setShowSearchResults(true)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => {
              setSearchQuery('');
              setShowSearchResults(false);
            }}>
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
            <ScrollView style={styles.searchResultsList}>
              {filteredDestinations.length > 0 ? (
                filteredDestinations.map((destination) => (
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
                  <Text style={[styles.noResultsText, { color: colors.textTertiary }]}>No destinations found</Text>
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
            onPress={() => setSelectedCategory('All')}
          />
          <CategoryButton
            icon="🏖️"
            label="Beach"
            selected={selectedCategory === 'Beach'}
            colors={colors}
            onPress={() => setSelectedCategory('Beach')}
          />
          <CategoryButton
            icon="⛰️"
            label="Mountain"
            selected={selectedCategory === 'Mountain'}
            colors={colors}
            onPress={() => setSelectedCategory('Mountain')}
          />
          <CategoryButton
            icon="🏕️"
            label="Camping"
            selected={selectedCategory === 'Camping'}
            colors={colors}
            onPress={() => setSelectedCategory('Camping')}
          />
        </View>

        {/* Popular Destination Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular Destination</Text>
          <TouchableOpacity>
            <Text style={[styles.viewAll, { color: colors.primary }]}>View all</Text>
          </TouchableOpacity>
        </View>

        {/* Destination Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.destinationsScroll}
        >
          {destinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} colors={colors} />
          ))}
        </ScrollView>


        {/* Trending Routes */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Trending Routes</Text>
          <TouchableOpacity>
            <Text style={[styles.viewAll, { color: colors.primary }]}>View all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trendingScroll}
        >
          {trendingRoutes.map((route) => (
            <TrendingRouteCard key={route.id} route={route} />
          ))}
        </ScrollView>

  
        {/* Near By From You Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Near By From You</Text>
          <TouchableOpacity>
            <Text style={[styles.viewAll, { color: colors.primary }]}>View all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.nearbyContainer}>
          <NearbyCard
            icon="bus-outline"
            label="Bus Stations"
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
          <NearbyCard
            icon="airplane-outline"
            label="Airports"
            count={flightStations.length}
            stations={flightStations}
            colors={colors}
            onPress={() => router.push({
              pathname: '/stations/[type]',
              params: { type: 'flight' }
            })}
          />
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Transport Card Component
const TransportCard = ({ transport, colors }: { transport: Transport; colors: any }) => {
  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'bus':
        return 'bus-outline';
      case 'train':
        return 'train-outline';
      case 'flight':
        return 'airplane-outline';
      default:
        return 'car-outline';
    }
  };

  return (
    <TouchableOpacity style={[styles.transportCard, { backgroundColor: colors.surface }]}>
      <View style={styles.transportHeader}>
        <View style={[styles.transportIcon, { backgroundColor: colors.primary + '20' }]}>
          <Ionicons name={getTransportIcon(transport.type)} size={24} color={colors.primary} />
        </View>
        <View style={styles.transportInfo}>
          <Text style={[styles.transportName, { color: colors.text }]}>{transport.name}</Text>
          <Text style={[styles.transportTime, { color: colors.textSecondary }]}>{transport.departure}</Text>
        </View>
      </View>
      <View style={styles.transportDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>{transport.duration}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="star" size={14} color="#FFC107" />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>{transport.rating}</Text>
        </View>
      </View>
      <View style={styles.transportPrice}>
        <Text style={[styles.priceLabel, { color: colors.textTertiary }]}>From</Text>
        <Text style={[styles.priceAmount, { color: colors.primary }]}>${transport.price}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Trending Route Card Component
const TrendingRouteCard = ({ route }: { route: TrendingRoute }) => (
  <TouchableOpacity style={styles.trendingCard}>
    <Image source={route.image} style={styles.trendingImage} />
    <View style={styles.trendingOverlay} />
    <View style={styles.trendingContent}>
      <Text style={styles.trendingRoute}>{route.from} → {route.to}</Text>
      <View style={styles.travelersBadge}>
        <Ionicons name="people-outline" size={12} color="#FFF" />
        <Text style={styles.travelersText}>{route.travelers} travelers</Text>
      </View>
    </View>
  </TouchableOpacity>
);

// Nearby Card Component
const NearbyCard = ({ icon, label, count, stations, colors, onPress }: any) => (
  <TouchableOpacity style={[styles.nearbyCard, { backgroundColor: colors.surface }]} onPress={onPress}>
    <View style={[styles.nearbyIcon, { backgroundColor: colors.primary + '20' }]}>
      <Ionicons name={icon} size={28} color={colors.primary} />
    </View>
    <Text style={[styles.nearbyLabel, { color: colors.text }]}>{label}</Text>
    <Text style={[styles.nearbyCount, { color: colors.primary }]}>{count} nearby</Text>

    {/* Show first station preview */}
    {stations && stations.length > 0 && (
      <View style={[styles.stationPreview, { borderTopColor: colors.border }]}>
        <Text style={[styles.stationName, { color: colors.text }]} numberOfLines={1}>
          {stations[0].name}
        </Text>
        <Text style={[styles.stationDistance, { color: colors.textSecondary }]}>
          {stations[0].distance} km away
        </Text>
      </View>
    )}
  </TouchableOpacity>
);

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
    <TouchableOpacity style={[styles.searchResultItem, { borderBottomColor: colors.border }]} onPress={onPress}>
      <Image source={destination.image} style={styles.searchResultImage} />
      <View style={styles.searchResultInfo}>
        <Text style={[styles.searchResultName, { color: colors.text }]}>{destination.name}</Text>
        <View style={styles.searchResultLocation}>
          <Ionicons name="location-outline" size={14} color={colors.primary} />
          <Text style={[styles.searchResultLocationText, { color: colors.textSecondary }]}>{destination.location}</Text>
        </View>
      </View>
      <View style={styles.searchResultRight}>
        <View style={[styles.searchResultRating, { backgroundColor: colors.primary + '20' }]}>
          <Ionicons name="star" size={14} color="#FFC107" />
          <Text style={[styles.searchResultRatingText, { color: colors.text }]}>{destination.rating}</Text>
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
      }
    ]}
    onPress={onPress}
  >
    <Text style={styles.categoryIcon}>{icon}</Text>
    <Text style={[styles.categoryLabel, { color: selected ? colors.primary : colors.textSecondary }]}>
      {label}
    </Text>
  </TouchableOpacity>
);

// Destination Card Component
const DestinationCard = ({ destination, colors }: { destination: Destination; colors: any }) => {
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
      <Image source={destination.image} style={styles.cardImage} />

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
        <Text style={[styles.cardTitle, { color: colors.text }]}>{destination.name}</Text>
        <View style={styles.cardFooter}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={14} color={colors.primary} />
            <Text style={[styles.locationText, { color: colors.textSecondary }]}>{destination.location}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFC107" />
            <Text style={[styles.ratingText, { color: colors.textSecondary }]}>{destination.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 15,
  },
  greeting: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
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
    backgroundColor: '#FFF',
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
    color: '#000',
  },
  searchResultsContainer: {
    position: 'absolute',
    top: 140,
    left: 20,
    right: 20,
    backgroundColor: '#FFF',
    borderRadius: 12,
    maxHeight: 500,
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
    borderBottomColor: '#F0F0F0',
  },
  searchResultsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  searchResultsList: {
    maxHeight: 400,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
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
    color: '#000',
    marginBottom: 4,
  },
  searchResultLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  searchResultLocationText: {
    fontSize: 13,
    color: '#666',
  },
  searchResultRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  searchResultRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  searchResultRatingText: {
    fontSize: 13,
    color: '#666',
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
    color: '#999',
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
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryButtonSelected: {
    backgroundColor: '#E0F7FA',
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  categoryLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryLabelSelected: {
    color: '#00BCD4',
    fontWeight: '600',
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
    color: '#000',
  },
  viewAll: {
    fontSize: 14,
    color: '#00BCD4',
    fontWeight: '500',
  },
  destinationsScroll: {
    paddingHorizontal: 20,
    gap: 15,
  },
  card: {
    width: 220,
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
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
    color: '#000',
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
  },
  locationText: {
    fontSize: 12,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  transportContainer: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 10,
  },
  transportCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  transportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  transportIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#E0F7FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transportInfo: {
    flex: 1,
  },
  transportName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  transportTime: {
    fontSize: 13,
    color: '#666',
  },
  transportDetails: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
  },
  transportPrice: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 11,
    color: '#999',
  },
  priceAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00BCD4',
  },
  trendingScroll: {
    paddingHorizontal: 20,
    gap: 15,
  },
  trendingCard: {
    width: 180,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  trendingImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
  trendingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  trendingContent: {
    ...StyleSheet.absoluteFillObject,
    padding: 12,
    justifyContent: 'flex-end',
  },
  trendingRoute: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 6,
  },
  travelersBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  travelersText: {
    fontSize: 11,
    color: '#FFF',
    fontWeight: '500',
  },
  nearbyContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  nearbyCard: {
    flex: 1,
    backgroundColor: '#FFF',
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
    backgroundColor: '#E0F7FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  nearbyLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 4,
  },
  nearbyCount: {
    fontSize: 12,
    color: '#00BCD4',
    fontWeight: '500',
    marginBottom: 8,
  },
  stationPreview: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    width: '100%',
  },
  stationName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  stationDistance: {
    fontSize: 10,
    color: '#666',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default HomeScreen;