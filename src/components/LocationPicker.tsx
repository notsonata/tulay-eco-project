
import { useState, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";

interface LocationPickerProps {
  onLocationSelected: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
  readOnly?: boolean;
  className?: string;
}

// SAN PEDRO, LAGUNA center coordinates
const DEFAULT_LAT = 14.3583;
const DEFAULT_LNG = 121.0560;
const DEFAULT_ZOOM = 14;

// This is a mock implementation that shows a static map with a pin
// In a real app, this would use Leaflet.js or Mapbox GL
const LocationPicker = ({ 
  onLocationSelected, 
  initialLat = DEFAULT_LAT, 
  initialLng = DEFAULT_LNG,
  readOnly = false,
  className = ""
}: LocationPickerProps) => {
  const [selectedLat, setSelectedLat] = useState(initialLat);
  const [selectedLng, setSelectedLng] = useState(initialLng);
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Simulate map click
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (readOnly) return;
    
    // Get click position relative to map container
    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Convert to "pretend" lat/lng (not accurate but simulates the interaction)
      // In a real implementation, this would use the mapping library's conversion
      const width = rect.width;
      const height = rect.height;
      
      // Simulate a small area around San Pedro with the map
      const latRange = 0.02; // ~2km north-south
      const lngRange = 0.02; // ~2km east-west
      
      const newLat = DEFAULT_LAT + (latRange / 2) - (y / height * latRange);
      const newLng = DEFAULT_LNG - (lngRange / 2) + (x / width * lngRange);
      
      setSelectedLat(newLat);
      setSelectedLng(newLng);
      onLocationSelected(newLat, newLng);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapRef}
        onClick={handleMapClick}
        className={`relative w-full h-64 bg-gray-100 rounded-md overflow-hidden cursor-${readOnly ? 'default' : 'crosshair'}`}
      >
        {/* This would be a real map in production */}
        <div className="absolute inset-0 bg-green-50">
          {/* Simulated map UI */}
          <div className="w-full h-full bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/121.0560,14.3583,14,0/600x400?access_token=pk.demo')] bg-center bg-cover opacity-95">
            {/* Fake map elements */}
            <div className="absolute top-3 right-3 bg-white shadow-md rounded p-2 text-xs">
              San Pedro, Laguna
            </div>
            <div className="absolute bottom-3 left-3 bg-white bg-opacity-75 text-xs p-1 rounded">
              {selectedLat.toFixed(6)}, {selectedLng.toFixed(6)}
            </div>
          </div>
        </div>
        
        {/* Pin marker */}
        <div 
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-full"
          style={{ marginLeft: 0, marginTop: 0 }}
        >
          <MapPin className="h-8 w-8 text-primary drop-shadow-md" />
        </div>
        
        {readOnly ? null : (
          <div className="absolute bottom-3 right-3 bg-white rounded-md shadow-md p-2 text-xs max-w-[180px]">
            Click on the map to select the exact location of the issue
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;
