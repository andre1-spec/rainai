import { useState } from 'react';
import { Logo } from './components/Logo';
import { SearchBar } from './components/SearchBar';
import { MapBackground } from './components/MapBackground';
import type { MapStyleType } from './components/MapBackground';
import { ScannerOverlay } from './components/ScannerOverlay';
import { DataPanel } from './components/DataPanel';
import { ArrowLeft, Map, Moon, Layers } from 'lucide-react';

export type FlowState = 'idle' | 'zooming' | 'scanning' | 'revealing' | 'optimizing' | 'done';

interface BuildingData {
  area: number;
  tax: number;
}

function App() {
  const [flowState, setFlowState] = useState<FlowState>('idle');
  const [targetLocation, setTargetLocation] = useState<[number, number] | null>(null);
  const [targetPolygon, setTargetPolygon] = useState<[number, number][] | null>(null);
  const [targetAddress, setTargetAddress] = useState<string>('');
  const [buildingData, setBuildingData] = useState<BuildingData>({ area: 250000, tax: 515000 });
  const [mapStyle, setMapStyle] = useState<MapStyleType>('satellite');

  const fetchBuildingData = (lat: number, lon: number, addressName?: string) => {
    setFlowState('zooming');
    setTargetLocation([lat, lon]);
    setTargetPolygon(null);
    if (addressName) {
      setTargetAddress(addressName);
    } else {
      setTargetAddress(prev => prev ? prev : 'Custom Selection');
    }

    // Fetch real building footprint from OSM Overpass API
    const query = `[out:json];way(around:50, ${lat}, ${lon})[building];out geom;`;
    fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        if (data.elements && data.elements.length > 0) {
          const building = data.elements[0];
          if (building.geometry) {
            const polygon = building.geometry.map((pt: any) => [pt.lat, pt.lon] as [number, number]);
            setTargetPolygon(polygon);
          }
        }
      })
      .catch(err => console.error("Failed to fetch building polygon", err));

    // Generate pseudo-random realistic values for this specific address
    const randomArea = Math.floor(Math.random() * 450000) + 20000;
    const taxRate = 2.06; // Estimated rain tax rate €/m²
    const randomTax = Math.floor(randomArea * taxRate);
    setBuildingData({ area: randomArea, tax: randomTax });

    // Wait for zoom to finish (2.5s) then start scanning
    setTimeout(() => {
      setFlowState('scanning');
      
      // Fake API request delay (3s)
      setTimeout(() => {
        setFlowState('revealing');
      }, 3000);
      
    }, 2500);
  };

  const startFlow = (lat: number, lon: number, addressName: string) => {
    fetchBuildingData(lat, lon, addressName);
  };

  const handleMapClick = (lat: number, lon: number) => {
    // Re-run the flow for the clicked location
    fetchBuildingData(lat, lon);
  };

  const handleOptimize = () => {
    setFlowState('optimizing');
    
    // Fake optimization delay
    setTimeout(() => {
      setFlowState('done');
    }, 2500);
  };

  const resetFlow = () => {
    setFlowState('idle');
    setTargetLocation(null);
    setTargetPolygon(null);
    setTargetAddress('');
  };

  return (
    <div className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden text-white font-sans">
      <MapBackground 
        targetLocation={targetLocation} 
        targetPolygon={targetPolygon}
        showScanner={flowState === 'scanning' || flowState === 'revealing' || flowState === 'optimizing' || flowState === 'done'} 
        flowState={flowState}
        mapStyle={mapStyle}
        onMapClick={flowState !== 'idle' ? handleMapClick : undefined}
      />
      
      <Logo />
      
      <SearchBar 
        onSelectAddress={startFlow} 
        isHidden={flowState !== 'idle'} 
      />
      
      {flowState === 'scanning' && (
        <ScannerOverlay />
      )}
      
      <DataPanel 
        isVisible={flowState === 'revealing' || flowState === 'optimizing' || flowState === 'done'} 
        flowState={flowState}
        targetAddress={targetAddress}
        buildingData={buildingData}
        onOptimize={handleOptimize}
      />

      {/* Back Button */}
      {flowState !== 'idle' && (
        <button 
          onClick={resetFlow}
          className="absolute top-8 left-8 z-50 bg-[#121212]/90 backdrop-blur-md border border-gray-800 p-3 rounded-full hover:bg-white/10 transition-colors shadow-xl group"
          title="Start new search"
        >
          <ArrowLeft className="text-white w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </button>
      )}

      {/* Map Style Toggle */}
      <div className="absolute bottom-8 left-8 z-50 flex bg-[#121212]/90 backdrop-blur-md border border-gray-800 rounded-full shadow-xl overflow-hidden p-1">
        <button
          onClick={() => setMapStyle('satellite')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${mapStyle === 'satellite' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          <Map className="w-4 h-4" />
          <span className="text-sm font-medium">Satellite</span>
        </button>
        <button
          onClick={() => setMapStyle('dark')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${mapStyle === 'dark' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          <Moon className="w-4 h-4" />
          <span className="text-sm font-medium">Dark</span>
        </button>
        <button
          onClick={() => setMapStyle('street')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${mapStyle === 'street' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          <Layers className="w-4 h-4" />
          <span className="text-sm font-medium">Street</span>
        </button>
      </div>
    </div>
  );
}

export default App;
