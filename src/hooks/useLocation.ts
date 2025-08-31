'use client';

import { useState, useEffect, useCallback } from 'react';
import { Location } from '@/types/ride';

interface LocationState {
  currentLocation: {
    lat: number;
    lng: number;
  } | null;
  isLoading: boolean;
  error: string | null;
  permissionGranted: boolean;
}

export function useLocation() {
  const [locationState, setLocationState] = useState<LocationState>({
    currentLocation: null,
    isLoading: false,
    error: null,
    permissionGranted: false
  });

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser',
        isLoading: false
      }));
      return;
    }

    setLocationState(prev => ({ ...prev, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationState({
          currentLocation: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          isLoading: false,
          error: null,
          permissionGranted: true
        });
      },
      (error) => {
        let errorMessage = 'Failed to get location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }

        setLocationState({
          currentLocation: null,
          isLoading: false,
          error: errorMessage,
          permissionGranted: false
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }, []);

  const watchLocation = useCallback((callback: (location: { lat: number; lng: number }) => void) => {
    if (!navigator.geolocation) {
      return null;
    }

    return navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        callback(location);
      },
      (error) => {
        console.error('Watch location error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 30000
      }
    );
  }, []);

  const clearWatch = useCallback((watchId: number | null) => {
    if (watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // Auto-request location on mount
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  return {
    ...locationState,
    getCurrentLocation,
    watchLocation,
    clearWatch
  };
}

// Hook for geocoding (address to coordinates conversion)
export function useGeocoding() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const geocodeAddress = useCallback(async (address: string): Promise<Location | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock geocoding service (in a real app, use Google Maps Geocoding API)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      // Mock coordinates for demo purposes
      const mockCoordinates = {
        'times square, new york': { lat: 40.7580, lng: -73.9855 },
        'central park, new york': { lat: 40.7829, lng: -73.9654 },
        'brooklyn bridge, new york': { lat: 40.7061, lng: -73.9969 },
        'jfk airport, new york': { lat: 40.6413, lng: -73.7781 },
        'laguardia airport, new york': { lat: 40.7769, lng: -73.8740 }
      };

      const normalizedAddress = address.toLowerCase();
      const coords = mockCoordinates[normalizedAddress as keyof typeof mockCoordinates] || {
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: -74.0060 + (Math.random() - 0.5) * 0.1
      };

      const location: Location = {
        address,
        coordinates: coords,
        placeId: `place_${Date.now()}`
      };

      setIsLoading(false);
      return location;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to geocode address';
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  }, []);

  const reverseGeocode = useCallback(async (lat: number, lng: number): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock reverse geocoding (in a real app, use Google Maps Reverse Geocoding API)
      await new Promise(resolve => setTimeout(resolve, 800));

      // Generate a mock address
      const streetNumbers = [123, 456, 789, 101, 202, 303];
      const streetNames = ['Main St', 'Oak Ave', 'Broadway', 'First Ave', 'Park Blvd', 'Center St'];
      const cities = ['New York', 'Manhattan', 'Brooklyn', 'Queens'];

      const streetNumber = streetNumbers[Math.floor(Math.random() * streetNumbers.length)];
      const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];

      const address = `${streetNumber} ${streetName}, ${city}, NY`;

      setIsLoading(false);
      return address;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reverse geocode coordinates';
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  }, []);

  return {
    isLoading,
    error,
    geocodeAddress,
    reverseGeocode
  };
}

// Distance calculation utility
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}