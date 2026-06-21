import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Partner } from '../utils/partnerGenerator';
import { Building2, Store, Fuel, School, Home, ChevronUp, ChevronDown, Zap, Shield, Leaf } from 'lucide-react';
import clsx from 'clsx';

interface ConnectedPartnersPanelProps {
  partners: Partner[];
  selectedPartnerId: string | null;
  onSelectPartner: (id: string) => void;
  isVisible: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const TypeIcon = ({ type }: { type: Partner['type'] }) => {
  switch (type) {
    case 'company': return <Building2 className="w-5 h-5" />;
    case 'shop': return <Store className="w-5 h-5" />;
    case 'gas_station': return <Fuel className="w-5 h-5" />;
    case 'school': return <School className="w-5 h-5" />;
    case 'house': return <Home className="w-5 h-5" />;
  }
};

const TypeColor = (type: Partner['type']) => {
  switch (type) {
    case 'company': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    case 'shop': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
    case 'gas_station': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
    case 'school': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    case 'house': return 'text-green-400 bg-green-500/20 border-green-500/30';
  }
};

export const ConnectedPartnersPanel: React.FC<ConnectedPartnersPanelProps> = ({ 
  partners, 
  selectedPartnerId, 
  onSelectPartner,
  isVisible,
  isExpanded,
  onToggleExpand
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to selected partner when expanded
  useEffect(() => {
    if (selectedPartnerId && isExpanded && scrollRef.current) {
      const el = document.getElementById(`partner-card-${selectedPartnerId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedPartnerId, isExpanded]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: isExpanded ? 0 : 'calc(100% - 60px)' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-40 flex flex-col bg-[#121212]/95 backdrop-blur-2xl border-t border-gray-800 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
        style={{ height: '40vh', maxHeight: '400px' }}
      >
        {/* Drag handle / Header */}
        <div 
          className="flex flex-col items-center justify-center p-2 cursor-pointer border-b border-gray-800/50 hover:bg-white/5 transition-colors rounded-t-3xl"
          onClick={onToggleExpand}
        >
          <div className="w-12 h-1.5 bg-gray-700 rounded-full mb-2"></div>
          <div className="flex items-center space-x-2 text-gray-300">
            {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            <span className="font-semibold">{partners.length} Connected Partners Nearby</span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div 
          className="flex-1 overflow-x-auto overflow-y-hidden p-6 flex space-x-6 hide-scrollbar"
          ref={scrollRef}
        >
          {partners.map(partner => {
            const isSelected = partner.id === selectedPartnerId;
            return (
              <div 
                key={partner.id}
                id={`partner-card-${partner.id}`}
                onClick={() => onSelectPartner(partner.id)}
                className={clsx(
                  "flex-shrink-0 w-80 rounded-2xl border p-5 cursor-pointer transition-all duration-300 flex flex-col relative overflow-hidden group",
                  isSelected 
                    ? "border-pink-500/50 bg-gradient-to-br from-pink-500/10 to-purple-500/10 shadow-[0_0_30px_rgba(219,39,119,0.2)] transform -translate-y-2" 
                    : "border-gray-800 bg-[#1a1a1a]/50 hover:border-gray-600 hover:bg-[#1a1a1a]"
                )}
              >
                {/* Background glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className={clsx(
                      "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border shadow-inner",
                      TypeColor(partner.type)
                    )}>
                      {partner.logoText}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg leading-tight">{partner.name}</h3>
                      <div className="flex items-center space-x-1 mt-1 opacity-80">
                        <TypeIcon type={partner.type} />
                        <span className="text-xs text-gray-400 capitalize">{partner.type.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto space-y-3 relative z-10">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span>Energy Saved</span>
                    </div>
                    <span className="font-semibold text-white">{partner.benefits.energySaved}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span>Tax Reduced</span>
                    </div>
                    <span className="font-semibold text-green-400">{partner.benefits.taxReduction}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Leaf className="w-4 h-4 text-emerald-500" />
                      <span>CO2 Offset</span>
                    </div>
                    <span className="font-semibold text-white">{partner.benefits.co2Offset}</span>
                  </div>
                </div>
              </div>
            );
          })}
          
          {partners.length === 0 && (
            <div className="w-full flex items-center justify-center text-gray-500">
              No partners found in this area.
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
