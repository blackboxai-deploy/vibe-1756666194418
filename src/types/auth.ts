import { USER_ROLES } from '@/lib/constants';

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  profilePicture?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser extends User {
  // Additional auth-specific properties can be added here
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: UserRole;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
}

export interface AuthError {
  message: string;
  code?: string;
  field?: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: AuthError | null;
}

// Driver-specific types
export interface DriverProfile extends User {
  licenseNumber: string;
  vehicleInfo: VehicleInfo;
  rating: number;
  totalTrips: number;
  isOnline: boolean;
  documentsVerified: boolean;
}

export interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  type: string;
}

// Passenger-specific types
export interface PassengerProfile extends User {
  preferredPaymentMethod?: string;
  rating: number;
  totalTrips: number;
  savedAddresses: SavedAddress[];
}

export interface SavedAddress {
  id: string;
  label: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}