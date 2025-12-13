import React from 'react';

export const AdPlaceholder: React.FC<{ position: 'top' | 'bottom' }> = ({ position }) => {
  return (
    <div className={`w-full h-24 bg-gray-100 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest my-6 ${position === 'top' ? 'mb-8' : 'mt-12'}`}>
      Advertisement Space ({position})
    </div>
  );
};