// --- START OF FILE LocationPicker.tsx ---

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
// Removed: import { MapPin } from "lucide-react"; // Was unused
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Leaflet when using bundlers like Vite/Webpack
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

// SAN PEDRO, LAGUNA center coordinates (or your preferred default)
const DEFAULT_LAT = 14.3583;
const DEFAULT_LNG = 121.0560;
const DEFAULT_ZOOM = 14;

// This component handles map clicks, updates the marker position, and animates the map view
const LocationMarker = ({
  position,
  setPosition,
  readOnly,
  onLocationSelected,
}: {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
  readOnly: boolean;
  onLocationSelected: (lat: number, lng: number) => void;
}) => {
  const map = useMapEvents({
    click: (e) => {
      if (readOnly) return; // Do nothing if readOnly
      const { lat, lng } = e.latlng;
      const newPos: [number, number] = [lat, lng];
      setPosition(newPos); // Update the state holding the marker position
      onLocationSelected(lat, lng); // Callback to parent component
      map.flyTo(e.latlng, map.getZoom()); // Smoothly animate map view to the clicked point
    },
  });

  // Render the marker at the current position state
  return position ? <Marker position={position} /> : null;
};

const LocationPicker = ({
  onLocationSelected,
  initialLat = DEFAULT_LAT,
  initialLng = DEFAULT_LNG,
  readOnly = false,
  className = "h-64 w-full",
}: LocationPickerProps) => {
  // State for the marker's position
  const [position, setPosition] = useState<[number, number]>([
    initialLat,
    initialLng,
  ]);

  // Define the initial center for the map container based on props
  const initialCenter: L.LatLngExpression = [initialLat, initialLng];

  // Effect to update the marker's position if the initial props change externally
  useEffect(() => {
    setPosition([initialLat, initialLng]);
    // Note: We don't automatically flyTo here, as the prop change might happen
    // while the user is interacting with the map. The initialCenter handles the load.
  }, [initialLat, initialLng]);

  return (
    <div className={`relative ${className}`}>
      <div className="w-full h-full rounded-md overflow-hidden border border-input"> {/* Added subtle border */}
        <MapContainer
          center={initialCenter} // Use the initial center for map load
          zoom={DEFAULT_ZOOM}
          style={{ height: "100%", width: "100%" }}
          dragging={!readOnly} // Disable dragging if readOnly
          scrollWheelZoom={!readOnly} // Disable scroll wheel zoom if readOnly
          doubleClickZoom={!readOnly} // Disable double click zoom if readOnly
          zoomControl={!readOnly} // Hide zoom controls if readOnly
          attributionControl={!readOnly} // Optionally hide attribution if readOnly
        >
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Render the marker and handle clicks via the LocationMarker component */}
          <LocationMarker
            position={position}
            setPosition={setPosition}
            readOnly={readOnly}
            onLocationSelected={onLocationSelected}
          />
        </MapContainer>

        {/* Helper text displayed only when not readOnly */}
        {readOnly ? null : (
          <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm rounded-md shadow-md p-2 text-xs max-w-[180px] z-[1000] pointer-events-none">
            Click on the map to select the exact location.
          </div>
        )}
      </div>
      
    </div>
  );
};

export default LocationPicker;
// --- END OF FILE LocationPicker.tsx ---