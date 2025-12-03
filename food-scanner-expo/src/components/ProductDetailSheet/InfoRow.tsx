import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';

interface InfoRowProps {
  icon: ReactNode;
  label: string;
  value?: string;
}

export function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-row items-center gap-2">
          {icon}
          <Text className="font-medium text-caption text-black">{label}</Text>
        </View>
        {value && <Text className="text-caption font-semibold text-gray-90">{value}</Text>}
    </View>
  );
}

