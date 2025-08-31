'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MapContainer from '@/components/maps/MapContainer';
import { useLocation, useGeocoding } from '@/hooks/useLocation';
import { useRides } from '@/hooks/useRides';
import { useAuth } from '@/hooks/useAuth';
import { Location, RideRequest, RideEstimate, VehicleType, PaymentMethod } from '@/types/ride';
import { VEHICLE_TYPES, PAYMENT_METHODS } from '@/lib/constants';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function RideBookingForm() {
  const { user } = useAuth();
  const { currentLocation } = useLocation();
  const { geocodeAddress, reverseGeocode } = useGeocoding();
  const { estimateRide, bookRide, isLoading: ridesLoading } = useRides();

  const [step, setStep] = useState<'locations' | 'vehicle' | 'confirm'>('locations');
  const [pickup, setPickup] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>(VEHICLE_TYPES.STANDARD);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PAYMENT_METHODS.CREDIT_CARD);
  const [notes, setNotes] = useState('');
  const [estimate, setEstimate] = useState<RideEstimate | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set current location as pickup when available
  useEffect(() => {
    if (currentLocation && !pickup) {
      reverseGeocode(currentLocation.lat, currentLocation.lng).then(address => {
        if (address) {
          const currentLocationObj: Location = {
            address,
            coordinates: currentLocation,
            placeId: 'current_location'
          };
          setPickup(currentLocationObj);
          setPickupAddress(address);
        }
      });
    }
  }, [currentLocation, pickup, reverseGeocode]);

  const handleAddressSearch = async (address: string, type: 'pickup' | 'destination') => {
    if (address.trim().length < 3) return;

    const location = await geocodeAddress(address);
    if (location) {
      if (type === 'pickup') {
        setPickup(location);
        setPickupAddress(location.address);
      } else {
        setDestination(location);
        setDestinationAddress(location.address);
      }
    }
  };

  const handleMapLocationSelect = (location: Location, type: 'pickup' | 'destination') => {
    if (type === 'pickup') {
      setPickup(location);
      setPickupAddress(location.address);
    } else {
      setDestination(location);
      setDestinationAddress(location.address);
    }
  };

  const handleGetEstimate = async () => {
    if (!pickup || !destination) {
      setError('Please select both pickup and destination locations');
      return;
    }

    setIsEstimating(true);
    setError(null);

    const request: RideRequest = {
      pickup,
      destination,
      vehicleType,
      paymentMethod,
      notes: notes.trim()
    };

    const rideEstimate = await estimateRide(request);
    if (rideEstimate) {
      setEstimate(rideEstimate);
      setStep('vehicle');
    } else {
      setError('Failed to get ride estimate. Please try again.');
    }

    setIsEstimating(false);
  };

  const handleBookRide = async () => {
    if (!pickup || !destination || !user) {
      setError('Missing required information');
      return;
    }

    const request: RideRequest = {
      pickup,
      destination,
      vehicleType,
      paymentMethod,
      notes: notes.trim()
    };

    const ride = await bookRide(request, user.id);
    if (ride) {
      // Redirect to ride tracking or dashboard
      window.location.href = '/passenger/dashboard';
    } else {
      setError('Failed to book ride. Please try again.');
    }
  };

  const getVehicleInfo = (type: VehicleType) => {
    const info = {
      [VEHICLE_TYPES.STANDARD]: {
        name: 'Standard',
        description: 'Affordable rides for everyday travel',
        capacity: '1-4 passengers',
        eta: '5-10 min',
        multiplier: 1.0
      },
      [VEHICLE_TYPES.PREMIUM]: {
        name: 'Premium',
        description: 'Upgraded experience with newer vehicles',
        capacity: '1-4 passengers',
        eta: '3-8 min',
        multiplier: 1.4
      },
      [VEHICLE_TYPES.XL]: {
        name: 'XL',
        description: 'Extra space for groups and luggage',
        capacity: '1-6 passengers',
        eta: '5-12 min',
        multiplier: 1.6
      },
      [VEHICLE_TYPES.LUXURY]: {
        name: 'Luxury',
        description: 'Premium experience with luxury vehicles',
        capacity: '1-4 passengers',
        eta: '8-15 min',
        multiplier: 2.4
      }
    };
    return info[type];
  };

  if (step === 'locations') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Where are you going?</CardTitle>
            <CardDescription>
              Enter your pickup and destination locations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickup">Pickup Location</Label>
                <Input
                  id="pickup"
                  placeholder="Enter pickup address"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  onBlur={() => handleAddressSearch(pickupAddress, 'pickup')}
                />
                {pickup && (
                  <Badge variant="outline" className="text-green-600">
                    ✓ Location set
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  placeholder="Enter destination address"
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                  onBlur={() => handleAddressSearch(destinationAddress, 'destination')}
                />
                {destination && (
                  <Badge variant="outline" className="text-red-600">
                    ✓ Location set
                  </Badge>
                )}
              </div>
            </div>

            <MapContainer
              pickup={pickup || undefined}
              destination={destination || undefined}
              showRoute={!!(pickup && destination)}
              height="300px"
              onLocationSelect={(location) => {
                if (!pickup) {
                  handleMapLocationSelect(location, 'pickup');
                } else if (!destination) {
                  handleMapLocationSelect(location, 'destination');
                }
              }}
            />

            <div className="flex justify-center">
              <Button
                onClick={handleGetEstimate}
                disabled={!pickup || !destination || isEstimating}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                {isEstimating ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Getting Estimate...
                  </>
                ) : (
                  'Get Estimate'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'vehicle') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Choose Your Ride</CardTitle>
            <CardDescription>
              Select vehicle type and payment method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Trip Summary */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">From:</span>
                <span className="font-medium">{pickup?.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">To:</span>
                <span className="font-medium">{destination?.address}</span>
              </div>
              {estimate && (
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm text-gray-600">
                    {estimate.distance} mi • {estimate.duration} min
                  </span>
                  <span className="text-sm text-gray-600">
                    {estimate.availableDrivers} drivers nearby
                  </span>
                </div>
              )}
            </div>

            {/* Vehicle Selection */}
            <div className="space-y-4">
              <Label>Vehicle Type</Label>
              <div className="grid gap-4">
                {Object.values(VEHICLE_TYPES).map((type) => {
                  const vehicleInfo = getVehicleInfo(type);
                  const fare = estimate ? estimate.fare.totalFare * vehicleInfo.multiplier : 0;
                  
                  return (
                    <div
                      key={type}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        vehicleType === type 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setVehicleType(type)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{vehicleInfo.name}</h3>
                          <p className="text-sm text-gray-600">{vehicleInfo.description}</p>
                          <p className="text-sm text-gray-500">{vehicleInfo.capacity} • {vehicleInfo.eta}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">${fare.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">
                            ETA {estimate?.estimatedArrival || 5} min
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PAYMENT_METHODS.CREDIT_CARD}>Credit Card</SelectItem>
                  <SelectItem value={PAYMENT_METHODS.DEBIT_CARD}>Debit Card</SelectItem>
                  <SelectItem value={PAYMENT_METHODS.DIGITAL_WALLET}>Digital Wallet</SelectItem>
                  <SelectItem value={PAYMENT_METHODS.CASH}>Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Special Instructions (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any special instructions for your driver..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => setStep('locations')} className="flex-1">
                Back
              </Button>
              <Button
                onClick={() => setStep('confirm')}
                className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                Review Booking
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Confirmation step
  const selectedVehicle = getVehicleInfo(vehicleType);
  const finalFare = estimate ? estimate.fare.totalFare * selectedVehicle.multiplier : 0;

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Confirm Your Booking</CardTitle>
          <CardDescription>
            Review your ride details and confirm
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Booking Summary */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold">Trip Details</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Pickup:</span>
                  <span className="font-medium">{pickup?.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Destination:</span>
                  <span className="font-medium">{destination?.address}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold">Ride Options</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle Type:</span>
                  <span className="font-medium">{selectedVehicle.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium capitalize">{paymentMethod.replace('_', ' ')}</span>
                </div>
                {estimate && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distance:</span>
                      <span className="font-medium">{estimate.distance} mi</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{estimate.duration} min</span>
                    </div>
                  </>
                )}
                {notes && (
                  <div className="pt-2 border-t">
                    <span className="text-gray-600">Notes:</span>
                    <p className="text-sm mt-1">{notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Fare</span>
                <span className="text-2xl font-bold text-blue-600">${finalFare.toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                ETA: {estimate?.estimatedArrival || 5} minutes
              </p>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => setStep('vehicle')} className="flex-1">
              Back
            </Button>
            <Button
              onClick={handleBookRide}
              disabled={ridesLoading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              {ridesLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Booking Ride...
                </>
              ) : (
                'Confirm & Book Ride'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}