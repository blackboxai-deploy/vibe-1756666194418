'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useRides } from '@/hooks/useRides';
import { useLocation } from '@/hooks/useLocation';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { Ride } from '@/types/ride';
import { RIDE_STATUS } from '@/lib/constants';

export default function PassengerDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { currentRide, rides, getRideHistory } = useRides();
  const { currentLocation, getCurrentLocation } = useLocation();
  const [recentRides, setRecentRides] = useState<Ride[]>([]);

  useEffect(() => {
    if (user) {
      getRideHistory(user.id, 1, 5).then(history => {
        if (history) {
          setRecentRides(history.rides);
        }
      });
    }
  }, [user, getRideHistory]);

  if (authLoading) {
    return <PageLoader />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case RIDE_STATUS.REQUESTED:
        return 'bg-yellow-100 text-yellow-800';
      case RIDE_STATUS.ACCEPTED:
      case RIDE_STATUS.DRIVER_ARRIVING:
        return 'bg-blue-100 text-blue-800';
      case RIDE_STATUS.IN_PROGRESS:
        return 'bg-green-100 text-green-800';
      case RIDE_STATUS.COMPLETED:
        return 'bg-gray-100 text-gray-800';
      case RIDE_STATUS.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAddress = (address: string) => {
    return address.length > 30 ? `${address.substring(0, 30)}...` : address;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
              <p className="text-gray-600 mt-1">Ready for your next ride?</p>
            </div>
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.profilePicture} alt={user?.name} />
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-green-600 text-white text-lg">
                {user?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Action Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Ride */}
            {currentRide ? (
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Current Ride</CardTitle>
                    <Badge className={getStatusColor(currentRide.status)}>
                      {currentRide.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5"></div>
                      <div>
                        <p className="text-sm text-gray-600">Pickup</p>
                        <p className="font-medium">{formatAddress(currentRide.pickup.address)}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5"></div>
                      <div>
                        <p className="text-sm text-gray-600">Destination</p>
                        <p className="font-medium">{formatAddress(currentRide.destination.address)}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-sm text-gray-600">
                        Fare: <span className="font-medium text-gray-900">${currentRide.fare.totalFare}</span>
                      </div>
                      <Button size="sm">Track Ride</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
                <CardContent className="p-8 text-center">
                  <h2 className="text-2xl font-bold mb-4">Book Your Next Ride</h2>
                  <p className="text-blue-100 mb-6">Get where you need to go quickly and safely</p>
                  <div className="space-y-3">
                    <Link href="/passenger/book-ride">
                      <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto">
                        Book a Ride
                      </Button>
                    </Link>
                    {currentLocation && (
                      <p className="text-sm text-blue-100">
                        Current location detected: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Trips */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Trips</CardTitle>
                  <Link href="/passenger/trip-history">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </div>
                <CardDescription>
                  Your latest ride history
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentRides.length > 0 ? (
                  <div className="space-y-4">
                    {recentRides.slice(0, 3).map((ride) => (
                      <div key={ride.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge className={getStatusColor(ride.status)}>
                              {ride.status}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {new Date(ride.requestedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-sm space-y-1">
                            <p className="text-gray-600">
                              <span className="text-green-600">From:</span> {formatAddress(ride.pickup.address)}
                            </p>
                            <p className="text-gray-600">
                              <span className="text-red-600">To:</span> {formatAddress(ride.destination.address)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${ride.fare.totalFare}</p>
                          <p className="text-sm text-gray-600">{ride.estimatedDistance} mi</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No trips yet</p>
                    <p className="text-sm">Your ride history will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Trips</span>
                  <span className="font-semibold">{rides.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-semibold">
                    {rides.filter(r => {
                      const rideDate = new Date(r.requestedAt);
                      const now = new Date();
                      return rideDate.getMonth() === now.getMonth() && rideDate.getFullYear() === now.getFullYear();
                    }).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Avg Rating</span>
                  <span className="font-semibold">4.8 ⭐</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Saved</span>
                  <span className="font-semibold text-green-600">$127.50</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/passenger/book-ride">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600">
                    Book a Ride
                  </Button>
                </Link>
                <Link href="/passenger/trip-history">
                  <Button variant="outline" className="w-full">
                    Trip History
                  </Button>
                </Link>
                <Link href="/passenger/profile">
                  <Button variant="outline" className="w-full">
                    Edit Profile
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={getCurrentLocation}
                >
                  Update Location
                </Button>
              </CardContent>
            </Card>

            {/* Promotions */}
            <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <CardContent className="p-4">
                <h3 className="font-bold mb-2">Weekend Special!</h3>
                <p className="text-sm text-purple-100 mb-3">
                  Get 20% off your next 3 rides
                </p>
                <Button size="sm" variant="outline" className="bg-white text-purple-600 hover:bg-gray-100">
                  Claim Offer
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}