// store/slices/destinationsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UK_DESTINATIONS } from '@/services/transportAPI';

interface Destination {
  id: string;
  name: string;
  location: string;
  stationCode: string;
  latitude: number;
  longitude: number;
  rating: number;
  description: string;
  bestTime: string;
  category: string;
  image: string;
}

interface DestinationsState {
  items: Destination[];
  filteredItems: Destination[];
  selectedDestination: Destination | null;
  searchQuery: string;
  selectedCategory: string;
  loading: boolean;
  error: string | null;
}

const initialState: DestinationsState = {
  items: UK_DESTINATIONS,
  filteredItems: UK_DESTINATIONS,
  selectedDestination: null,
  searchQuery: '',
  selectedCategory: 'All',
  loading: false,
  error: null,
};

const destinationsSlice = createSlice({
  name: 'destinations',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filteredItems = filterDestinations(state.items, action.payload, state.selectedCategory);
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
      state.filteredItems = filterDestinations(state.items, state.searchQuery, action.payload);
    },
    setSelectedDestination: (state, action: PayloadAction<Destination | null>) => {
      state.selectedDestination = action.payload;
    },
    clearFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategory = 'All';
      state.filteredItems = state.items;
    },
  },
});

// Helper function to filter destinations
function filterDestinations(items: Destination[], searchQuery: string, category: string): Destination[] {
  let results = [...items];
  
  if (searchQuery.trim()) {
    const searchLower = searchQuery.toLowerCase();
    results = results.filter(d => 
      d.name.toLowerCase().includes(searchLower) ||
      d.location.toLowerCase().includes(searchLower)
    );
  }
  
  if (category !== 'All') {
    results = results.filter(d => d.category === category.toLowerCase());
  }
  
  return results;
}

export const { 
  setSearchQuery, 
  setSelectedCategory, 
  setSelectedDestination,
  clearFilters 
} = destinationsSlice.actions;

export default destinationsSlice.reducer;

// Selectors
export const selectAllDestinations = (state: any) => state.destinations.filteredItems;
export const selectSelectedDestination = (state: any) => state.destinations.selectedDestination;
export const selectSearchQuery = (state: any) => state.destinations.searchQuery;
export const selectSelectedCategory = (state: any) => state.destinations.selectedCategory;
