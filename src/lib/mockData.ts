import { Ride, DriverLocation } from '@/types/ride';
import { RIDE_STATUS, VEHICLE_TYPES } from '@/lib/constants';

// Mock rides database
export let mockRides: Ride[] = [
  {
    id: 'ride_001',
    passengerId: '1',
    driverId: '2',
    pickup: {
      address: '123 Main St, New York, NY',
      coordinates: { lat: 40.7589, lng: -73.9851 }
    },
    destination: {
      address: '456 Broadway, New York, NY',
      coordinates: { lat: 40.7505, lng: -73.9934 }
    },
    status: RIDE_STATUS.COMPLETED,
    vehicleType: VEHICLE_TYPES.STANDARD,
    fare: {
      baseFare: 2.50,
      distanceFare: 3.70,
      timeFare: 1.75,
      surgeFare: 0,
      totalFare: 7.95,
      currency: 'USD'
    },
    estimatedDuration: 15,
    estimatedDistance: 2.1,
    requestedAt: new Date('2024-01-15T10:30:00Z'),
    acceptedAt: new Date('2024-01-15T10:31:00Z'),
    startedAt: new Date('2024-01-15T10:35:00Z'),
    completedAt: new Date('2024-01-15T10:50:00Z'),
    rating: {
      id: 'rating_001',
      rideId: 'ride_001',
      raterId: '1',
      raterType: 'passenger',
      rating: 5,
      comment: 'Great ride, very professional driver!',
      createdAt: new Date('2024-01-15T10:52:00Z')
    }
  },
  {
    id: 'ride_002',
    passengerId: '1',
    driverId: '2',
    pickup: {
      address: '789 Central Park West, New York, NY',
      coordinates: { lat: 40.7794, lng: -73.9632 }
    },
    destination: {
      address: '321 Wall St, New York, NY',
      coordinates: { lat: 40.7074, lng: -74.0113 }
    },
    status: RIDE_STATUS.COMPLETED,
    vehicleType: VEHICLE_TYPES.PREMIUM,
    fare: {
      baseFare: 3.50,
      distanceFare: 8.25,
      timeFare: 3.15,
      surgeFare: 2.48,
      totalFare: 17.38,
      currency: 'USD'
    },
    estimatedDuration: 25,
    estimatedDistance: 4.5,
    requestedAt: new Date('2024-01-14T14:20:00Z'),
    acceptedAt: new Date('2024-01-14T14:21:30Z'),
    startedAt: new Date('2024-01-14T14:28:00Z'),
    completedAt: new Date('2024-01-14T14:53:00Z'),
    rating: {
      id: 'rating_002',
      rideId: 'ride_002',
      raterId: '1',
      raterType: 'passenger',
      rating: 4,
      comment: 'Good ride, arrived on time',
      createdAt: new Date('2024-01-14T14:55:00Z')
    }
  },
  {
    id: 'ride_003',
    passengerId: '1',
    pickup: {
      address: 'JFK Airport, Queens, NY',
      coordinates: { lat: 40.6413, lng: -73.7781 }
    },
    destination: {
      address: '100 Manhattan Ave, New York, NY',
      coordinates: { lat: 40.7831, lng: -73.9712 }
    },
    status: RIDE_STATUS.REQUESTED,
    vehicleType: VEHICLE_TYPES.XL,
    fare: {
      baseFare: 4.00,
      distanceFare: 18.50,
      timeFare: 5.25,
      surgeFare: 0,
      totalFare: 27.75,
      currency: 'USD'
    },
    estimatedDuration: 45,
    estimatedDistance: 10.2,
    requestedAt: new Date('2024-01-16T09:15:00Z'),
    notes: 'Airport pickup - Terminal 4'
  }
];

// Mock driver locations
export let mockDriverLocations: DriverLocation[] = [
  {
    driverId: '2',
    coordinates: { lat: 40.7589, lng: -73.9851 },
    heading: 45,
    isOnline: true,
    lastUpdated: new Date()
  },
  {
    driverId: '4',
    coordinates: { lat: 40.7505, lng: -73.9934 },
    heading: 180,
    isOnline: true,
    lastUpdated: new Date()
  },
  {
    driverId: '5',
    coordinates: { lat: 40.7794, lng: -73.9632 },
    heading: 270,
    isOnline: true,
    lastUpdated: new Date()
  },
  {
    driverId: '6',
    coordinates: { lat: 40.7074, lng: -74.0113 },
    heading: 90,
    isOnline: false,
    lastUpdated: new Date(Date.now() - 1800000) // 30 minutes ago
  }
];

