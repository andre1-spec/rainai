import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Polygon } from 'react-leaflet';


interface MapBackgroundProps {
  targetLocation: [number, number] | null;
  showScanner: boolean;
  flowState?: string;
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

export const MapBackground: React.FC<MapBackgroundProps> = ({ targetLocation, showScanner, flowState }) => {
  // Default view: Center of Essen, Germany (zoomed out slightly)
  const defaultCenter: [number, number] = [51.4556, 7.0116];
  
  return (
    <div className="absolute inset-0 z-0 bg-[#0a0a0a]">
      <style>{`
        .leaflet-tile-pane {
          filter: brightness(0.4) contrast(1.2) saturate(0.2); 
        }
      `}</style>
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        zoomControl={false}
        className="w-full h-full"
      >
        {/* Esri World Imagery Satellite Map */}
        <TileLayer
          attribution='Tiles &copy; Esri'
          url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          maxZoom={19}
        />
        
        <LocationController targetLocation={targetLocation} />
        
        {/* Render the building polygon when scanning */}
        {showScanner && targetLocation && (
          <Polygon 
            positions={getBuildingPolygon(targetLocation)}
            pathOptions={{
              color: flowState === 'done' ? '#22c55e' : '#d946ef', // green-500 or pink-500
              fillColor: flowState === 'done' ? '#16a34a' : '#db2777', // green-600 or magenta
              fillOpacity: 0.3,
              weight: 3,
              dashArray: flowState === 'done' ? '0' : '5, 5',
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};
