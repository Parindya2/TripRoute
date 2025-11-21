// store/slices/transportSchedulesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TransportRoute {
  departureTime: string;
  departureLocation: string;
  arrivalTime: string;
  arrivalLocation: string;
  vehicleName: string;
  vehicleNumber: string;
  price: number;
  duration: string;
  rating: number;
}

export interface TransportSchedule {
  destinationId: string;
  destinationName: string;
  bus: {
    routes: TransportRoute[];
  };
  train: {
    routes: TransportRoute[];
  };
}

interface TransportSchedulesState {
  schedules: TransportSchedule[];
  loading: boolean;
  error: string | null;
}

const initialState: TransportSchedulesState = {
  schedules: [
    // St. Regis Bora Bora - Beach destination with tropical island routes
    {
      destinationId: '1',
      destinationName: 'St. Regis Bora Bora',
      bus: {
        routes: [
          {
            departureTime: '7:00 AM',
            departureLocation: 'Vaitape Port',
            arrivalTime: '7:45 AM',
            arrivalLocation: 'St. Regis Resort',
            vehicleName: 'Island Paradise Shuttle',
            vehicleNumber: 'BB-101',
            price: 35,
            duration: '45m',
            rating: 4.8,
          },
          {
            departureTime: '10:30 AM',
            departureLocation: 'Bora Town Center',
            arrivalTime: '11:20 AM',
            arrivalLocation: 'St. Regis Resort',
            vehicleName: 'Lagoon Express',
            vehicleNumber: 'BB-205',
            price: 32,
            duration: '50m',
            rating: 4.6,
          },
          {
            departureTime: '2:00 PM',
            departureLocation: 'Airport Terminal',
            arrivalTime: '2:40 PM',
            arrivalLocation: 'St. Regis Resort',
            vehicleName: 'Coral Bay Shuttle',
            vehicleNumber: 'BB-312',
            price: 38,
            duration: '40m',
            rating: 4.9,
          },
          {
            departureTime: '5:30 PM',
            departureLocation: 'Matira Beach',
            arrivalTime: '6:25 PM',
            arrivalLocation: 'St. Regis Resort',
            vehicleName: 'Sunset Cruiser',
            vehicleNumber: 'BB-428',
            price: 40,
            duration: '55m',
            rating: 4.7,
          },
        ],
      },
      train: {
        routes: [
          {
            departureTime: '6:30 AM',
            departureLocation: 'Papeete Central',
            arrivalTime: '8:15 AM',
            arrivalLocation: 'Bora Station',
            vehicleName: 'Pacific Islander',
            vehicleNumber: 'TR-701',
            price: 85,
            duration: '1h 45m',
            rating: 4.5,
          },
          {
            departureTime: '12:00 PM',
            departureLocation: 'Moorea Junction',
            arrivalTime: '1:30 PM',
            arrivalLocation: 'Bora Station',
            vehicleName: 'Tahitian Express',
            vehicleNumber: 'TR-815',
            price: 72,
            duration: '1h 30m',
            rating: 4.6,
          },
        ],
      },
    },

    // St. Regis Bora - Similar but different schedules
    {
      destinationId: '2',
      destinationName: 'St. Regis Bora',
      bus: {
        routes: [
          {
            departureTime: '8:15 AM',
            departureLocation: 'Bora Main Station',
            arrivalTime: '9:05 AM',
            arrivalLocation: 'Resort Entrance',
            vehicleName: 'Morning Star Bus',
            vehicleNumber: 'BR-150',
            price: 28,
            duration: '50m',
            rating: 4.4,
          },
          {
            departureTime: '1:45 PM',
            departureLocation: 'Downtown Bora',
            arrivalTime: '2:30 PM',
            arrivalLocation: 'Resort Entrance',
            vehicleName: 'Afternoon Breeze',
            vehicleNumber: 'BR-267',
            price: 30,
            duration: '45m',
            rating: 4.5,
          },
          {
            departureTime: '4:00 PM',
            departureLocation: 'Marina Bay',
            arrivalTime: '4:55 PM',
            arrivalLocation: 'Resort Entrance',
            vehicleName: 'Harbor Hopper',
            vehicleNumber: 'BR-394',
            price: 33,
            duration: '55m',
            rating: 4.3,
          },
        ],
      },
      train: {
        routes: [
          {
            departureTime: '7:45 AM',
            departureLocation: 'Regional Hub',
            arrivalTime: '9:40 AM',
            arrivalLocation: 'Bora North',
            vehicleName: 'Coastal Rider',
            vehicleNumber: 'TR-522',
            price: 68,
            duration: '1h 55m',
            rating: 4.4,
          },
          {
            departureTime: '3:15 PM',
            departureLocation: 'South Terminal',
            arrivalTime: '4:50 PM',
            arrivalLocation: 'Bora North',
            vehicleName: 'Island Link',
            vehicleNumber: 'TR-639',
            price: 75,
            duration: '1h 35m',
            rating: 4.7,
          },
        ],
      },
    },

    // Santorini - Greek island routes
    {
      destinationId: '3',
      destinationName: 'Santorini',
      bus: {
        routes: [
          {
            departureTime: '6:45 AM',
            departureLocation: 'Fira Central',
            arrivalTime: '7:25 AM',
            arrivalLocation: 'Oia Village',
            vehicleName: 'Aegean Explorer',
            vehicleNumber: 'SN-201',
            price: 18,
            duration: '40m',
            rating: 4.7,
          },
          {
            departureTime: '9:30 AM',
            departureLocation: 'Kamari Beach',
            arrivalTime: '10:20 AM',
            arrivalLocation: 'Oia Village',
            vehicleName: 'Cyclades Express',
            vehicleNumber: 'SN-318',
            price: 22,
            duration: '50m',
            rating: 4.8,
          },
          {
            departureTime: '1:00 PM',
            departureLocation: 'Perissa Station',
            arrivalTime: '1:45 PM',
            arrivalLocation: 'Oia Village',
            vehicleName: 'Blue Dome Shuttle',
            vehicleNumber: 'SN-425',
            price: 20,
            duration: '45m',
            rating: 4.6,
          },
          {
            departureTime: '4:30 PM',
            departureLocation: 'Port Authority',
            arrivalTime: '5:30 PM',
            arrivalLocation: 'Oia Village',
            vehicleName: 'Sunset Special',
            vehicleNumber: 'SN-542',
            price: 25,
            duration: '1h',
            rating: 4.9,
          },
        ],
      },
      train: {
        routes: [
          {
            departureTime: '8:00 AM',
            departureLocation: 'Athens Central',
            arrivalTime: '10:45 AM',
            arrivalLocation: 'Santorini Station',
            vehicleName: 'Hellenic Rail',
            vehicleNumber: 'TR-301',
            price: 95,
            duration: '2h 45m',
            rating: 4.5,
          },
          {
            departureTime: '2:30 PM',
            departureLocation: 'Heraklion Hub',
            arrivalTime: '4:15 PM',
            arrivalLocation: 'Santorini Station',
            vehicleName: 'Mediterranean Line',
            vehicleNumber: 'TR-418',
            price: 82,
            duration: '1h 45m',
            rating: 4.6,
          },
          {
            departureTime: '6:00 PM',
            departureLocation: 'Mykonos Junction',
            arrivalTime: '7:30 PM',
            arrivalLocation: 'Santorini Station',
            vehicleName: 'Island Hopper',
            vehicleNumber: 'TR-525',
            price: 78,
            duration: '1h 30m',
            rating: 4.7,
          },
        ],
      },
    },

    // Maldives Resort - Tropical luxury routes
    {
      destinationId: '4',
      destinationName: 'Maldives Resort',
      bus: {
        routes: [
          {
            departureTime: '7:30 AM',
            departureLocation: 'Male City Center',
            arrivalTime: '8:45 AM',
            arrivalLocation: 'Paradise Island',
            vehicleName: 'Atoll Express',
            vehicleNumber: 'MV-101',
            price: 42,
            duration: '1h 15m',
            rating: 4.8,
          },
          {
            departureTime: '11:00 AM',
            departureLocation: 'Hulhumale Terminal',
            arrivalTime: '12:10 PM',
            arrivalLocation: 'Paradise Island',
            vehicleName: 'Ocean Breeze',
            vehicleNumber: 'MV-224',
            price: 45,
            duration: '1h 10m',
            rating: 4.7,
          },
          {
            departureTime: '3:00 PM',
            departureLocation: 'Marina District',
            arrivalTime: '4:20 PM',
            arrivalLocation: 'Paradise Island',
            vehicleName: 'Coral Cruiser',
            vehicleNumber: 'MV-337',
            price: 48,
            duration: '1h 20m',
            rating: 4.9,
          },
        ],
      },
      train: {
        routes: [
          {
            departureTime: '9:00 AM',
            departureLocation: 'Main Terminal',
            arrivalTime: '10:30 AM',
            arrivalLocation: 'Resort Station',
            vehicleName: 'Indian Ocean Rail',
            vehicleNumber: 'TR-201',
            price: 110,
            duration: '1h 30m',
            rating: 4.6,
          },
          {
            departureTime: '1:45 PM',
            departureLocation: 'North Male Hub',
            arrivalTime: '3:00 PM',
            arrivalLocation: 'Resort Station',
            vehicleName: 'Lagoon Express',
            vehicleNumber: 'TR-318',
            price: 105,
            duration: '1h 15m',
            rating: 4.7,
          },
        ],
      },
    },

    // Bali Paradise - Indonesian island routes
    {
      destinationId: '5',
      destinationName: 'Bali Paradise',
      bus: {
        routes: [
          {
            departureTime: '6:00 AM',
            departureLocation: 'Denpasar Station',
            arrivalTime: '7:15 AM',
            arrivalLocation: 'Ubud Resort',
            vehicleName: 'Bali Sunrise',
            vehicleNumber: 'BP-115',
            price: 15,
            duration: '1h 15m',
            rating: 4.5,
          },
          {
            departureTime: '10:00 AM',
            departureLocation: 'Kuta Beach',
            arrivalTime: '11:30 AM',
            arrivalLocation: 'Ubud Resort',
            vehicleName: 'Temple Hopper',
            vehicleNumber: 'BP-228',
            price: 18,
            duration: '1h 30m',
            rating: 4.6,
          },
          {
            departureTime: '2:30 PM',
            departureLocation: 'Seminyak Square',
            arrivalTime: '3:50 PM',
            arrivalLocation: 'Ubud Resort',
            vehicleName: 'Rice Field Express',
            vehicleNumber: 'BP-341',
            price: 20,
            duration: '1h 20m',
            rating: 4.7,
          },
          {
            departureTime: '5:00 PM',
            departureLocation: 'Sanur Terminal',
            arrivalTime: '6:25 PM',
            arrivalLocation: 'Ubud Resort',
            vehicleName: 'Evening Safari',
            vehicleNumber: 'BP-454',
            price: 22,
            duration: '1h 25m',
            rating: 4.4,
          },
        ],
      },
      train: {
        routes: [
          {
            departureTime: '7:30 AM',
            departureLocation: 'Jakarta Central',
            arrivalTime: '11:15 AM',
            arrivalLocation: 'Bali Station',
            vehicleName: 'Java-Bali Express',
            vehicleNumber: 'TR-505',
            price: 65,
            duration: '3h 45m',
            rating: 4.3,
          },
          {
            departureTime: '1:00 PM',
            departureLocation: 'Surabaya Hub',
            arrivalTime: '3:45 PM',
            arrivalLocation: 'Bali Station',
            vehicleName: 'Island Link',
            vehicleNumber: 'TR-622',
            price: 58,
            duration: '2h 45m',
            rating: 4.5,
          },
        ],
      },
    },

    // Dubai Marina - Luxury UAE routes
    {
      destinationId: '6',
      destinationName: 'Dubai Marina',
      bus: {
        routes: [
          {
            departureTime: '7:00 AM',
            departureLocation: 'Dubai Mall',
            arrivalTime: '7:35 AM',
            arrivalLocation: 'Marina Walk',
            vehicleName: 'Metro Connector',
            vehicleNumber: 'DM-301',
            price: 8,
            duration: '35m',
            rating: 4.6,
          },
          {
            departureTime: '9:45 AM',
            departureLocation: 'Downtown Dubai',
            arrivalTime: '10:15 AM',
            arrivalLocation: 'Marina Walk',
            vehicleName: 'City Express',
            vehicleNumber: 'DM-418',
            price: 10,
            duration: '30m',
            rating: 4.7,
          },
          {
            departureTime: '12:30 PM',
            departureLocation: 'Business Bay',
            arrivalTime: '1:10 PM',
            arrivalLocation: 'Marina Walk',
            vehicleName: 'Sky Tower Bus',
            vehicleNumber: 'DM-525',
            price: 12,
            duration: '40m',
            rating: 4.8,
          },
          {
            departureTime: '4:00 PM',
            departureLocation: 'Jumeirah Beach',
            arrivalTime: '4:45 PM',
            arrivalLocation: 'Marina Walk',
            vehicleName: 'Coastal Shuttle',
            vehicleNumber: 'DM-632',
            price: 15,
            duration: '45m',
            rating: 4.5,
          },
        ],
      },
      train: {
        routes: [
          {
            departureTime: '8:15 AM',
            departureLocation: 'Abu Dhabi Central',
            arrivalTime: '9:30 AM',
            arrivalLocation: 'Dubai Marina Station',
            vehicleName: 'Emirates Rail',
            vehicleNumber: 'TR-101',
            price: 45,
            duration: '1h 15m',
            rating: 4.8,
          },
          {
            departureTime: '11:30 AM',
            departureLocation: 'Sharjah Terminal',
            arrivalTime: '12:15 PM',
            arrivalLocation: 'Dubai Marina Station',
            vehicleName: 'UAE Express',
            vehicleNumber: 'TR-218',
            price: 32,
            duration: '45m',
            rating: 4.7,
          },
          {
            departureTime: '3:45 PM',
            departureLocation: 'Al Ain Junction',
            arrivalTime: '5:20 PM',
            arrivalLocation: 'Dubai Marina Station',
            vehicleName: 'Desert Link',
            vehicleNumber: 'TR-325',
            price: 52,
            duration: '1h 35m',
            rating: 4.6,
          },
        ],
      },
    },

    // Swiss Alps - Mountain resort routes
    {
      destinationId: '7',
      destinationName: 'Swiss Alps',
      bus: {
        routes: [
          {
            departureTime: '6:00 AM',
            departureLocation: 'Zurich Central',
            arrivalTime: '8:45 AM',
            arrivalLocation: 'Alpine Resort',
            vehicleName: 'Mountain Express',
            vehicleNumber: 'SA-201',
            price: 38,
            duration: '2h 45m',
            rating: 4.7,
          },
          {
            departureTime: '10:30 AM',
            departureLocation: 'Lucerne Station',
            arrivalTime: '12:30 PM',
            arrivalLocation: 'Alpine Resort',
            vehicleName: 'Peak Shuttle',
            vehicleNumber: 'SA-318',
            price: 35,
            duration: '2h',
            rating: 4.8,
          },
          {
            departureTime: '2:00 PM',
            departureLocation: 'Geneva Terminal',
            arrivalTime: '5:15 PM',
            arrivalLocation: 'Alpine Resort',
            vehicleName: 'Glacier Express Bus',
            vehicleNumber: 'SA-425',
            price: 48,
            duration: '3h 15m',
            rating: 4.6,
          },
        ],
      },
      train: {
        routes: [
          {
            departureTime: '7:00 AM',
            departureLocation: 'Zurich HB',
            arrivalTime: '9:15 AM',
            arrivalLocation: 'Interlaken Ost',
            vehicleName: 'Glacier Express',
            vehicleNumber: 'TR-401',
            price: 85,
            duration: '2h 15m',
            rating: 4.9,
          },
          {
            departureTime: '11:45 AM',
            departureLocation: 'Bern Central',
            arrivalTime: '1:30 PM',
            arrivalLocation: 'Interlaken Ost',
            vehicleName: 'Alpine Panorama',
            vehicleNumber: 'TR-518',
            price: 72,
            duration: '1h 45m',
            rating: 4.8,
          },
          {
            departureTime: '3:30 PM',
            departureLocation: 'Basel SBB',
            arrivalTime: '6:00 PM',
            arrivalLocation: 'Interlaken Ost',
            vehicleName: 'Jungfrau Line',
            vehicleNumber: 'TR-625',
            price: 78,
            duration: '2h 30m',
            rating: 4.7,
          },
        ],
      },
    },

    // Tokyo Tower - Japanese urban routes
    {
      destinationId: '8',
      destinationName: 'Tokyo Tower',
      bus: {
        routes: [
          {
            departureTime: '6:30 AM',
            departureLocation: 'Shibuya Station',
            arrivalTime: '7:10 AM',
            arrivalLocation: 'Tokyo Tower',
            vehicleName: 'Metro Express',
            vehicleNumber: 'TT-501',
            price: 12,
            duration: '40m',
            rating: 4.6,
          },
          {
            departureTime: '9:00 AM',
            departureLocation: 'Shinjuku Terminal',
            arrivalTime: '9:45 AM',
            arrivalLocation: 'Tokyo Tower',
            vehicleName: 'City Liner',
            vehicleNumber: 'TT-618',
            price: 15,
            duration: '45m',
            rating: 4.7,
          },
          {
            departureTime: '12:30 PM',
            departureLocation: 'Asakusa Station',
            arrivalTime: '1:20 PM',
            arrivalLocation: 'Tokyo Tower',
            vehicleName: 'Sakura Express',
            vehicleNumber: 'TT-725',
            price: 18,
            duration: '50m',
            rating: 4.5,
          },
          {
            departureTime: '4:00 PM',
            departureLocation: 'Roppongi Hills',
            arrivalTime: '4:25 PM',
            arrivalLocation: 'Tokyo Tower',
            vehicleName: 'Night View Special',
            vehicleNumber: 'TT-832',
            price: 10,
            duration: '25m',
            rating: 4.8,
          },
        ],
      },
      train: {
        routes: [
          {
            departureTime: '7:15 AM',
            departureLocation: 'Tokyo Station',
            arrivalTime: '7:40 AM',
            arrivalLocation: 'Hamamatsucho',
            vehicleName: 'Yamanote Line',
            vehicleNumber: 'TR-701',
            price: 8,
            duration: '25m',
            rating: 4.7,
          },
          {
            departureTime: '10:30 AM',
            departureLocation: 'Ueno Station',
            arrivalTime: '11:05 AM',
            arrivalLocation: 'Hamamatsucho',
            vehicleName: 'Keihin-Tohoku',
            vehicleNumber: 'TR-818',
            price: 10,
            duration: '35m',
            rating: 4.6,
          },
          {
            departureTime: '1:45 PM',
            departureLocation: 'Ikebukuro Station',
            arrivalTime: '2:25 PM',
            arrivalLocation: 'Hamamatsucho',
            vehicleName: 'Rapid Service',
            vehicleNumber: 'TR-925',
            price: 12,
            duration: '40m',
            rating: 4.8,
          },
          {
            departureTime: '5:00 PM',
            departureLocation: 'Yokohama Central',
            arrivalTime: '5:55 PM',
            arrivalLocation: 'Hamamatsucho',
            vehicleName: 'Tokaido Line',
            vehicleNumber: 'TR-1032',
            price: 22,
            duration: '55m',
            rating: 4.5,
          },
        ],
      },
    },
  ],
  loading: false,
  error: null,
};

const transportSchedulesSlice = createSlice({
  name: 'transportSchedules',
  initialState,
  reducers: {
    setSchedules: (state, action: PayloadAction<TransportSchedule[]>) => {
      state.schedules = action.payload;
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

    clearSchedules: (state) => {
      state.schedules = [];
      state.error = null;
    },
  },
});

export const { setSchedules, setLoading, setError, clearSchedules } = transportSchedulesSlice.actions;

// Selectors
export const selectAllSchedules = (state: { transportSchedules: TransportSchedulesState }) => 
  state.transportSchedules.schedules;

export const selectScheduleByDestinationId = (state: { transportSchedules: TransportSchedulesState }, destinationId: string) => 
  state.transportSchedules.schedules.find(schedule => schedule.destinationId === destinationId);

export default transportSchedulesSlice.reducer;