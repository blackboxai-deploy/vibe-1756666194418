'use client';

import Header from '@/components/layout/Header';
import RideBookingForm from '@/components/ride/RideBookingForm';
import { useRequireAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/common/LoadingSpinner';

export default function BookRidePage() {
  const { isLoading } = useRequireAuth('passenger');

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book Your Ride</h1>
          <p className="text-gray-600 mt-2">Get where you need to go safely and comfortably</p>
        </div>
        
        <RideBookingForm />
      </div>
    </div>
  );
}