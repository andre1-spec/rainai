import { useState } from 'react';
import { Logo } from './components/Logo';
import { SearchBar } from './components/SearchBar';
import { MapBackground } from './components/MapBackground';
import { ScannerOverlay } from './components/ScannerOverlay';
import { DataPanel } from './components/DataPanel';

export type FlowState = 'idle' | 'zooming' | 'scanning' | 'revealing' | 'optimizing' | 'done';

function App() {
  const [flowState, setFlowState] = useState<FlowState>('idle');
  const [targetLocation, setTargetLocation] = useState<[number, number] | null>(null);

  // Goldschmidtstraße 100, Essen
  const ESSEN_COORDS: [number, number] = [51.4604, 7.0267];

  const startFlow = (lat: number, lon: number, addressName: string) => {
    setFlowState('zooming');
    setTargetLocation([lat, lon]);

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

  return (
    <div className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden text-white font-sans">
      <MapBackground 
        targetLocation={targetLocation} 
        showScanner={flowState === 'scanning' || flowState === 'revealing' || flowState === 'optimizing' || flowState === 'done'} 
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
        onOptimize={handleOptimize}
      />
    </div>
  );
}

export default App;
