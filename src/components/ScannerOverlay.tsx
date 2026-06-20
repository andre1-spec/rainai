import React from 'react';
import { motion } from 'framer-motion';
import { Satellite } from 'lucide-react';

export const ScannerOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
      {/* Target Crosshair & Radar Center */}
      <div className="relative flex items-center justify-center">
        {/* Radar Base Circle */}
        <div className="absolute w-64 h-64 border-2 border-pink-500/30 rounded-full"></div>
        <div className="absolute w-48 h-48 border border-pink-500/20 rounded-full"></div>
        <div className="absolute w-32 h-32 border border-pink-500/20 rounded-full"></div>
        
        {/* Pulsing ring */}
        <div className="absolute w-16 h-16 bg-pink-500/20 border-2 border-pink-500 rounded-full animate-pulse-ring"></div>
        
        {/* Center dot */}
        <div className="w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_10px_2px_rgba(217,70,239,0.8)]"></div>
        
        {/* Sweeping Radar Line */}
        <div className="absolute w-64 h-64 rounded-full overflow-hidden animate-radar">
          <div className="w-[50%] h-[50%] absolute top-0 left-[50%] origin-bottom-left bg-gradient-to-r from-transparent via-pink-500/40 to-pink-500 border-r-2 border-pink-500 skew-x-12"></div>
        </div>
      </div>

      {/* Loading Notification Panel */}
      <motion.div 
        className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-[#121212]/90 backdrop-blur-xl border border-pink-500/30 px-6 py-4 rounded-xl shadow-[0_0_30px_rgba(219,39,119,0.3)] flex items-center space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <Satellite className="text-pink-500 animate-pulse w-6 h-6" />
        <div>
          <div className="text-pink-400 font-mono text-sm uppercase tracking-wider font-bold">Connecting</div>
          <div className="text-white text-lg">Querying Google Solar API for roof area...</div>
        </div>
        
        {/* Dots animation */}
        <div className="flex space-x-1 ml-4">
          <motion.div className="w-2 h-2 bg-pink-500 rounded-full" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} />
          <motion.div className="w-2 h-2 bg-pink-500 rounded-full" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} />
          <motion.div className="w-2 h-2 bg-pink-500 rounded-full" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} />
        </div>
      </motion.div>
    </div>
  );
};
