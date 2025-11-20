
// app/(tabs)/favorites.tsx 
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useTheme } from '@/app/context/ThemeContext';
import { getThemeColors } from '@/app/theme/colors';
import { removeFavorite } from '@/store/slices/favoritesSlice';
import { destinations } from '../data/destinations';

export default function FavoritesScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  
  // Get favorites from Redux store
  const favoriteIds = useAppSelector(state => state.favorites.items);
  
  // Filter destinations to get only favorites
  const favoriteDestinations = destinations.filter(dest => 
    favoriteIds.includes(dest.id)
  );

  const handleRemoveFavorite = (id: string) => {
    dispatch(removeFavorite(id));
  };

  const renderFavoriteCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={() => router.push(`/destination/${item.id}`)}
    >
      <Image source={item.image} style={styles.cardImage} />
      
      {/* Favorite Icon */}
      <TouchableOpacity
        style={[styles.favoriteIcon, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.6)' : 'rgba(255, 255, 255, 0.9)' }]}
        onPress={(e) => {
          e.stopPropagation();
          handleRemoveFavorite(item.id);
        }}
      >
        <Ionicons name="heart" size={20} color="#FF6B6B" />
      </TouchableOpacity>

      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.cardFooter}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={14} color={colors.primary} />
            <Text style={[styles.locationText, { color: colors.textSecondary }]} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFC107" />
            <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
              {item.rating}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons 
        name="heart-outline" 
        size={80} 
        color={isDarkMode ? '#444' : '#E0E0E0'} 
      />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No Favorites Yet</Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Start adding destinations to your favorites by tapping the heart icon
      </Text>
      <TouchableOpacity
        style={[styles.exploreButton, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/')}
      >
        <Text style={styles.exploreButtonText}>Explore Destinations</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Favorites</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          {favoriteDestinations.length} {favoriteDestinations.length === 1 ? 'destination' : 'destinations'}
        </Text>
      </View>

      {/* Favorites List */}
      <FlatList
        data={favoriteDestinations}
        renderItem={renderFavoriteCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: '48%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#E0E0E0',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
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
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
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
    fontSize: 11,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  exploreButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});