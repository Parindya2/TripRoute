// store/slices/transportSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import mockTransportService from '@/services/api/mockTransportService';

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
    stationName: string;
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

// Fetch transport schedules with mock data
export const fetchTransportSchedules = createAsyncThunk(
  'transport/fetchSchedules',
  async ({ 
    destinationId, 
    destinationName, 
    stationName, 
    type 
  }: { 
    destinationId: string; 
    destinationName: string; 
    stationName: string;
    type: 'bus' | 'train';
  }) => {
    const result = await mockTransportService.getMockTransportSchedules(
      destinationId,
      destinationName,
      stationName,
      type
    );
    
    return {
      routes: result.data,
      type,
      destination: {
        id: destinationId,
        name: destinationName,
        stationName,
      },
    };
  }
);

// Fetch all schedules (both bus and train)
export const fetchAllTransportSchedules = createAsyncThunk(
  'transport/fetchAllSchedules',
  async ({ 
    destinationId, 
    destinationName, 
    stationName 
  }: { 
    destinationId: string; 
    destinationName: string; 
    stationName: string;
  }) => {
    // Fetch both train and bus schedules
    const trainResult = await mockTransportService.getMockTransportSchedules(
      destinationId,
      destinationName,
      stationName,
      'train'
    );
    
    const busResult = await mockTransportService.getMockTransportSchedules(
      destinationId,
      destinationName,
      `${stationName} Bus Stop`,
      'bus'
    );
    
    return {
      train: trainResult.data,
      bus: busResult.data,
      destination: {
        id: destinationId,
        name: destinationName,
        stationName,
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
      // Fetch single type schedules
      .addCase(fetchTransportSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransportSchedules.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.type === 'train') {
          state.routes.train = action.payload.routes;
        } else {
          state.routes.bus = action.payload.routes;
        }
        state.currentDestination = action.payload.destination;
      })
      .addCase(fetchTransportSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch schedules';
      })
      
      // Fetch all schedules
      .addCase(fetchAllTransportSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTransportSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.routes.train = action.payload.train;
        state.routes.bus = action.payload.bus;
        state.currentDestination = action.payload.destination;
      })
      .addCase(fetchAllTransportSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch schedules';
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
export const selectSelectedType = (state: any) => state.transport.selectedType;