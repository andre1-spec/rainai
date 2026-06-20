import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Polygon, useMapEvents } from 'react-leaflet';

export type MapStyleType = 'satellite' | 'dark' | 'street';

interface MapBackgroundProps {
  targetLocation: [number, number] | null;
  targetPolygon?: [number, number][] | null;
  showScanner: boolean;
  flowState?: string;
  mapStyle: MapStyleType;
  onMapClick?: (lat: number, lng: number) => void;
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

function ClickHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    }
  });
  return null;
}

// Mock building polygon coordinates (fallback)
const getFallbackPolygon = (center: [number, number]): [number, number][] => {
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

export const MapBackground: React.FC<MapBackgroundProps> = ({ targetLocation, targetPolygon, showScanner, flowState, mapStyle, onMapClick }) => {
  // Default view: Center of Essen, Germany (zoomed out slightly)
  const defaultCenter: [number, number] = [51.4556, 7.0116];
  
  const polygonToRender = targetPolygon || (targetLocation ? getFallbackPolygon(targetLocation) : []);
  
  let tileUrl = '';
  let tileAttribution = '';
  let cssFilter = '';

  if (mapStyle === 'satellite') {
    tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    tileAttribution = 'Tiles &copy; Esri';
    cssFilter = 'brightness(0.4) contrast(1.2) saturate(0.2)';
  } else if (mapStyle === 'dark') {
    tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    tileAttribution = '&copy; OpenStreetMap contributors &copy; CARTO';
    cssFilter = 'none';
  } else if (mapStyle === 'street') {
    tileUrl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    tileAttribution = '&copy; OpenStreetMap contributors &copy; CARTO';
    cssFilter = 'brightness(0.9)';
  }

  return (
    <div className="absolute inset-0 z-0 bg-[#0a0a0a]">
      <style>{`
        .leaflet-tile-pane {
          filter: ${cssFilter}; 
          transition: filter 0.5s ease;
        }
        .leaflet-container {
          cursor: ${onMapClick ? 'crosshair' : 'grab'};
        }
      `}</style>
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          key={mapStyle}
          attribution={tileAttribution}
          url={tileUrl}
          maxZoom={19}
        />
        
        <LocationController targetLocation={targetLocation} />
        <ClickHandler onMapClick={onMapClick} />
        
        {/* Render the building polygon when scanning */}
        {showScanner && polygonToRender.length > 0 && (
          <Polygon 
            positions={polygonToRender}
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
