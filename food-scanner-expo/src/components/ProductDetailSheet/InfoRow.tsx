import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';

interface InfoRowProps {
  icon: ReactNode;
  label: string;
  value?: string;
  isLast?: boolean;
}

export function InfoRow({ icon, label, value, isLast = false }: InfoRowProps) {
  return (
    <View>
      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-row items-center gap-2">
          {icon}
          <Text className="font-medium text-title text-black">{label}</Text>
        </View>
        {value && <Text className="text-title font-semibold text-gray-90">{value}</Text>}
      </View>
      {!isLast && <View className="h-px bg-gray-30 mt-2 ml-8" />}
    </View>
  );
}

