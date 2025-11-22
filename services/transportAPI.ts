// services/api/transportAPI.ts
/**
 * TransportAPI Integration Service
 * Real UK transport data for buses and trains
 */

const TRANSPORT_API_BASE = 'https://transportapi.com/v3/uk';
const APP_ID = '1b47ff8c';
const APP_KEY = "8a2bc8c3fcedf8c208e916c809192924"

// UK Popular Tourist Destinations with their train station codes
export const UK_DESTINATIONS = [
  {
    id: '1',
    name: 'London',
    location: 'London, England',
    stationCode: 'LBG', // London Bridge
    latitude: 51.5074,
    longitude: -0.1278,
    rating: 4.8,
    description: 'The capital city with iconic landmarks like Big Ben, Tower Bridge, and Buckingham Palace.',
    bestTime: 'May to September',
    category: 'city',
    image: 'https://i.pinimg.com/736x/07/60/50/0760509a5fadcb0ed8e6cd4fd1c21c5f.jpg',
  },
  {
    id: '2',
    name: 'Edinburgh',
    location: 'Edinburgh, Scotland',
    stationCode: 'EDB', // Edinburgh (Waverley)
    latitude: 55.9533,
    longitude: -3.1883,
    rating: 4.9,
    description: 'Historic Scottish capital with Edinburgh Castle, Royal Mile, and stunning architecture.',
    bestTime: 'April to September',
    category: 'city',
    image: 'https://i.pinimg.com/1200x/7b/ca/93/7bca9334081a8c8252df253fa626a4ad.jpg',
  },
  {
    id: '3',
    name: 'Manchester',
    location: 'Manchester, England',
    stationCode: 'MAN', // Manchester Piccadilly
    latitude: 53.4808,
    longitude: -2.2426,
    rating: 4.6,
    description: 'Vibrant city known for music, football, and industrial heritage.',
    bestTime: 'June to August',
    category: 'city',
    image: 'https://i.pinimg.com/736x/24/44/12/244412e6e8dde10b554a16c3909a1239.jpg',
  },
  {
    id: '4',
    name: 'Bath',
    location: 'Bath, England',
    stationCode: 'BAT', // Bath Spa
    latitude: 51.3781,
    longitude: -2.3597,
    rating: 4.8,
    description: 'Historic city famous for Roman Baths and Georgian architecture.',
    bestTime: 'May to September',
    category: 'city',
    image: 'https://i.pinimg.com/736x/1b/df/72/1bdf724b22bf446491d5b0ba73d53d03.jpg',
  },
  {
    id: '5',
    name: 'Oxford',
    location: 'Oxford, England',
    stationCode: 'OXF', // Oxford
    latitude: 51.7520,
    longitude: -1.2577,
    rating: 4.7,
    description: 'University city with stunning colleges, libraries, and historic architecture.',
    bestTime: 'April to September',
    category: 'city',
    image: 'https://i.pinimg.com/736x/60/32/07/6032074ed244e4916398f27553f085e7.jpg',
  },
  {
    id: '6',
    name: 'Cambridge',
    location: 'Cambridge, England',
    stationCode: 'CBG', // Cambridge
    latitude: 52.2053,
    longitude: 0.1218,
    rating: 4.7,
    description: 'Prestigious university city with beautiful colleges and punting on the river.',
    bestTime: 'May to September',
    category: 'city',
    image: 'https://i.pinimg.com/736x/0e/e4/44/0ee444c069dc06a854c1b0a90e1699d8.jpg',
  },
  {
    id: '7',
    name: 'Brighton',
    location: 'Brighton, England',
    stationCode: 'BTN', // Brighton
    latitude: 50.8225,
    longitude: -0.1372,
    rating: 4.5,
    description: 'Seaside resort with iconic pier, vibrant nightlife, and pebble beaches.',
    bestTime: 'May to September',
    category: 'beach',
    image: 'https://i.pinimg.com/1200x/e4/65/dd/e465ddfa4d11d61676391e6bbff80c0e.jpg',
  },
  {
    id: '8',
    name: 'York',
    location: 'York, England',
    stationCode: 'YRK', // York
    latitude: 53.9591,
    longitude: -1.0815,
    rating: 4.8,
    description: 'Medieval city with York Minster, city walls, and Viking heritage.',
    bestTime: 'April to October',
    category: 'city',
    image: 'https://i.pinimg.com/1200x/a2/89/9e/a2899ee5652f3faf140dee930a100c27.jpg',
  },
];

interface TransportAPIResponse {
  departures?: any;
  request_time?: string;
  station_name?: string;
  station_code?: string;
}

class TransportAPIService {
  private buildUrl(endpoint: string, params: Record<string, string> = {}): string {
    const url = new URL(`${TRANSPORT_API_BASE}${endpoint}`);
    url.searchParams.append('app_id', APP_ID);
    url.searchParams.append('app_key', APP_KEY);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    return url.toString();
  }

