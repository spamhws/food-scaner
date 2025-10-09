import React from 'react';
import { View } from 'react-native';

export function CornerDecorations() {
  return (
    <>
      {/* Top Left */}
      <View className='absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-2xl' />

      {/* Top Right */}
      <View className='absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-2xl' />

      {/* Bottom Left */}
      <View className='absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-2xl' />

      {/* Bottom Right */}
      <View className='absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-2xl' />
    </>
  );
}
