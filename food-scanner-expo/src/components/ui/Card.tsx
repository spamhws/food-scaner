import React from 'react';
import { View, type ViewProps } from 'react-native';
import { cn } from '@/lib/utils/cn';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <View className={cn('rounded-2xl bg-white shadow-card p-4', className)} {...props}>
      {children}
    </View>
  );
}
