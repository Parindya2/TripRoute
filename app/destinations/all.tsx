// app/destinations/all.tsx
import { useTheme } from '@/_context/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectAllDestinations,
  selectSearchQuery,
  selectSelectedCategory,
  setSearchQuery,
  setSelectedCategory
} from '@/store/slices/destinationsSlice';
import { toggleFavorite } from '@/store/slices/favoritesSlice';
import { getThemeColors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AllDestinationsScreen = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const dispatch = useAppDispatch();

  const destinations = useAppSelector(selectAllDestinations);
  const searchQuery = useAppSelector(selectSearchQuery);
  const selectedCategory = useAppSelector(selectSelectedCategory);

  const handleSearchChange = (text: string) => {
    dispatch(setSearchQuery(text));
  };

  const handleCategoryChange = (category: string) => {
    dispatch(setSelectedCategory(category));
  };

  const handleClearSearch = () => {
    dispatch(setSearchQuery(''));
  };

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          All Destinations
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <Ionicons name="search" size={20} color={colors.textTertiary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search destinations..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch}>
            <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

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

      {/* Results Count */}
      <View style={styles.resultsCount}>
        <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
          {destinations.length} {destinations.length === 1 ? 'destination' : 'destinations'} found
        </Text>
      </View>

      {/* Destinations Grid */}
      <FlatList
        data={destinations}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <DestinationGridItem destination={item} colors={colors} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="location-outline" size={64} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No destinations found
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
              Try adjusting your search or filters
            </Text>
          </View>
        }
      />
    </SafeAreaView>
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

// Grid Item Component
const DestinationGridItem = ({ destination, colors }: any) => {
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
      style={[styles.gridItem, { backgroundColor: colors.surface }]}
      onPress={() =>
        router.push({
          pathname: "/destination/[id]",
          params: { id: String(destination.id) },
        })
      }
    >
      <Image source={{ uri: destination.image }} style={styles.gridImage} />

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

      <View style={styles.gridContent}>
        <Text style={[styles.gridTitle, { color: colors.text }]} numberOfLines={1}>
          {destination.name}
        </Text>
        <View style={styles.gridFooter}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={12} color={colors.primary} />
            <Text style={[styles.locationText, { color: colors.textSecondary }]} numberOfLines={1}>
              {destination.location}
            </Text>
          </View>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#FFC107" />
            <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
              {destination.rating}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 16,
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
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
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
  resultsCount: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  resultsText: {
    fontSize: 14,
    fontWeight: '500',
  },
  gridContainer: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gridItem: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gridImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#E0E0E0',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContent: {
    padding: 12,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  gridFooter: {
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
    flex: 1,
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
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
  },
});

export default AllDestinationsScreen;