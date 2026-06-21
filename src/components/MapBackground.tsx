import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Polygon, useMapEvents, Marker } from 'react-leaflet';
import L from 'leaflet';
import { generatePartnersInBounds } from '../utils/partnerGenerator';
import type { Partner } from '../utils/partnerGenerator';

export type MapStyleType = 'satellite' | 'dark' | 'street';

interface MapBackgroundProps {
  targetLocation: [number, number] | null;
  targetPolygon?: [number, number][] | null;
  showScanner: boolean;
  flowState?: string;
  mapStyle: MapStyleType;
  onMapClick?: (lat: number, lng: number) => void;
  partners: Partner[];
  onPartnersChange: (partners: Partner[]) => void;
  selectedPartnerId: string | null;
  onSelectPartner: (id: string) => void;
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

function MapEventsHandler({ 
  onMapClick, 
  onBoundsChange 
}: { 
  onMapClick?: (lat: number, lng: number) => void,
  onBoundsChange: (bounds: L.LatLngBounds) => void
}) {
  const map = useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
    moveend() {
      onBoundsChange(map.getBounds());
    },
    zoomend() {
      onBoundsChange(map.getBounds());
    }
  });

  // Initial load
  useEffect(() => {
    onBoundsChange(map.getBounds());
  }, [map, onBoundsChange]);

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

export const MapBackground: React.FC<MapBackgroundProps> = ({ 
  targetLocation, 
  targetPolygon, 
  showScanner, 
  flowState, 
  mapStyle, 
  onMapClick,
  partners,
  onPartnersChange,
  selectedPartnerId,
  onSelectPartner
}) => {
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
        <MapEventsHandler 
          onMapClick={onMapClick} 
          onBoundsChange={(bounds) => {
            const sw = bounds.getSouthWest();
            const ne = bounds.getNorthEast();
            const newPartners = generatePartnersInBounds([sw.lat, sw.lng], [ne.lat, ne.lng]);
            onPartnersChange(newPartners);
          }} 
        />
        
        {/* Render partners */}
        {partners.map(partner => {
          const isSelected = partner.id === selectedPartnerId;
          const colorClass = partner.type === 'company' ? 'bg-blue-500 text-white' :
                            partner.type === 'shop' ? 'bg-purple-500 text-white' :
                            partner.type === 'gas_station' ? 'bg-orange-500 text-white' :
                            partner.type === 'school' ? 'bg-yellow-500 text-white' :
                            'bg-green-500 text-white'; // house
                            
          const iconHtml = `
            <div class="partner-marker ${isSelected ? 'selected' : ''}">
              <div class="partner-logo ${colorClass}">
                ${partner.logoText}
              </div>
            </div>
          `;
          
          const icon = L.divIcon({
            html: iconHtml,
            className: 'custom-partner-icon',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
          });

          return (
            <Marker 
              key={partner.id} 
              position={partner.coordinates} 
              icon={icon}
              eventHandlers={{
                click: () => onSelectPartner(partner.id)
              }}
            />
          );
        })}
        
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
