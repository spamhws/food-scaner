import React from 'react';
import { TouchableOpacity, Text, type TouchableOpacityProps } from 'react-native';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
}

export function Button({ children, variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <TouchableOpacity
      className={cn(
        'rounded-full px-6 py-3 items-center justify-center',
        variant === 'primary' && 'bg-blue-50',
        variant === 'secondary' && 'bg-gray-20 border border-gray-30',
        variant === 'ghost' && 'bg-transparent',
        className
      )}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text
          className={cn(
            'font-semibold',
            variant === 'primary' && 'text-white',
            variant === 'secondary' && 'text-gray-90',
            variant === 'ghost' && 'text-blue-50'
          )}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}
