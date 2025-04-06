
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

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

// This component handles map clicks and updates the marker position
const LocationMarker = ({ position, setPosition, readOnly, onLocationSelected }: {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
  readOnly: boolean;
  onLocationSelected: (lat: number, lng: number) => void;
}) => {
  const map = useMapEvents({
    click: (e) => {
      if (readOnly) return;
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelected(lat, lng);
    }
  });

  return position ? <Marker position={position} /> : null;
};

const LocationPicker = ({ 
  onLocationSelected, 
  initialLat = DEFAULT_LAT, 
  initialLng = DEFAULT_LNG,
  readOnly = false,
  className = ""
}: LocationPickerProps) => {
  const [position, setPosition] = useState<[number, number]>([initialLat, initialLng]);
  
  useEffect(() => {
    // Update position if initialLat or initialLng changes
    setPosition([initialLat, initialLng]);
  }, [initialLat, initialLng]);
  
  return (
    <div className={`relative ${className}`}>
      <div className="w-full h-64 rounded-md overflow-hidden">
        <MapContainer 
          key={`map-${position[0]}-${position[1]}`}
          style={{ height: "100%", width: "100%" }}
          zoom={DEFAULT_ZOOM} 
          scrollWheelZoom={!readOnly}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker 
            position={position} 
            setPosition={setPosition} 
            readOnly={readOnly} 
            onLocationSelected={onLocationSelected}
          />
        </MapContainer>

        {readOnly ? null : (
          <div className="absolute bottom-3 right-3 bg-white rounded-md shadow-md p-2 text-xs max-w-[180px] z-[1000]">
            Click on the map to select the exact location of the issue
          </div>
        )}
      </div>
      
      {/* Coordinates display below map */}
      <div className="mt-2 text-center text-xs text-muted-foreground">
        {position[0].toFixed(6)}, {position[1].toFixed(6)}
      </div>
    </div>
  );
};

export default LocationPicker;
