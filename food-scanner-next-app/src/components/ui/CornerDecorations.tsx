import React from 'react';

export function CornerDecorations() {
  return (
    <div className='pointer-events-none absolute inset-0 z-20'>
      {/* Top Left */}
      <div className='absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-white rounded-tl-3xl' />
      {/* Top Right */}
      <div className='absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-white rounded-tr-3xl' />
      {/* Bottom Left */}
      <div className='absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-white rounded-bl-3xl' />
      {/* Bottom Right */}
      <div className='absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-white rounded-br-3xl' />
    </div>
  );
}
