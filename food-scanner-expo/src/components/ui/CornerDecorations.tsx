import React from 'react';
import { View } from 'react-native';

interface CornerDecorationsProps {
  strokeWidth?: number;
  cornerSize?: number;
}

export function CornerDecorations({ strokeWidth, cornerSize }: CornerDecorationsProps) {

  const cornerRadius = 32;

  return (
    <View className="absolute inset-x-6 inset-y-0">
      {/* Top Left */}
      <View className="absolute top-0 left- 6">
        <View
          className="border-white"
          style={{
            width: cornerSize,
            height: cornerSize,
            borderLeftWidth: strokeWidth,
            borderTopWidth: strokeWidth,
            borderTopLeftRadius: cornerRadius,
          }}
        />
      </View>

      {/* Top Right */}
      <View className="absolute top-0 right-0">
        <View
          className="border-white"
          style={{
            width: cornerSize,
            height: cornerSize,
            borderRightWidth: strokeWidth,
            borderTopWidth: strokeWidth,
            borderTopRightRadius: cornerRadius,
          }}
        />
      </View>

      {/* Bottom Left */}
      <View className="absolute bottom-0 left-0">
        <View
          className="border-white"
          style={{
            width: cornerSize,
            height: cornerSize,
            borderLeftWidth: strokeWidth,
            borderBottomWidth: strokeWidth,
            borderBottomLeftRadius: cornerRadius,
          }}
        />
      </View>

      {/* Bottom Right */}
      <View className="absolute bottom-0 right-0">
        <View
          className="border-white"
          style={{
            width: cornerSize,
            height: cornerSize,
            borderRightWidth: strokeWidth,
            borderBottomWidth: strokeWidth,
            borderBottomRightRadius: cornerRadius,
          }}
        />
      </View>
    </View>
  );
}
