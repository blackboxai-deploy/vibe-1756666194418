'use client';

import { useState, useEffect, useCallback } from 'react';
import { Location } from '@/types/ride';
import { calculateDistance } from '@/hooks/useLocation';

interface MapContainerProps {
  pickup?: Location;
  destination?: Location;
  onLocationSelect?: (location: Location) => void;
  showRoute?: boolean;
  height?: string;
  className?: string;
}

export default function MapContainer({
  pickup,
  destination,
  onLocationSelect,
  showRoute = false,
  height = '400px',
  className = ''
}: MapContainerProps) {
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // NYC default
  const [zoom, setZoom] = useState(13);

  // Update map center based on pickup/destination
  useEffect(() => {
    if (pickup && destination) {
      // Center map between pickup and destination
      const centerLat = (pickup.coordinates.lat + destination.coordinates.lat) / 2;
      const centerLng = (pickup.coordinates.lng + destination.coordinates.lng) / 2;
      setMapCenter({ lat: centerLat, lng: centerLng });
      
      // Adjust zoom based on distance
      const distance = calculateDistance(
        pickup.coordinates.lat,
        pickup.coordinates.lng,
        destination.coordinates.lat,
        destination.coordinates.lng
      );
      setZoom(distance > 10 ? 10 : distance > 5 ? 12 : 14);
    } else if (pickup) {
      setMapCenter(pickup.coordinates);
      setZoom(14);
    } else if (destination) {
      setMapCenter(destination.coordinates);
      setZoom(14);
    }
  }, [pickup, destination]);

  const handleMapClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!onLocationSelect) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert pixel coordinates to lat/lng (simplified calculation)
    const lat = mapCenter.lat + (0.5 - y / rect.height) * 0.01;
    const lng = mapCenter.lng + (x / rect.width - 0.5) * 0.01;
    
    const location: Location = {
      address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      coordinates: { lat, lng },
      placeId: `custom_${Date.now()}`
    };
    
    onLocationSelect(location);
  }, [mapCenter, onLocationSelect]);

  return (
    <div 
      className={`relative bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 ${className}`}
      style={{ height }}
      onClick={handleMapClick}
    >
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-50 to-gray-100">
        {/* Grid lines to simulate map */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#374151" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoom(prev => Math.min(prev + 1, 18));
          }}
          className="bg-white hover:bg-gray-50 border border-gray-300 rounded px-3 py-1 text-sm font-medium shadow-sm"
        >
          +
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoom(prev => Math.max(prev - 1, 8));
          }}
          className="bg-white hover:bg-gray-50 border border-gray-300 rounded px-3 py-1 text-sm font-medium shadow-sm"
        >
          −
        </button>
      </div>

      {/* Pickup Pin */}
      {pickup && (
        <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-full z-20">
          <div className="bg-green-500 text-white p-2 rounded-lg shadow-lg text-xs font-medium min-w-max">
            Pickup
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-green-500"></div>
            </div>
          </div>
          <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      )}

      {/* Destination Pin */}
      {destination && (
        <div className="absolute top-1/3 right-1/3 transform -translate-x-1/2 -translate-y-full z-20">
          <div className="bg-red-500 text-white p-2 rounded-lg shadow-lg text-xs font-medium min-w-max">
            Destination
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500"></div>
            </div>
          </div>
          <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      )}

      {/* Route Line */}
      {showRoute && pickup && destination && (
        <svg className="absolute inset-0 w-full h-full z-10">
          <line
            x1="33%"
            y1="50%"
            x2="67%"
            y2="33%"
            stroke="#3B82F6"
            strokeWidth="3"
            strokeDasharray="5,5"
            className="drop-shadow-sm"
          />
        </svg>
      )}

      {/* Center crosshair when no specific location */}
      {!pickup && !destination && onLocationSelect && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-8 h-8 border-2 border-blue-500 rounded-full bg-white shadow-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      )}

      {/* Map Info */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs text-gray-600">
        <div>Zoom: {zoom}</div>
        <div>Center: {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}</div>
        {pickup && destination && (
          <div className="text-blue-600 font-medium">
            Distance: {calculateDistance(
              pickup.coordinates.lat,
              pickup.coordinates.lng,
              destination.coordinates.lat,
              destination.coordinates.lng
            )} mi
          </div>
        )}
      </div>

      {/* Click instruction */}
      {onLocationSelect && !pickup && !destination && (
        <div className="absolute bottom-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-medium">
          Click to select location
        </div>
      )}
    </div>
  );
}