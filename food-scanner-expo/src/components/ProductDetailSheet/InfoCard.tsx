import React, { ReactNode } from 'react';
import { View } from 'react-native';

interface InfoCardProps {
  children: ReactNode;
  className?: string;
}

export function InfoCard({ children, className = '' }: InfoCardProps) {
  return (
    <View className={`bg-white rounded-2xl p-4 shadow-card mb-4 gap-2 ${className}`}>{children}</View>
  );
}

