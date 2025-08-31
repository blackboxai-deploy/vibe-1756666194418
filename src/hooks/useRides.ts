'use client';

import { useState, useCallback } from 'react';
import { Ride, RideRequest, RideEstimate, RideStatus, TripHistory } from '@/types/ride';
import { PRICING, RIDE_STATUS } from '@/lib/constants';
import { calculateDistance } from './useLocation';

interface RideState {
  currentRide: Ride | null;
  rides: Ride[];
  isLoading: boolean;
  error: string | null;
}

// Mock rides database
let mockRides: Ride[] = [];
let rideIdCounter = 1;

export function useRides(userId?: string) {
  const [rideState, setRideState] = useState<RideState>({
    currentRide: null,
    rides: [],
    isLoading: false,
    error: null
  });

  const calculateFare = useCallback((distance: number, duration: number, surgeMultiplier: number = 1): {
    baseFare: number;
    distanceFare: number;
    timeFare: number;
    surgeFare: number;
    totalFare: number;
    currency: string;
  } => {
    const baseFare = PRICING.baseFare;
    const distanceFare = distance * PRICING.perMile;
    const timeFare = duration * PRICING.perMinute;
    const subtotal = baseFare + distanceFare + timeFare;
    const surgeFare = subtotal * (surgeMultiplier - 1);
    const totalFare = subtotal + surgeFare;

    return {
      baseFare,
      distanceFare,
      timeFare,
      surgeFare,
      totalFare: Math.round(totalFare * 100) / 100,
      currency: 'USD'
    };
  }, []);

  const estimateRide = useCallback(async (request: RideRequest): Promise<RideEstimate | null> => {
    setRideState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const distance = calculateDistance(
        request.pickup.coordinates.lat,
        request.pickup.coordinates.lng,
        request.destination.coordinates.lat,
        request.destination.coordinates.lng
      );

      // Estimate duration (simplified calculation)
      const duration = Math.max(distance * 2.5, 5); // Minimum 5 minutes
      
      // Mock surge pricing
      const surgeMultiplier = Math.random() > 0.7 ? PRICING.surgePricing.high : PRICING.surgePricing.standard;
      
      const fare = calculateFare(distance, duration, surgeMultiplier);
      
      const estimate: RideEstimate = {
        distance,
        duration,
        fare,
        availableDrivers: Math.floor(Math.random() * 10) + 1,
        estimatedArrival: Math.floor(Math.random() * 8) + 2 // 2-10 minutes
      };

      setRideState(prev => ({ ...prev, isLoading: false }));
      return estimate;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to estimate ride';
      setRideState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      return null;
    }
  }, [calculateFare]);

  const bookRide = useCallback(async (request: RideRequest, passengerId: string): Promise<Ride | null> => {
    setRideState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const distance = calculateDistance(
        request.pickup.coordinates.lat,
        request.pickup.coordinates.lng,
        request.destination.coordinates.lat,
        request.destination.coordinates.lng
      );

      const duration = Math.max(distance * 2.5, 5);
      const surgeMultiplier = Math.random() > 0.7 ? PRICING.surgePricing.high : PRICING.surgePricing.standard;
      const fare = calculateFare(distance, duration, surgeMultiplier);

      const newRide: Ride = {
        id: `ride_${rideIdCounter++}`,
        passengerId,
        pickup: request.pickup,
        destination: request.destination,
        status: RIDE_STATUS.REQUESTED,
        vehicleType: request.vehicleType,
        fare,
        estimatedDuration: duration,
        estimatedDistance: distance,
        requestedAt: new Date(),
        notes: request.notes
      };

      mockRides.push(newRide);

      setRideState(prev => ({ 
        ...prev, 
        currentRide: newRide,
        rides: [newRide, ...prev.rides],
        isLoading: false 
      }));

      // Simulate driver assignment after 3-8 seconds
      setTimeout(() => {
        const updatedRide = { ...newRide, status: RIDE_STATUS.ACCEPTED as RideStatus, acceptedAt: new Date() };
        mockRides = mockRides.map(r => r.id === newRide.id ? updatedRide : r);
        setRideState(prev => ({ 
          ...prev, 
          currentRide: updatedRide,
          rides: prev.rides.map(r => r.id === newRide.id ? updatedRide : r)
        }));
      }, Math.random() * 5000 + 3000);

      return newRide;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to book ride';
      setRideState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      return null;
    }
  }, [calculateFare]);

  const getRideHistory = useCallback(async (userId: string, page: number = 1, limit: number = 20): Promise<TripHistory | null> => {
    setRideState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      const userRides = mockRides
        .filter(ride => ride.passengerId === userId || ride.driverId === userId)
        .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());

      const startIndex = (page - 1) * limit;
      const paginatedRides = userRides.slice(startIndex, startIndex + limit);

      const totalSpent = userRides
        .filter(ride => ride.passengerId === userId && ride.status === RIDE_STATUS.COMPLETED)
        .reduce((sum, ride) => sum + ride.fare.totalFare, 0);

      const totalEarned = userRides
        .filter(ride => ride.driverId === userId && ride.status === RIDE_STATUS.COMPLETED)
        .reduce((sum, ride) => sum + ride.fare.totalFare * 0.8, 0); // 80% to driver

      const completedRides = userRides.filter(ride => 
        ride.status === RIDE_STATUS.COMPLETED && ride.rating
      );
      
      const averageRating = completedRides.length > 0 
        ? completedRides.reduce((sum, ride) => sum + (ride.rating?.rating || 0), 0) / completedRides.length
        : 0;

      const history: TripHistory = {
        rides: paginatedRides,
        totalTrips: userRides.length,
        totalSpent: Math.round(totalSpent * 100) / 100,
        totalEarned: Math.round(totalEarned * 100) / 100,
        averageRating: Math.round(averageRating * 10) / 10
      };

      setRideState(prev => ({ 
        ...prev, 
        rides: paginatedRides,
        isLoading: false 
      }));

      return history;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get ride history';
      setRideState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      return null;
    }
  }, []);

  const updateRideStatus = useCallback(async (rideId: string, status: RideStatus): Promise<boolean> => {
    try {
      const rideIndex = mockRides.findIndex(r => r.id === rideId);
      if (rideIndex === -1) return false;

      const updatedRide = { ...mockRides[rideIndex], status };
      
      // Add timestamps based on status
      switch (status) {
        case RIDE_STATUS.ACCEPTED:
          updatedRide.acceptedAt = new Date();
          break;
        case RIDE_STATUS.IN_PROGRESS:
          updatedRide.startedAt = new Date();
          break;
        case RIDE_STATUS.COMPLETED:
          updatedRide.completedAt = new Date();
          break;
        case RIDE_STATUS.CANCELLED:
          updatedRide.cancelledAt = new Date();
          break;
      }

      mockRides[rideIndex] = updatedRide;

      setRideState(prev => ({ 
        ...prev,
        currentRide: prev.currentRide?.id === rideId ? updatedRide : prev.currentRide,
        rides: prev.rides.map(r => r.id === rideId ? updatedRide : r)
      }));

      return true;
    } catch (error) {
      console.error('Failed to update ride status:', error);
      return false;
    }
  }, []);

  const cancelRide = useCallback(async (rideId: string): Promise<boolean> => {
    return updateRideStatus(rideId, RIDE_STATUS.CANCELLED);
  }, [updateRideStatus]);

  const clearError = useCallback(() => {
    setRideState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...rideState,
    estimateRide,
    bookRide,
    getRideHistory,
    updateRideStatus,
    cancelRide,
    clearError
  };
}