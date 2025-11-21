
// store/slices/favoritesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Destination {
  id: string;
  name: string;
  location: string;
  rating: number;
  image: any;
}

interface FavoritesState {
  items: string[]; // Array of destination IDs
  loading: boolean;
}

const initialState: FavoritesState = {
  items: [],
  loading: false,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    // Add a favorite
    addFavorite: (state, action: PayloadAction<string>) => {
      if (!state.items.includes(action.payload)) {
        state.items.push(action.payload);
        // Persist to AsyncStorage
        AsyncStorage.setItem('favorites', JSON.stringify(state.items));
      }
    },
    
    // Remove a favorite
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(id => id !== action.payload);
      // Persist to AsyncStorage
      AsyncStorage.setItem('favorites', JSON.stringify(state.items));
    },
    
    // Toggle favorite (add if not exists, remove if exists)
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const index = state.items.indexOf(action.payload);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
      // Persist to AsyncStorage
      AsyncStorage.setItem('favorites', JSON.stringify(state.items));
    },
    
    // Load favorites from AsyncStorage
    loadFavorites: (state, action: PayloadAction<string[]>) => {
      state.items = action.payload;
      state.loading = false;
    },
    
    // Clear all favorites
    clearFavorites: (state) => {
      state.items = [];
      AsyncStorage.removeItem('favorites');
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  addFavorite,
  removeFavorite,
  toggleFavorite,
  loadFavorites,
  clearFavorites,
  setLoading,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;