import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import { CloudRain, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import type { FlowState } from '../App';

interface DataPanelProps {
  isVisible: boolean;
  flowState: FlowState;
  onOptimize: () => void;
}

export const DataPanel: React.FC<DataPanelProps> = ({ isVisible, flowState, onOptimize }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Main Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="absolute top-0 right-0 bottom-0 w-96 bg-[#0a0a0a]/95 backdrop-blur-2xl border-l border-gray-800 z-30 flex flex-col shadow-2xl"
          >
            <div className="p-8 flex-1 overflow-y-auto">
              <div className="mb-8">
                <h2 className="text-sm font-mono text-pink-500 uppercase tracking-widest mb-1">Target Acquired</h2>
                <h1 className="text-3xl font-bold text-white">Goldschmidtstr. 100</h1>
                <p className="text-gray-400 mt-1">Essen, Nordrhein-Westfalen</p>
              </div>

              <div className="space-y-6">
                {/* Surface Area Stat */}
                <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-gray-800 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  <div className="flex items-center space-x-3 mb-3 relative z-10">
                    <CloudRain className="text-blue-400 w-5 h-5" />
                    <h3 className="text-gray-400 text-sm uppercase tracking-wider font-semibold">Total Impermeable Area</h3>
                  </div>
                  <div className="flex items-baseline space-x-1 relative z-10">
                    <span className="text-4xl font-mono font-bold text-white">250,000</span>
                    <span className="text-gray-500 text-lg">m²</span>
                  </div>
                </div>

                {/* Rain Tax Stat */}
                <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-gray-800 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br from-pink-500/5 to-rose-500/5 transition-opacity duration-1000 ${flowState === 'done' ? 'opacity-0' : 'opacity-100'}`}></div>
                  <div className={`absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 transition-opacity duration-1000 ${flowState === 'done' ? 'opacity-100' : 'opacity-0'}`}></div>
                  
                  <div className="flex items-center space-x-3 mb-3 relative z-10">
                    <Zap className={flowState === 'done' ? 'text-green-400 w-5 h-5' : 'text-pink-500 w-5 h-5'} />
                    <h3 className="text-gray-400 text-sm uppercase tracking-wider font-semibold">Current Rain Tax</h3>
                  </div>
                  
                  <div className="flex items-baseline space-x-2 relative z-10">
                    <span className="text-gray-400 text-2xl font-mono">€</span>
                    <div className="text-5xl font-mono font-bold text-white">
                      {flowState === 'revealing' && "515,000"}
                      {(flowState === 'optimizing' || flowState === 'done') && (
                        <CountUp 
                          start={515000} 
                          end={0} 
                          duration={2.5} 
                          separator=","
                          useEasing={true}
                        />
                      )}
                    </div>
                    <span className="text-gray-500 text-sm">/year</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="p-8 bg-[#121212] border-t border-gray-800">
              <button
                onClick={onOptimize}
                disabled={flowState !== 'revealing'}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all duration-300 relative overflow-hidden group ${
                  flowState === 'revealing' 
                    ? 'bg-white text-black hover:scale-[1.02] active:scale-[0.98]' 
                    : flowState === 'optimizing'
                    ? 'bg-gray-800 text-gray-500 cursor-wait'
                    : 'bg-green-500/10 text-green-500 border border-green-500/30'
                }`}
              >
                {/* Button Glow on Hover */}
                {flowState === 'revealing' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                )}
                
                {flowState === 'revealing' && (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Optimize with RainAI</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
                
                {flowState === 'optimizing' && (
                  <div className="flex space-x-2 items-center">
                    <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Optimizing...</span>
                  </div>
                )}
                
                {flowState === 'done' && (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Fully Optimized</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Success Toast Notification */}
          <AnimatePresence>
            {flowState === 'done' && (
              <motion.div
                initial={{ opacity: 0, y: 50, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: 50, x: '-50%' }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40"
              >
                <div className="bg-[#121212]/95 backdrop-blur-xl border border-green-500/30 px-6 py-4 rounded-xl shadow-[0_0_40px_rgba(34,197,94,0.2)] flex items-center space-x-4">
                  <div className="bg-green-500/20 p-2 rounded-full">
                    <CheckCircle2 className="text-green-500 w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-green-400 font-bold text-lg">RainAI predictive routing enabled</h4>
                    <p className="text-gray-300">B2B Gain-Share activated successfully.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};
