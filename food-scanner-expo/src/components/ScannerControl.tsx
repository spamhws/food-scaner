import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { IconBolt, IconKeyboard
} from '@tabler/icons-react-native';

interface ScannerControlProps {
  onKeyboardClick: () => void;
  onFlashClick: () => void;
  isFlashOn: boolean;
  controlHeight?: number;
}

export function ScannerControl({
  onKeyboardClick,
  onFlashClick,
  isFlashOn,
  controlHeight = 64,
   
}: ScannerControlProps) {
  return (
    <View
      className="flex-row w-full items-center justify-center gap-1 self-end overflow-hidden rounded-b-3xl"
      style={{ height: controlHeight }}
    >
      <TouchableOpacity
        onPress={onKeyboardClick}
        className="flex-1 h-full items-center justify-center bg-white/10"
        activeOpacity={0.7}
      >
        <Text className="text-white text-2xl font-bold">
          <IconKeyboard size={24} strokeWidth={1.5} color="white" />
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onFlashClick}
        className="flex-1 h-full items-center justify-center bg-white/10"
        activeOpacity={0.7}
      >
        <IconBolt
          size={24}
          color={isFlashOn ? '#FFFF00' : '#FFFFFF'}
          fill={isFlashOn ? '#FFFF00' : 'none'}
          strokeWidth={1.5}
        />
      </TouchableOpacity>
    </View>
  );
}
