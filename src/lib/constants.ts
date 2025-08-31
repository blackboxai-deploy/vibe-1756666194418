// Application constants and configuration
export const APP_CONFIG = {
  name: 'RideShare',
  description: 'Your reliable ride-hailing platform',
  version: '1.0.0',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

// API Configuration
export const API_CONFIG = {
  openrouter: {
    baseUrl: 'https://oi-server.onrender.com/chat/completions',
    headers: {
      'customerId': 'cus_SF41H2fsJGwWIc',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer xxx'
    },
    defaultModel: 'openrouter/claude-sonnet-4'
  }
} as const;

// User roles
export const USER_ROLES = {
  PASSENGER: 'passenger',
  DRIVER: 'driver',
  ADMIN: 'admin'
} as const;

// Ride status constants
export const RIDE_STATUS = {
  REQUESTED: 'requested',
  ACCEPTED: 'accepted',
  DRIVER_ARRIVING: 'driver_arriving',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

// Payment methods
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  DIGITAL_WALLET: 'digital_wallet',
  CASH: 'cash'
} as const;

// Vehicle types
export const VEHICLE_TYPES = {
  STANDARD: 'standard',
  PREMIUM: 'premium',
  XL: 'xl',
  LUXURY: 'luxury'
} as const;

// Map configuration
export const MAP_CONFIG = {
  defaultCenter: { lat: 40.7128, lng: -74.0060 }, // New York City
  defaultZoom: 13,
  styles: {
    height: '400px',
    width: '100%'
  }
} as const;

// Price calculation constants
export const PRICING = {
  baseFare: 2.50,
  perMile: 1.85,
  perMinute: 0.35,
  surgePricing: {
    standard: 1.0,
    high: 1.5,
    veryHigh: 2.0
  }
} as const;

// Navigation routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  PASSENGER_DASHBOARD: '/passenger/dashboard',
  PASSENGER_BOOK: '/passenger/book-ride',
  PASSENGER_HISTORY: '/passenger/trip-history',
  PASSENGER_PROFILE: '/passenger/profile',
  DRIVER_DASHBOARD: '/driver/dashboard',
  DRIVER_EARNINGS: '/driver/earnings',
  DRIVER_PROFILE: '/driver/profile',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_TRIPS: '/admin/trips',
  ADMIN_ANALYTICS: '/admin/analytics'
} as const;

// Validation constraints
export const VALIDATION = {
  email: {
    minLength: 5,
    maxLength: 254
  },
  password: {
    minLength: 8,
    maxLength: 128
  },
  name: {
    minLength: 2,
    maxLength: 50
  },
  phone: {
    pattern: /^\+?[\d\s\-\(\)]{10,}$/
  }
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  RIDE_NOT_FOUND: 'Ride not found.',
  USER_NOT_FOUND: 'User not found.',
  INVALID_CREDENTIALS: 'Invalid email or password.'
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  RIDE_BOOKED: 'Your ride has been booked successfully!',
  RIDE_COMPLETED: 'Trip completed successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PAYMENT_PROCESSED: 'Payment processed successfully!'
} as const;