// Sample ride templates for quick generation
export const rideTemplates = [
  {
    pickup: { address: 'Times Square, New York, NY', coordinates: { lat: 40.7580, lng: -73.9855 } },
    destination: { address: 'Brooklyn Bridge, New York, NY', coordinates: { lat: 40.7061, lng: -73.9969 } }
  },
  {
    pickup: { address: 'Central Park, New York, NY', coordinates: { lat: 40.7829, lng: -73.9654 } },
    destination: { address: 'Statue of Liberty, New York, NY', coordinates: { lat: 40.6892, lng: -74.0445 } }
  },
  {
    pickup: { address: 'Empire State Building, New York, NY', coordinates: { lat: 40.7484, lng: -73.9857 } },
    destination: { address: 'LaGuardia Airport, Queens, NY', coordinates: { lat: 40.7769, lng: -73.8740 } }
  }
];

// Analytics data for admin dashboard
export const mockAnalytics = {
  dailyStats: {
    totalRides: 1247,
    totalRevenue: 18650.75,
    averageFare: 14.95,
    activeDrivers: 89,
    activePassengers: 456,
    cancellationRate: 0.08,
    averageRating: 4.7
  },
  weeklyTrends: [
    { date: '2024-01-10', rides: 1150, revenue: 17225.50 },
    { date: '2024-01-11', rides: 1298, revenue: 19470.25 },
    { date: '2024-01-12', rides: 1089, revenue: 16335.75 },
    { date: '2024-01-13', rides: 1356, revenue: 20340.80 },
    { date: '2024-01-14', rides: 1445, revenue: 21675.50 },
    { date: '2024-01-15', rides: 1523, revenue: 22845.25 },
    { date: '2024-01-16', rides: 1247, revenue: 18650.75 }
  ],
  topRoutes: [
    { from: 'JFK Airport', to: 'Manhattan', count: 89, avgFare: 45.50 },
    { from: 'Times Square', to: 'Brooklyn', count: 67, avgFare: 18.25 },
    { from: 'Central Park', to: 'Wall Street', count: 54, avgFare: 22.75 },
    { from: 'LaGuardia Airport', to: 'Manhattan', count: 43, avgFare: 38.90 },
    { from: 'Brooklyn Bridge', to: 'Uptown', count: 37, avgFare: 16.50 }
  ]
};

// Helper functions for mock data management
export function addRide(ride: Ride): void {
  mockRides.unshift(ride);
}

export function updateRide(rideId: string, updates: Partial<Ride>): Ride | null {
  const index = mockRides.findIndex(ride => ride.id === rideId);
  if (index === -1) return null;
  
  mockRides[index] = { ...mockRides[index], ...updates };
  return mockRides[index];
}

export function getRidesByUser(userId: string, role: 'passenger' | 'driver'): Ride[] {
  if (role === 'passenger') {
    return mockRides.filter(ride => ride.passengerId === userId);
  } else {
    return mockRides.filter(ride => ride.driverId === userId);
  }
}

export function getActiveRides(): Ride[] {
  return mockRides.filter(ride => 
    ![RIDE_STATUS.COMPLETED, RIDE_STATUS.CANCELLED].includes(ride.status as any)
  );
}

export function updateDriverLocation(driverId: string, location: { lat: number; lng: number; heading?: number }): void {
  const index = mockDriverLocations.findIndex(driver => driver.driverId === driverId);
  
  if (index !== -1) {
    mockDriverLocations[index] = {
      ...mockDriverLocations[index],
      coordinates: location,
      heading: location.heading || mockDriverLocations[index].heading,
      lastUpdated: new Date()
    };
  } else {
    mockDriverLocations.push({
      driverId,
      coordinates: location,
      heading: location.heading || 0,
      isOnline: true,
      lastUpdated: new Date()
    });
  }
}

export function getNearbyDrivers(location: { lat: number; lng: number }, radiusInMiles: number = 5): DriverLocation[] {
  return mockDriverLocations.filter(driver => {
    if (!driver.isOnline) return false;
    
    // Simple distance calculation (not perfectly accurate but good for demo)
    const latDiff = Math.abs(driver.coordinates.lat - location.lat);
    const lngDiff = Math.abs(driver.coordinates.lng - location.lng);
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 69; // Rough miles conversion
    
    return distance <= radiusInMiles;
  });
}