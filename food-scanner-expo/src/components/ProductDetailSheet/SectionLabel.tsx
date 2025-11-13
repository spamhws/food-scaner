import React from 'react';
import { Text } from 'react-native';

interface SectionLabelProps {
  children: string;
}

export function SectionLabel({ children }: SectionLabelProps) {
  return (
    <Text className="text-CAPS font-semibold text-gray-60 uppercase tracking-wide mb-2 mt-2">
      {children}
    </Text>
  );
}

