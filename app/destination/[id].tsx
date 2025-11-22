// app/destination/[id].tsx
import { useTheme } from "@/app/_context/ThemeContext";
import { getThemeColors } from "@/app/theme/colors";
import { UK_DESTINATIONS } from '@/services/transportAPI';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleFavorite } from '@/store/slices/favoritesSlice';
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get('window');

const DestinationDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { isDarkMode } = useTheme();
  const colors = getThemeColors(isDarkMode);
  const dispatch = useAppDispatch();
  
  // Get favorite status from Redux
  const favorites = useAppSelector(state => state.favorites.items);
  const isFavorite = favorites.includes(String(id));

  // Find destination by id
  const destination = UK_DESTINATIONS.find((d) => d.id === id);

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(String(id)));
  };

  if (!destination) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Destination not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={[styles.errorButton, { backgroundColor: colors.primary }]}>
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Image with rounded bottom corners */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: destination.image }} style={styles.image} />
          
          {/* Back Button */}
          <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Favorite Button */}
          <TouchableOpacity 
            style={styles.favoriteIcon} 
            onPress={handleToggleFavorite}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? "#FF6B6B" : "#fff"} 
            />
          </TouchableOpacity>
        </View>

        {/* Content Card with rounded top corners */}
        <View style={[styles.contentCard, { backgroundColor: colors.surface }]}>
          {/* Title and Location */}
          <View style={styles.headerRow}>
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: colors.text }]}>{destination.name}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={14} color={colors.primary} />
                <Text style={[styles.locationText, { color: colors.textSecondary }]}>{destination.location}</Text>
              </View>
            </View>

            {/* Rating Badge */}
            <View style={[styles.ratingBadge, { backgroundColor: isDarkMode ? '#2C2C2C' : '#FFF9E6' }]}>
              <Ionicons name="star" size={14} color="#FFC107" />
              <Text style={[styles.ratingText, { color: isDarkMode ? colors.text : '#333' }]}>{destination.rating}</Text>
            </View>
          </View>

          {/* Overview Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Overview</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>{destination.description}</Text>
          </View>

          {/* Best Time Section */}
          <View style={styles.section}>
            <Text style={[styles.bestTimeLabel, { color: colors.textSecondary }]}>Best Time to Visit: {destination.bestTime}</Text>
          </View>

          {/* How to get there Button */}
          <TouchableOpacity
            style={[styles.bookButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push(`/transport/${id}`)}>
            <Text style={styles.bookButtonText}>How to get there</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default DestinationDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    width: width,
    height: 450,
    position: 'relative',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backIcon: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteIcon: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentCard: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginHorizontal: 20,
    marginTop: -30,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 30,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 13,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  bestTimeLabel: {
    fontSize: 14,
    lineHeight: 22,
  },
  bookButton: {
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bookButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 20,
  },
  errorButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  errorButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});