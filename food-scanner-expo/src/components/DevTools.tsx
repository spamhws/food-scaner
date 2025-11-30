/**
 * DEV TOOLS COMPONENT
 * 
 * ⚠️ REMOVE THIS COMPONENT BEFORE PRODUCTION ⚠️
 * 
 * This component provides development utilities:
 * - Clear all storage (history, favorites, products cache)
 * - Display current scanned barcode
 * 
 * To remove: Delete this file and remove the import/usage from ScannerScreen.tsx
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  clearHistory,
  clearProductsCache,
} from '@/lib/storage/storage';

interface DevToolsProps {
  currentBarcode: string | null;
}

export function DevTools({ currentBarcode }: DevToolsProps) {
  const [isClearing, setIsClearing] = useState(false);

  const handleClearStorage = async () => {
    Alert.alert(
      'Clear All Storage?',
      'This will delete all scanned products, history, and favorites. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            setIsClearing(true);
            try {
              // Clear history
              await clearHistory();

              // Clear products cache
              await clearProductsCache();

              // Clear favorites
              await AsyncStorage.removeItem('@food_scanner_favorites');

              Alert.alert('Success', 'All storage has been cleared.');
            } catch (error) {
              console.error('Error clearing storage:', error);
              Alert.alert('Error', 'Failed to clear storage. Check console for details.');
            } finally {
              setIsClearing(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Clear Storage Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleClearStorage}
        disabled={isClearing}
      >
        <Text style={styles.buttonText}>
          {isClearing ? 'Clearing...' : 'Dev: Clear Storage'}
        </Text>
      </TouchableOpacity>

      {/* Current Barcode Display */}
      {currentBarcode && (
        <Text style={styles.barcodeText}>{currentBarcode}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 1000,
    alignItems: 'flex-start',
  },
  button: {
    backgroundColor: '#DE1B1B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  barcodeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
});

