import { useState } from 'react';
import { Logo } from './components/Logo';
import { SearchBar } from './components/SearchBar';
import { MapBackground } from './components/MapBackground';
import { ScannerOverlay } from './components/ScannerOverlay';
import { DataPanel } from './components/DataPanel';
import { ArrowLeft } from 'lucide-react';

export type FlowState = 'idle' | 'zooming' | 'scanning' | 'revealing' | 'optimizing' | 'done';

interface BuildingData {
  area: number;
  tax: number;
}

function App() {
  const [flowState, setFlowState] = useState<FlowState>('idle');
  const [targetLocation, setTargetLocation] = useState<[number, number] | null>(null);
  const [targetAddress, setTargetAddress] = useState<string>('');
  const [buildingData, setBuildingData] = useState<BuildingData>({ area: 250000, tax: 515000 });

  const startFlow = (lat: number, lon: number, addressName: string) => {
    setFlowState('zooming');
    setTargetLocation([lat, lon]);
    setTargetAddress(addressName);

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
    setTargetAddress('');
  };

  return (
    <div className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden text-white font-sans">
      <MapBackground 
        targetLocation={targetLocation} 
        showScanner={flowState === 'scanning' || flowState === 'revealing' || flowState === 'optimizing' || flowState === 'done'} 
        flowState={flowState}
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

      {flowState !== 'idle' && (
        <button 
          onClick={resetFlow}
          className="absolute top-8 left-8 z-50 bg-[#121212]/90 backdrop-blur-md border border-gray-800 p-3 rounded-full hover:bg-white/10 transition-colors shadow-xl group"
          title="Start new search"
        >
          <ArrowLeft className="text-white w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
}

export default App;
