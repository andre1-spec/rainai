import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type: string;
}

interface SearchBarProps {
  onSelectAddress: (lat: number, lon: number, addressName: string) => void;
  isHidden: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSelectAddress, isHidden }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      setShowSuggestions(false);
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
        const data = await response.json();
        setResults(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    setQuery(result.display_name);
    setShowSuggestions(false);
    
    setTimeout(() => {
      onSelectAddress(parseFloat(result.lat), parseFloat(result.lon), result.display_name);
    }, 400);
  };

  return (
    <motion.div 
      className="absolute top-12 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: isHidden ? 0 : 1, y: isHidden ? -20 : 0, pointerEvents: isHidden ? 'none' : 'auto' }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 rounded-2xl blur opacity-70 animate-pulse transition duration-1000 group-hover:opacity-100"></div>
        
        <div className="relative bg-[#121212]/90 backdrop-blur-md border border-gray-800 rounded-2xl shadow-2xl flex items-center p-3">
          {isLoading ? (
            <Loader2 className="text-pink-500 ml-2 w-6 h-6 animate-spin" />
          ) : (
            <Search className="text-gray-400 ml-2 w-6 h-6" />
          )}
          <input
            type="text"
            className="w-full bg-transparent border-none outline-none text-white px-4 py-2 text-lg placeholder-gray-400 font-sans font-medium"
            placeholder="Start typing your address..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setShowSuggestions(true);
            }}
          />
        </div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full mt-2 left-0 right-0 bg-[#121212]/95 backdrop-blur-xl border border-gray-800 rounded-xl overflow-hidden shadow-2xl max-h-80 overflow-y-auto"
            >
              {results.map((result) => {
                const parts = result.display_name.split(',');
                const mainText = parts[0];
                const subText = parts.slice(1).join(',').trim();
                
                return (
                  <button
                    key={result.place_id}
                    className="w-full text-left px-6 py-4 hover:bg-white/5 flex items-center space-x-3 transition-colors cursor-pointer border-b border-gray-800/50 last:border-0"
                    onClick={() => handleSelect(result)}
                  >
                    <div className="bg-pink-500/20 p-2 rounded-lg flex-shrink-0">
                      <MapPin className="text-pink-500 w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{mainText}</p>
                      {subText && (
                        <p className="text-gray-400 text-sm truncate">{subText}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
