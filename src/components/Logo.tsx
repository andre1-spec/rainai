import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="absolute top-6 left-8 z-50 flex items-center space-x-2 select-none pointer-events-none">
      <h1 className="text-3xl font-black tracking-widest text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
        BAD<span className="font-sans font-bold">3</span>D
      </h1>
      <h1 className="text-3xl font-black tracking-widest uppercase bg-gradient-to-r from-[#d946ef] via-[#db2777] to-[#e11d48] text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(219,39,119,0.5)]">
        RAIN AI
      </h1>
      <div className="text-gray-400 ml-1">✦</div>
    </div>
  );
};
