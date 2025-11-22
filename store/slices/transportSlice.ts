// store/slices/transportSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import transportAPI from '@/services/transportAPI';

interface TransportRoute {
  id: string;
  type: 'bus' | 'train';
  vehicleName: string;
  vehicleNumber: string;
  departureLocation: string;
  departureTime: string;
  arrivalLocation: string;
  arrivalTime: string;
  duration: string;
  price: number;
  rating: number;
  operator: string;
  platform?: string;
  status?: string;
}

interface TransportState {
  routes: {
    train: TransportRoute[];
    bus: TransportRoute[];
  };
  loading: boolean;
  error: string | null;
  selectedType: 'bus' | 'train';
  currentDestination: {
    id: string;
    name: string;
    stationCode: string;
  } | null;
}

const initialState: TransportState = {
  routes: {
    train: [],
    bus: [],
  },
  loading: false,
  error: null,
  selectedType: 'train',
  currentDestination: null,
};

// Async thunks
export const fetchTrainSchedules = createAsyncThunk(
  'transport/fetchTrainSchedules',
  async ({ stationCode, destinationName }: { stationCode: string; destinationName: string }) => {
    const data = await transportAPI.getTrainDepartures(stationCode);
    return {
      routes: transportAPI.formatTrainDepartures(data),
      destinationName,
    };
  }
);

export const fetchBusSchedules = createAsyncThunk(
  'transport/fetchBusSchedules',
  async ({ atcoCode, destinationName }: { atcoCode: string; destinationName: string }) => {
    const data = await transportAPI.getBusDepartures(atcoCode);
    return {
      routes: transportAPI.formatBusDepartures(data, destinationName),
      destinationName,
    };
  }
);

export const fetchNearbyStopsAndSchedules = createAsyncThunk(
  'transport/fetchNearbyStopsAndSchedules',
  async ({ destinationId, lat, lon }: { destinationId: string; lat: number; lon: number }) => {
    const destination = transportAPI.getDestinationById(destinationId);
    if (!destination) throw new Error('Destination not found');

    // Get train schedules using station code
    const trainData = await transportAPI.getTrainDepartures(destination.stationCode);
    const trainRoutes = transportAPI.formatTrainDepartures(trainData);

    // Find nearby bus stops
    const busStops = await transportAPI.findNearbyStops(lat, lon, 'bus_stop');
    let busRoutes: any[] = [];
    
    // Get bus schedules from first nearby stop
    if (busStops?.member && busStops.member.length > 0) {
      const firstStop = busStops.member[0];
      const busData = await transportAPI.getBusDepartures(firstStop.atcocode);
      busRoutes = transportAPI.formatBusDepartures(busData, destination.name);
    }

    return {
      train: trainRoutes,
      bus: busRoutes,
      destination: {
        id: destination.id,
        name: destination.name,
        stationCode: destination.stationCode,
      },
    };
  }
);

const transportSlice = createSlice({
  name: 'transport',
  initialState,
  reducers: {
    setSelectedType: (state, action: PayloadAction<'bus' | 'train'>) => {
      state.selectedType = action.payload;
    },
    clearRoutes: (state) => {
      state.routes = { train: [], bus: [] };
      state.currentDestination = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch train schedules
      .addCase(fetchTrainSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrainSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.routes.train = action.payload.routes;
      })
      .addCase(fetchTrainSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch train schedules';
      })
      
      // Fetch bus schedules
      .addCase(fetchBusSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.routes.bus = action.payload.routes;
      })
      .addCase(fetchBusSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch bus schedules';
      })
      
      // Fetch all nearby stops and schedules
      .addCase(fetchNearbyStopsAndSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNearbyStopsAndSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.routes.train = action.payload.train;
        state.routes.bus = action.payload.bus;
        state.currentDestination = action.payload.destination;
      })
      .addCase(fetchNearbyStopsAndSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transport schedules';
      });
  },
});

export const { setSelectedType, clearRoutes } = transportSlice.actions;
export default transportSlice.reducer;

// Selectors
export const selectTransportRoutes = (state: any, type: 'bus' | 'train') => 
  state.transport.routes[type];
export const selectTransportLoading = (state: any) => state.transport.loading;
export const selectTransportError = (state: any) => state.transport.error;
export const selectCurrentDestination = (state: any) => state.transport.currentDestination;
