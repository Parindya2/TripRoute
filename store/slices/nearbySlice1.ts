// store/slices/nearbySlice1.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import transportAPI from '@/services/transportAPI';

interface NearbyStation {
  id: string;
  name: string;
  type: 'bus' | 'train';
  distance: number;
  latitude: number;
  longitude: number;
  code: string; // station code or atcocode
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
    // Fetch both train stations and bus stops
    const [trainStations, busStops] = await Promise.all([
      transportAPI.findNearbyStops(latitude, longitude, 'train_station'),
      transportAPI.findNearbyStops(latitude, longitude, 'bus_stop'),
    ]);

    const stations: NearbyStation[] = [];

    // Format train stations
    if (trainStations?.member) {
      trainStations.member.slice(0, 5).forEach((station: any) => {
        stations.push({
          id: station.station_code || station.name,
          name: station.name,
          type: 'train',
          distance: station.distance || 0,
          latitude: station.latitude,
          longitude: station.longitude,
          code: station.station_code,
        });
      });
    }

    // Format bus stops
    if (busStops?.member) {
      busStops.member.slice(0, 5).forEach((stop: any) => {
        stations.push({
          id: stop.atcocode || stop.name,
          name: stop.name,
          type: 'bus',
          distance: stop.distance || 0,
          latitude: stop.latitude,
          longitude: stop.longitude,
          code: stop.atcocode,
        });
      });
    }

    return stations;
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
export const selectNearbyStations = (state: any) => state.nearby.stations;
export const selectNearbyLoading = (state: any) => state.nearby.loading;