import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

export interface TextProps extends RNTextProps {
  className?: string;
}

export function Text({ className = '', style, ...props }: TextProps) {
  return (
    <RNText
      className={`font-sans ${className}`}
      style={style}
      {...props}
    />
  );
}

