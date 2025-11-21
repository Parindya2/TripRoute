// app/data/transportSchedules.ts

export interface TransportSchedule {
  destinationId: string;
  destinationName: string;
  bus: {
    routes: Array<{
      departureTime: string;
      departureLocation: string;
      arrivalTime: string;
      arrivalLocation: string;
      vehicleName: string;
      vehicleNumber: string;
    }>;
  };
  train: {
    routes: Array<{
      departureTime: string;
      departureLocation: string;
      arrivalTime: string;
      arrivalLocation: string;
      vehicleName: string;
      vehicleNumber: string;
    }>;
  };
}

export const transportSchedules: TransportSchedule[] = [
  {
    destinationId: '1',
    destinationName: 'St. Regis Bora Bora',
    bus: {
      routes: [
        {
          departureTime: '9:00 AM',
          departureLocation: 'Bora Town',
          arrivalTime: '9:45 AM',
          arrivalLocation: 'St. Regis Bora Bora',
          vehicleName: 'Local Shuttle',
          vehicleNumber: 'BB-01',
        },
        {
          departureTime: '11:30 AM',
          departureLocation: 'Bora Town',
          arrivalTime: '12:15 PM',
          arrivalLocation: 'St. Regis Bora Bora',
          vehicleName: 'Express Bus',
          vehicleNumber: 'BB-02',
        },
        {
          departureTime: '2:00 PM',
          departureLocation: 'Bora Town',
          arrivalTime: '2:45 PM',
          arrivalLocation: 'St. Regis Bora Bora',
          vehicleName: 'Local Shuttle',
          vehicleNumber: 'BB-03',
        },
      ],
    },
    train: {
      routes: [
        {
          departureTime: '8:00 AM',
          departureLocation: 'Central Station',
          arrivalTime: '9:30 AM',
          arrivalLocation: 'Bora Beach Station',
          vehicleName: 'Coastal Express',
          vehicleNumber: 'TR-101',
        },
        {
          departureTime: '1:00 PM',
          departureLocation: 'Central Station',
          arrivalTime: '2:30 PM',
          arrivalLocation: 'Bora Beach Station',
          vehicleName: 'Island Line',
          vehicleNumber: 'TR-102',
        },
      ],
    },
  },
  {
    destinationId: '2',
    destinationName: 'Maldives Paradise',
    bus: {
      routes: [
        {
          departureTime: '7:30 AM',
          departureLocation: 'Male City',
          arrivalTime: '8:45 AM',
          arrivalLocation: 'Paradise Resort',
          vehicleName: 'Island Hopper',
          vehicleNumber: 'MV-05',
        },
        {
          departureTime: '3:00 PM',
          departureLocation: 'Male City',
          arrivalTime: '4:15 PM',
          arrivalLocation: 'Paradise Resort',
          vehicleName: 'Sunset Express',
          vehicleNumber: 'MV-06',
        },
      ],
    },
    train: {
      routes: [
        {
          departureTime: '9:00 AM',
          departureLocation: 'Main Terminal',
          arrivalTime: '10:00 AM',
          arrivalLocation: 'Resort Station',
          vehicleName: 'Ocean Rail',
          vehicleNumber: 'TR-201',
        },
      ],
    },
  },
  {
    destinationId: '3',
    destinationName: 'Swiss Alps Resort',
    bus: {
      routes: [
        {
          departureTime: '6:00 AM',
          departureLocation: 'Zurich Central',
          arrivalTime: '8:30 AM',
          arrivalLocation: 'Alpine Resort',
          vehicleName: 'Mountain Express',
          vehicleNumber: 'SA-10',
        },
        {
          departureTime: '12:00 PM',
          departureLocation: 'Zurich Central',
          arrivalTime: '2:30 PM',
          arrivalLocation: 'Alpine Resort',
          vehicleName: 'Peak Shuttle',
          vehicleNumber: 'SA-11',
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
          vehicleNumber: 'TR-301',
        },
        {
          departureTime: '2:00 PM',
          departureLocation: 'Zurich HB',
          arrivalTime: '4:15 PM',
          arrivalLocation: 'Interlaken Ost',
          vehicleName: 'Alpine Panorama',
          vehicleNumber: 'TR-302',
        },
      ],
    },
  },
];

// Helper function to get transport schedule by destination ID
export const getTransportSchedule = (destinationId: string): TransportSchedule | undefined => {
  return transportSchedules.find(schedule => schedule.destinationId === destinationId);
};