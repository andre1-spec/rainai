import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Polygon } from 'react-leaflet';


interface MapBackgroundProps {
  targetLocation: [number, number] | null;
  showScanner: boolean;
}

// Map hook to handle flying to the location
function LocationController({ targetLocation }: { targetLocation: [number, number] | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (targetLocation) {
      // Fly to the location with a smooth animation and high zoom
      map.flyTo(targetLocation, 19, {
        duration: 2.5,
        easeLinearity: 0.25
      });
    }
  }, [targetLocation, map]);

  return null;
}

// Mock building polygon coordinates (relative to target location)
const getBuildingPolygon = (center: [number, number]): [number, number][] => {
  const [lat, lng] = center;
  const offsetLat = 0.00015;
  const offsetLng = 0.00025;
  
  return [
    [lat + offsetLat, lng - offsetLng],
    [lat + offsetLat, lng + offsetLng],
    [lat - offsetLat, lng + offsetLng],
    [lat - offsetLat, lng - offsetLng]
  ];
};

export const MapBackground: React.FC<MapBackgroundProps> = ({ targetLocation, showScanner }) => {
  // Default view: Center of Essen, Germany (zoomed out slightly)
  const defaultCenter: [number, number] = [51.4556, 7.0116];
  
  return (
    <div className="absolute inset-0 z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        zoomControl={false}
        className="w-full h-full"
      >
        {/* CartoDB Dark Matter base map */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <LocationController targetLocation={targetLocation} />
        
        {/* Render the building polygon when scanning */}
        {showScanner && targetLocation && (
          <Polygon 
            positions={getBuildingPolygon(targetLocation)}
            pathOptions={{
              color: '#d946ef', // rainai-pink
              fillColor: '#db2777', // rainai-magenta
              fillOpacity: 0.2,
              weight: 3,
              dashArray: '5, 5',
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};
