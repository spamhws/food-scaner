import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { IconBolt, IconBoltOff } from '@tabler/icons-react-native';

interface ScannerControlProps {
  onFlashClick: () => void;
  isFlashOn: boolean;
  controlHeight?: number;
}

export function ScannerControl({
  onFlashClick,
  isFlashOn,
  controlHeight = 64,
}: ScannerControlProps) {
  return (
    <View className="flex-row justify-center items-center gap-8" style={{ height: controlHeight }}>
      <TouchableOpacity
        onPress={onFlashClick}
        className="w-12 h-12 rounded-full bg-white/20 items-center justify-center"
        activeOpacity={0.7}
      >
        {isFlashOn ? (
          <IconBolt size={24} stroke="#FFFFFF" />
        ) : (
          <IconBoltOff size={32} stroke="#FFFFFF" />
        )}
      </TouchableOpacity>
    </View>
  );
}