  /**
   * Get live train departures from a station
   */
  async getTrainDepartures(stationCode: string): Promise<any> {
    try {
      const url = this.buildUrl(`/train/station/${stationCode}/live.json`, {
        darwin: 'false',
        train_status: 'passenger',
      });
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch train departures');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching train departures:', error);
      throw error;
    }
  }

  /**
   * Get train timetable for a specific date
   */
  async getTrainTimetable(stationCode: string, date: string): Promise<any> {
    try {
      const url = this.buildUrl(`/train/station/${stationCode}/timetable.json`, {
        date,
        darwin: 'false',
        train_status: 'passenger',
      });
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch train timetable');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching train timetable:', error);
      throw error;
    }
  }

  /**
   * Get live bus departures from a stop
   */
  async getBusDepartures(atcoCode: string): Promise<any> {
    try {
      const url = this.buildUrl(`/bus/stop/${atcoCode}/live.json`, {
        group: 'route',
      });
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch bus departures');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching bus departures:', error);
      throw error;
    }
  }

  /**
   * Find places/stops near a location
   */
  async findNearbyStops(lat: number, lon: number, type: 'train_station' | 'bus_stop' = 'train_station'): Promise<any> {
    try {
      const url = this.buildUrl('/places.json', {
        lat: lat.toString(),
        lon: lon.toString(),
        type,
      });
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to find nearby stops');
      
      return await response.json();
    } catch (error) {
      console.error('Error finding nearby stops:', error);
      throw error;
    }
  }

  /**
   * Journey planning between two locations
   */
  async planJourney(fromLat: number, fromLon: number, toLat: number, toLon: number): Promise<any> {
    try {
      const url = this.buildUrl('/public/journey/from/lonlat:' + fromLon + ',' + fromLat + 
                                 '/to/lonlat:' + toLon + ',' + toLat + '.json');
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to plan journey');
      
      return await response.json();
    } catch (error) {
      console.error('Error planning journey:', error);
      throw error;
    }
  }

  /**
   * Get all UK destinations
   */
  getDestinations(params?: { search?: string; category?: string }): typeof UK_DESTINATIONS {
    let results = [...UK_DESTINATIONS];
    
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      results = results.filter(d => 
        d.name.toLowerCase().includes(searchLower) ||
        d.location.toLowerCase().includes(searchLower)
      );
    }
    
    if (params?.category && params.category !== 'All') {
    const category = params.category.toLowerCase();
    results = results.filter(d => d.category === category);
    }

    return results;
  }

  /**
   * Get destination by ID
   */
  getDestinationById(id: string) {
    return UK_DESTINATIONS.find(d => d.id === id);
  }

  /**
   * Format transport data for app consumption
   */
  formatTrainDepartures(apiData: any) {
    if (!apiData?.departures?.all) return [];
    
    return apiData.departures.all.slice(0, 10).map((departure: any, index: number) => ({
      id: `train-${index}`,
      type: 'train' as const,
      vehicleName: `${departure.operator_name} - ${departure.destination_name}`,
      vehicleNumber: departure.train_uid || 'N/A',
      departureLocation: apiData.station_name,
      departureTime: departure.aimed_departure_time || departure.expected_departure_time,
      arrivalLocation: departure.destination_name,
      arrivalTime: departure.aimed_arrival_time || 'N/A',
      duration: this.calculateDuration(departure.aimed_departure_time, departure.aimed_arrival_time),
      price: this.estimatePrice(departure.origin_name, departure.destination_name),
      rating: 4.5 + Math.random() * 0.5, // Random rating for demo
      operator: departure.operator_name,
      platform: departure.platform,
      status: departure.status || 'On time',
    }));
  }

  formatBusDepartures(apiData: any, destinationName: string) {
    if (!apiData?.departures) return [];
    
    const allBuses = Object.values(apiData.departures).flat() as any[];
    
    return allBuses.slice(0, 10).map((departure: any, index: number) => ({
      id: `bus-${index}`,
      type: 'bus' as const,
      vehicleName: `${departure.line_name} - ${departure.direction}`,
      vehicleNumber: departure.line || 'N/A',
      departureLocation: apiData.stop_name,
      departureTime: departure.aimed_departure_time || departure.expected_departure_time,
      arrivalLocation: destinationName,
      arrivalTime: 'N/A',
      duration: 'Varies',
      price: this.estimateBusPrice(),
      rating: 4.0 + Math.random() * 0.5,
      operator: departure.operator_name || departure.operator,
      status: departure.status || 'On time',
    }));
  }

  private calculateDuration(departureTime: string, arrivalTime: string): string {
    if (!departureTime || !arrivalTime) return 'N/A';
    
    // Simple duration calculation (you can improve this)
    const [depHour, depMin] = departureTime.split(':').map(Number);
    const [arrHour, arrMin] = arrivalTime.split(':').map(Number);
    
    const depMinutes = depHour * 60 + depMin;
    const arrMinutes = arrHour * 60 + arrMin;
    
    let duration = arrMinutes - depMinutes;
    if (duration < 0) duration += 24 * 60; // Handle overnight journeys
    
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  private estimatePrice(origin: string, destination: string): number {
    // Simple price estimation (you can improve this with actual pricing data)
    const basePrice = 15;
    const random = Math.floor(Math.random() * 50);
    return basePrice + random;
  }

  private estimateBusPrice(): number {
    return 2 + Math.floor(Math.random() * 8); 
  }
}

export const transportAPI = new TransportAPIService();
export default transportAPI;