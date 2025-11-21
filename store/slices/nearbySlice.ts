// store/slices/nearbySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NearbyStation {
  id: string;
  name: string;
  type: 'bus' | 'train' | 'flight';
  distance: number; // in km
  rating: number;
  address: string;
  operatingHours: string;
}

interface NearbyState {
  stations: NearbyStation[];
  loading: boolean;
  error: string | null;
}

const initialState: NearbyState = {
  stations: [
    {
      id: 'bus1',
      name: 'Central Bus Station',
      type: 'bus',
      distance: 2.5,
      rating: 4.2,
      address: '123 Main Street',
      operatingHours: '05:00 AM - 11:00 PM',
    },
    {
      id: 'bus2',
      name: 'Metro Bus Terminal',
      type: 'bus',
      distance: 3.8,
      rating: 4.0,
      address: '456 Park Avenue',
      operatingHours: '06:00 AM - 10:00 PM',
    },
    {
      id: 'bus3',
      name: 'North Bus Depot',
      type: 'bus',
      distance: 5.2,
      rating: 3.9,
      address: '789 North Road',
      operatingHours: '05:30 AM - 11:30 PM',
    },
    {
      id: 'train1',
      name: 'Central Railway Station',
      type: 'train',
      distance: 4.1,
      rating: 4.6,
      address: '321 Station Road',
      operatingHours: '04:30 AM - 12:00 AM',
    },
    {
      id: 'train2',
      name: 'East Railway Terminal',
      type: 'train',
      distance: 6.5,
      rating: 4.4,
      address: '654 East Lane',
      operatingHours: '05:00 AM - 11:00 PM',
    },
    {
      id: 'flight1',
      name: 'International Airport',
      type: 'flight',
      distance: 15.2,
      rating: 4.7,
      address: 'Airport Road',
      operatingHours: '24/7',
    },
    {
      id: 'flight2',
      name: 'Domestic Airport',
      type: 'flight',
      distance: 18.5,
      rating: 4.5,
      address: 'Aviation Highway',
      operatingHours: '24/7',
    },
  ],
  loading: false,
  error: null,
};

const nearbySlice = createSlice({
  name: 'nearby',
  initialState,
  reducers: {
    setStations: (state, action: PayloadAction<NearbyStation[]>) => {
      state.stations = action.payload;
      state.loading = false;
      state.error = null;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Filter stations by type
    filterByType: (state, action: PayloadAction<'bus' | 'train' | 'flight'>) => {
      // This would be handled in the component using useSelector
      // Just keeping for reference
    },

    clearNearby: (state) => {
      state.stations = [];
      state.error = null;
    },
  },
});

export const { setStations, setLoading, setError, clearNearby } = nearbySlice.actions;
export default nearbySlice.reducer;