// store/slices/nearbySlice1.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import mockTransportService from '@/services/api/mockTransportService';  

interface NearbyStation {
  id: string;
  name: string;
  type: 'bus' | 'train';
  distance: number;
  latitude: number;
  longitude: number;
  atcocode?: string;  
}

interface NearbyState {
  stations: NearbyStation[];
  loading: boolean;
  error: string | null;
  userLocation: { latitude: number; longitude: number } | null;
}

const initialState: NearbyState = {
  stations: [],
  loading: false,
  error: null,
  userLocation: null,
};

export const fetchNearbyStations = createAsyncThunk(
  'nearby/fetchStations',
  async ({ latitude, longitude }: { latitude: number; longitude: number }) => {
    //  Use mock data instead of real API
    const trainStations = mockTransportService.generateMockNearbyStations(
      latitude, 
      longitude, 
      'train'
    );
    
    const busStops = mockTransportService.generateMockNearbyStations(
      latitude, 
      longitude, 
      'bus'
    );

    // Combine and return all stations
    const allStations = [...trainStations, ...busStops];
    
    // Sort by distance
    return allStations.sort((a, b) => a.distance - b.distance);
  }
);

const nearbySlice1 = createSlice({
  name: 'nearby',
  initialState,
  reducers: {
    setUserLocation: (state, action) => {
      state.userLocation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNearbyStations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNearbyStations.fulfilled, (state, action) => {
        state.loading = false;
        state.stations = action.payload;
      })
      .addCase(fetchNearbyStations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch nearby stations';
      });
  },
});

export const { setUserLocation } = nearbySlice1.actions;
export default nearbySlice1.reducer;

// Selectors
export const selectNearbyStations = (state: any) => state.nearby1.stations;
export const selectNearbyLoading = (state: any) => state.nearby1.loading;
export const selectNearbyError = (state: any) => state.nearby1.error;
export const selectUserLocation = (state: any) => state.nearby1.userLocation;