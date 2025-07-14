import React from 'react';

export function ComicBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Dot grid background */}
      <div 
        className="absolute inset-0 bg-[length:20px_20px] opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
      
      {/* Decorative comic elements */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-blue-100 opacity-20 mix-blend-multiply blur-xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-yellow-100 opacity-20 mix-blend-multiply blur-xl" />
      
      {/* Speech bubbles */}
      <div className="absolute top-1/4 right-1/4 transform rotate-6">
        <div className="relative bg-white p-3 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] opacity-5">
          <div className="absolute -bottom-3 left-4 w-4 h-4 bg-white border-b-2 border-l-2 border-black transform rotate(-45deg)" />
        </div>
      </div>
      
      <div className="absolute bottom-1/4 left-1/4 transform -rotate-6">
        <div className="relative bg-white p-3 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] opacity-5">
          <div className="absolute -top-3 right-4 w-4 h-4 bg-white border-t-2 border-r-2 border-black transform rotate(45deg)" />
        </div>
      </div>
      
      {/* Action lines */}
      <div className="absolute top-1/2 left-0 w-full h-1 bg-black opacity-5" style={{ transform: 'rotate(2deg)' }} />
      <div className="absolute top-1/3 right-0 w-1/2 h-1 bg-black opacity-5" style={{ transform: 'rotate(-1deg)' }} />
    </div>
  );
}
