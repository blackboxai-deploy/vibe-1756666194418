import { RIDE_STATUS, VEHICLE_TYPES, PAYMENT_METHODS } from '@/lib/constants';

export type RideStatus = typeof RIDE_STATUS[keyof typeof RIDE_STATUS];
export type VehicleType = typeof VEHICLE_TYPES[keyof typeof VEHICLE_TYPES];
export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];

export interface Location {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  placeId?: string;
}

export interface Ride {
  id: string;
  passengerId: string;
  driverId?: string;
  pickup: Location;
  destination: Location;
  status: RideStatus;
  vehicleType: VehicleType;
  fare: Fare;
  estimatedDuration: number; // in minutes
  estimatedDistance: number; // in miles
  requestedAt: Date;
  acceptedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  route?: RoutePoint[];
  rating?: RideRating;
  notes?: string;
}

export interface Fare {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  surgeFare: number;
  totalFare: number;
  currency: string;
}

export interface RoutePoint {
  lat: number;
  lng: number;
  timestamp: Date;
}

export interface RideRequest {
  pickup: Location;
  destination: Location;
  vehicleType: VehicleType;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface RideEstimate {
  distance: number;
  duration: number;
  fare: Fare;
  availableDrivers: number;
  estimatedArrival: number; // in minutes
}

export interface RideRating {
  id: string;
  rideId: string;
  raterId: string;
  raterType: 'passenger' | 'driver';
  rating: number;
  comment?: string;
  createdAt: Date;
}

export interface DriverLocation {
  driverId: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  heading: number;
  isOnline: boolean;
  lastUpdated: Date;
}

export interface TripHistory {
  rides: Ride[];
  totalTrips: number;
  totalSpent?: number;
  totalEarned?: number;
  averageRating: number;
}

export interface RideFilters {
  status?: RideStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  vehicleType?: VehicleType[];
  minFare?: number;
  maxFare?: number;
}

export interface LiveRideUpdate {
  rideId: string;
  driverLocation?: {
    lat: number;
    lng: number;
  };
  status: RideStatus;
  estimatedArrival?: number;
  message?: string;
}