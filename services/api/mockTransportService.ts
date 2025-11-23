// services/api/mockTransportService.ts
const generateDepartureTimes = (count: number = 10) => {
  const times = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const departureTime = new Date(now.getTime() + (i * 15 + Math.random() * 10) * 60000);
    times.push({
      hour: departureTime.getHours().toString().padStart(2, '0'),
      minute: departureTime.getMinutes().toString().padStart(2, '0'),
    });
  }
  
  return times;
};

// Mock train operators
const TRAIN_OPERATORS = [
  'Great Western Railway',
  'London North Eastern Railway',
  'Avanti West Coast',
  'CrossCountry',
  'TransPennine Express',
  'Southern',
  'Thameslink',
];

// Mock bus operators
const BUS_OPERATORS = [
  'Stagecoach',
  'First Bus',
  'Arriva',
  'National Express',
  'Go-Ahead',
];

// Generate mock train schedules
export const generateMockTrainSchedules = (stationName: string, destinationName: string) => {
  const times = generateDepartureTimes(12);
  
  return times.map((time, index) => {
    const departureTime = `${time.hour}:${time.minute}`;
    const durationMinutes = 45 + Math.floor(Math.random() * 90);
    const arrivalTime = calculateArrivalTime(departureTime, durationMinutes);
    
    return {
      id: `train-${index}`,
      type: 'train' as const,
      vehicleName: `${TRAIN_OPERATORS[index % TRAIN_OPERATORS.length]}`,
      vehicleNumber: `${Math.floor(1000 + Math.random() * 9000)}`,
      departureLocation: stationName,
      departureTime,
      arrivalLocation: destinationName,
      arrivalTime,
      duration: formatDuration(durationMinutes),
      price: Math.floor(15 + Math.random() * 85),
      rating: 4.0 + Math.random() * 1.0,
      operator: TRAIN_OPERATORS[index % TRAIN_OPERATORS.length],
      platform: `${Math.floor(1 + Math.random() * 12)}`,
      status: index < 2 ? 'On time' : (Math.random() > 0.9 ? 'Delayed 5 min' : 'On time'),
    };
  });
};

// Generate mock bus schedules
export const generateMockBusSchedules = (stopName: string, destinationName: string) => {
  const times = generateDepartureTimes(15);
  
  return times.map((time, index) => {
    const departureTime = `${time.hour}:${time.minute}`;
    const durationMinutes = 25 + Math.floor(Math.random() * 60);
    
    return {
      id: `bus-${index}`,
      type: 'bus' as const,
      vehicleName: `${BUS_OPERATORS[index % BUS_OPERATORS.length]} - Route ${10 + index}`,
      vehicleNumber: `${10 + index}`,
      departureLocation: stopName,
      departureTime,
      arrivalLocation: destinationName,
      arrivalTime: calculateArrivalTime(departureTime, durationMinutes),
      duration: formatDuration(durationMinutes),
      price: Math.floor(2 + Math.random() * 8),
      rating: 3.8 + Math.random() * 1.0,
      operator: BUS_OPERATORS[index % BUS_OPERATORS.length],
      status: 'On time',
    };
  });
};

// Helper function to calculate arrival time
const calculateArrivalTime = (departureTime: string, durationMinutes: number): string => {
  const [hours, minutes] = departureTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  
  const arrivalHours = Math.floor(totalMinutes / 60) % 24;
  const arrivalMinutes = totalMinutes % 60;
  
  return `${arrivalHours.toString().padStart(2, '0')}:${arrivalMinutes.toString().padStart(2, '0')}`;
};

// Helper function to format duration
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

// Mock nearby stations data structure 
// services/api/mockTransportService.ts

// Mock nearby stations data structure 
export const generateMockNearbyStations = (lat: number, lon: number, type: 'bus' | 'train') => {
  const stationCount = type === 'bus' ? 8 : 5;
  const stations = [];
  
  for (let i = 0; i < stationCount; i++) {
    const distance = 0.1 + Math.random() * 2; // 0.1 to 2.1 km
    
    if (type === 'train') {
      stations.push({
        id: `train-station-${i}`,
        name: `${['Kings Cross', 'Victoria', 'Paddington', 'Liverpool Street', 'Waterloo'][i]} Station`,
        type: 'train' as const,  // ✅ Add 'as const' here
        distance,
        atcocode: `910G${1000 + i}`, // Mock station code
        latitude: lat + (Math.random() - 0.5) * 0.02,
        longitude: lon + (Math.random() - 0.5) * 0.02,
      });
    } else {
      stations.push({
        id: `bus-stop-${i}`,
        name: `${['High Street', 'Station Road', 'Market Place', 'Church Street', 'Park Lane', 'Mill Road', 'Bridge Street', 'Chapel Street'][i]}`,
        type: 'bus' as const,  // ✅ Add 'as const' here
        distance,
        atcocode: `490${10000 + i}`, // Mock ATCO code
        latitude: lat + (Math.random() - 0.5) * 0.02,
        longitude: lon + (Math.random() - 0.5) * 0.02,
      });
    }
  }
  
  return stations.sort((a, b) => a.distance - b.distance);
};
  
// Main function to get transport schedules 
export const getMockTransportSchedules = async (
  destinationId: string,
  destinationName: string,
  stationName: string,
  type: 'bus' | 'train'
) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (type === 'train') {
    return {
      success: true,
      data: generateMockTrainSchedules(stationName, destinationName),
    };
  } else {
    return {
      success: true,
      data: generateMockBusSchedules(stationName, destinationName),
    };
  }
};

export default {
  generateMockTrainSchedules,
  generateMockBusSchedules,
  generateMockNearbyStations,
  getMockTransportSchedules,
};