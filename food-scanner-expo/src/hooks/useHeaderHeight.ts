import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isLiquidGlassAvailable } from 'expo-glass-effect';

/**
 * Custom hook to calculate header height for content inset
 * Only adds safe area inset when header is transparent (Liquid Glass)
 * When header is not transparent, React Navigation handles safe area automatically
 */
export function useHeaderHeight(): number {
  const insets = useSafeAreaInsets();
  
  // Header height - only add safe area inset when header is transparent (Liquid Glass)
  // When header is not transparent, React Navigation handles safe area automatically
  return Platform.OS === 'ios' && isLiquidGlassAvailable() ? 44 + insets.top : 0;
}


