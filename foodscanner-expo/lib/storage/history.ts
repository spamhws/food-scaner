import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ScannedProduct, Product } from '@/types/product';

const STORAGE_KEY = '@foodscanner:history';

export async function getScanHistory(): Promise<ScannedProduct[]> {
  try {
    const history = await AsyncStorage.getItem(STORAGE_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error loading scan history:', error);
    return [];
  }
}

export async function addToScanHistory(barcode: string, product?: Product): Promise<void> {
  try {
    const history = await getScanHistory();

    // Check if barcode already exists
    const existingIndex = history.findIndex((item) => item.barcode === barcode);

    if (existingIndex >= 0) {
      // If product data is provided, update it; otherwise keep existing
      if (product) {
        history[existingIndex].product = product;
      }
      // Update timestamp and move to front
      const [existingItem] = history.splice(existingIndex, 1);
      existingItem.scannedAt = new Date().toISOString();
      history.unshift(existingItem);
    } else {
      // Add new item to the beginning of the array
      const newItem: ScannedProduct = {
        barcode,
        scannedAt: new Date().toISOString(),
        product,
      };
      history.unshift(newItem);
    }

    // Keep only the last 100 scans
    const trimmedHistory = history.slice(0, 100);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Error saving to scan history:', error);
  }
}

export async function clearScanHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing scan history:', error);
  }
}

export async function removeFromHistory(barcode: string): Promise<void> {
  try {
    const history = await getScanHistory();
    const filteredHistory = history.filter((item) => item.barcode !== barcode);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredHistory));
  } catch (error) {
    console.error('Error removing from history:', error);
  }
}
