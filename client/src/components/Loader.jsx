import React from 'react';

const Loader = ({ message = 'Loading Barça Data...', size = 'default' }) => {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    default: 'w-12 h-12 border-3',
    large: 'w-16 h-16 border-4',
  }[size] || 'w-12 h-12 border-3';

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        {/* Outer Ring - FCB Garnet/Crimson */}
        <div
          className={`${sizeClasses} rounded-full border-t-[#EDBB00] border-r-[#A50044] border-b-[#004D98] border-l-transparent animate-spin`}
        />
        {/* Inner Pulsing Core */}
        <div className="absolute inset-0 m-auto w-3 h-3 bg-[#EDBB00] rounded-full animate-ping opacity-75" />
      </div>
      {message && (
        <p className="text-sm font-medium tracking-wide text-slate-400 font-sans animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default Loader;