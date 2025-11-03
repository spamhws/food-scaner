import React from 'react';
import { View } from 'react-native';

export function CornerDecorations() {
  const cornerSize = 24;
  const strokeWidth = 3;

  return (
    <>
      {/* Top Left */}
      <View className="absolute top-0 left-0">
        <View
          className="border-l-[3px] border-t-[3px] border-white rounded-tl-2xl"
          style={{ width: cornerSize, height: cornerSize }}
        />
      </View>

      {/* Top Right */}
      <View className="absolute top-0 right-0">
        <View
          className="border-r-[3px] border-t-[3px] border-white rounded-tr-2xl"
          style={{ width: cornerSize, height: cornerSize }}
        />
      </View>

      {/* Bottom Left */}
      <View className="absolute bottom-0 left-0">
        <View
          className="border-l-[3px] border-b-[3px] border-white rounded-bl-2xl"
          style={{ width: cornerSize, height: cornerSize }}
        />
      </View>

      {/* Bottom Right */}
      <View className="absolute bottom-0 right-0">
        <View
          className="border-r-[3px] border-b-[3px] border-white rounded-br-2xl"
          style={{ width: cornerSize, height: cornerSize }}
        />
      </View>
    </>
  );
}

