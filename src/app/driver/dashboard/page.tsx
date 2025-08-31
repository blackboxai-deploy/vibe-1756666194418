'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useRides } from '@/hooks/useRides';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { Ride } from '@/types/ride';
import { RIDE_STATUS } from '@/lib/constants';

export default function DriverDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { getRideHistory, updateRideStatus } = useRides();
  const [isOnline, setIsOnline] = useState(true);
  const [currentRide, setCurrentRide] = useState<Ride | null>(null);
  const [recentRides, setRecentRides] = useState<Ride[]>([]);
  const [availableRides, setAvailableRides] = useState<Ride[]>([]);

  useEffect(() => {
    if (user) {
      getRideHistory(user.id, 1, 5).then(history => {
        if (history) {
          setRecentRides(history.rides);
          const active = history.rides.find(ride => 
            ![RIDE_STATUS.COMPLETED, RIDE_STATUS.CANCELLED].includes(ride.status as any)
          );
          setCurrentRide(active || null);
        }
      });

      // Mock available rides for demo
      setAvailableRides([
        {
          id: 'ride_new_001',
          passengerId: '3',
          pickup: {
            address: '567 Park Ave, New York, NY',
            coordinates: { lat: 40.7614, lng: -73.9776 }
          },
          destination: {
            address: '890 5th Ave, New York, NY',
            coordinates: { lat: 40.7796, lng: -73.9632 }
          },
          status: RIDE_STATUS.REQUESTED,
          vehicleType: 'standard',
          fare: {
            baseFare: 2.50,
            distanceFare: 4.20,
            timeFare: 2.10,
            surgeFare: 0,
            totalFare: 8.80,
            currency: 'USD'
          },
          estimatedDuration: 12,
          estimatedDistance: 2.3,
          requestedAt: new Date(),
          notes: 'Please call when you arrive'
        }
      ]);
    }
  }, [user, getRideHistory]);

  if (authLoading) {
    return <PageLoader />;
  }

  const handleAcceptRide = async (rideId: string) => {
    const success = await updateRideStatus(rideId, RIDE_STATUS.ACCEPTED);
    if (success) {
      const acceptedRide = availableRides.find(ride => ride.id === rideId);
      if (acceptedRide) {
        setCurrentRide({ ...acceptedRide, status: RIDE_STATUS.ACCEPTED, driverId: user?.id });
        setAvailableRides(prev => prev.filter(ride => ride.id !== rideId));
      }
    }
  };

  const handleUpdateRideStatus = async (rideId: string, status: string) => {
    await updateRideStatus(rideId, status as any);
    if (status === RIDE_STATUS.COMPLETED && currentRide?.id === rideId) {
      setCurrentRide(null);
      // Refresh recent rides
      if (user) {
        const history = await getRideHistory(user.id, 1, 5);
        if (history) {
          setRecentRides(history.rides);
        }
      }
    } else if (currentRide?.id === rideId) {
      setCurrentRide(prev => prev ? { ...prev, status: status as any } : null);
    }
  };

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
    return address.length > 40 ? `${address.substring(0, 40)}...` : address;
  };

  const todaysEarnings = recentRides
    .filter(ride => {
      const today = new Date();
      const rideDate = new Date(ride.requestedAt);
      return ride.status === RIDE_STATUS.COMPLETED &&
             rideDate.toDateString() === today.toDateString();
    })
    .reduce((sum, ride) => sum + (ride.fare.totalFare * 0.8), 0); // 80% to driver

  const weeklyEarnings = recentRides
    .filter(ride => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return ride.status === RIDE_STATUS.COMPLETED &&
             new Date(ride.requestedAt) >= weekAgo;
    })
    .reduce((sum, ride) => sum + (ride.fare.totalFare * 0.8), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Driver Status Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.profilePicture} alt={user?.name} />
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-green-600 text-white text-lg">
                  {user?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}</h1>
                <p className="text-gray-600">Ready to start earning?</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-sm font-medium">You're {isOnline ? 'Online' : 'Offline'}</span>
                <Switch checked={isOnline} onCheckedChange={setIsOnline} />
              </div>
              <Badge className={isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {isOnline ? '🟢 Available' : '🔴 Offline'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Ride */}
            {currentRide ? (
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Current Ride</CardTitle>
                    <Badge className={getStatusColor(currentRide.status)}>
                      {currentRide.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
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
                    {currentRide.notes && (
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <strong>Passenger Note:</strong> {currentRide.notes}
                        </p>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-sm text-gray-600">
                        You'll earn: <span className="font-medium text-green-600">${(currentRide.fare.totalFare * 0.8).toFixed(2)}</span>
                      </div>
                      <div className="space-x-2">
                        {currentRide.status === RIDE_STATUS.ACCEPTED && (
                          <Button 
                            size="sm" 
                            onClick={() => handleUpdateRideStatus(currentRide.id, RIDE_STATUS.IN_PROGRESS)}
                          >
                            Start Trip
                          </Button>
                        )}
                        {currentRide.status === RIDE_STATUS.IN_PROGRESS && (
                          <Button 
                            size="sm" 
                            onClick={() => handleUpdateRideStatus(currentRide.id, RIDE_STATUS.COMPLETED)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Complete Trip
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUpdateRideStatus(currentRide.id, RIDE_STATUS.CANCELLED)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : isOnline ? (
              <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                <CardContent className="p-8 text-center">
                  <h2 className="text-2xl font-bold mb-4">You're Online!</h2>
                  <p className="text-green-100 mb-6">
                    Looking for ride requests in your area...
                  </p>
                  <div className="animate-pulse">
                    <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <div className="w-8 h-8 bg-white rounded-full"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-100">
                <CardContent className="p-8 text-center">
                  <h2 className="text-2xl font-bold mb-4 text-gray-700">You're Offline</h2>
                  <p className="text-gray-600 mb-6">
                    Turn on availability to start receiving ride requests
                  </p>
                  <Button 
                    onClick={() => setIsOnline(true)}
                    className="bg-gradient-to-r from-green-600 to-blue-600"
                  >
                    Go Online
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Available Rides */}
            {isOnline && !currentRide && availableRides.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Available Rides</CardTitle>
                  <CardDescription>
                    New ride requests in your area
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {availableRides.map((ride) => (
                      <div key={ride.id} className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <Badge className="bg-yellow-100 text-yellow-800">New Request</Badge>
                          <span className="font-bold text-lg text-green-600">
                            ${(ride.fare.totalFare * 0.8).toFixed(2)}
                          </span>
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-start space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                            <div className="text-sm">
                              <span className="text-gray-600">Pickup: </span>
                              <span className="font-medium">{formatAddress(ride.pickup.address)}</span>
                            </div>
                          </div>
                          <div className="flex items-start space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full mt-1"></div>
                            <div className="text-sm">
                              <span className="text-gray-600">Drop-off: </span>
                              <span className="font-medium">{formatAddress(ride.destination.address)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            {ride.estimatedDistance} mi • {ride.estimatedDuration} min
                          </div>
                          <Button 
                            size="sm"
                            onClick={() => handleAcceptRide(ride.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Accept Ride
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Trips */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Trips</CardTitle>
                <CardDescription>
                  Your completed rides
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentRides.filter(ride => ride.status === RIDE_STATUS.COMPLETED).length > 0 ? (
                  <div className="space-y-4">
                    {recentRides
                      .filter(ride => ride.status === RIDE_STATUS.COMPLETED)
                      .slice(0, 3)
                      .map((ride) => (
                      <div key={ride.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="text-sm text-gray-600 mb-1">
                            {new Date(ride.completedAt || ride.requestedAt).toLocaleDateString()}
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
                          <p className="font-medium text-green-600">+${(ride.fare.totalFare * 0.8).toFixed(2)}</p>
                          <p className="text-sm text-gray-600">{ride.estimatedDistance} mi</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No completed trips yet</p>
                    <p className="text-sm">Your earnings will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Earnings Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Earnings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">${todaysEarnings.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Today's total</div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">This week</span>
                    <span className="font-semibold">${weeklyEarnings.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Trips today</span>
                    <span className="font-semibold">
                      {recentRides.filter(ride => {
                        const today = new Date();
                        const rideDate = new Date(ride.requestedAt);
                        return ride.status === RIDE_STATUS.COMPLETED &&
                               rideDate.toDateString() === today.toDateString();
                      }).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-semibold">4.9 ⭐</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Online time</span>
                    <span className="font-semibold">{isOnline ? '2h 15m' : '0h 0m'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className={`w-full ${isOnline 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-gradient-to-r from-green-600 to-blue-600'
                  }`}
                  onClick={() => setIsOnline(!isOnline)}
                >
                  {isOnline ? 'Go Offline' : 'Go Online'}
                </Button>
                <Button variant="outline" className="w-full">
                  View Earnings
                </Button>
                <Button variant="outline" className="w-full">
                  Update Profile
                </Button>
                <Button variant="outline" className="w-full">
                  Vehicle Info
                </Button>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
              <CardContent className="p-4">
                <h3 className="font-bold mb-2">💡 Driving Tip</h3>
                <p className="text-sm text-yellow-100 mb-3">
                  Stay online during peak hours (7-9 AM, 5-8 PM) to maximize your earnings!
                </p>
                <Button size="sm" variant="outline" className="bg-white text-orange-600 hover:bg-gray-100">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}