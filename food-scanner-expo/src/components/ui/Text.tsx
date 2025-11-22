import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';

export interface TextProps extends RNTextProps {
  className?: string;
}

// Map font weights to Montserrat font families
function getFontFamily(style: any): string {
  const fontWeight = style?.fontWeight || '400';
  
  // Convert string weights to numbers
  const weight = typeof fontWeight === 'string' 
    ? fontWeight === 'normal' ? 400 
    : fontWeight === 'bold' ? 700 
    : parseInt(fontWeight) || 400
    : fontWeight;

  // Map to appropriate Montserrat font
  if (weight >= 700) return 'Montserrat_700Bold';
  if (weight >= 600) return 'Montserrat_600SemiBold';
  if (weight >= 500) return 'Montserrat_500Medium';
  return 'Montserrat_400Regular';
}

export function Text({ className = '', style, ...props }: TextProps) {
  const flattenedStyle = StyleSheet.flatten(style);
  const fontFamily = getFontFamily(flattenedStyle);
  
  // Apply Montserrat font based on weight, remove fontWeight since we're using specific font files
  const { fontWeight, ...restStyle } = flattenedStyle || {};
  const mergedStyle = StyleSheet.flatten([
    { fontFamily },
    restStyle,
  ]);

  return (
    <RNText
      className={className}
      style={mergedStyle}
      {...props}
    />
  );
}

