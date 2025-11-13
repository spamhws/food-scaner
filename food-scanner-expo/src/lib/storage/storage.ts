import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Product } from '@/types/product';

const KEYS = {
  HISTORY: '@food_scanner_history',
  FAVORITES: '@food_scanner_favorites',
  PRODUCTS: '@food_scanner_products',
} as const;

/**
 * History: Array of barcodes in chronological order (newest first)
 */
export async function getHistory(): Promise<string[]> {
  try {
    const value = await AsyncStorage.getItem(KEYS.HISTORY);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error('Error reading history:', error);
    return [];
  }
}

export async function addToHistory(barcode: string): Promise<void> {
  try {
    const history = await getHistory();
    // Remove duplicates and add to front
    const newHistory = [barcode, ...history.filter((b) => b !== barcode)];
    await AsyncStorage.setItem(KEYS.HISTORY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Error adding to history:', error);
  }
}

export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEYS.HISTORY);
  } catch (error) {
    console.error('Error clearing history:', error);
  }
}

/**
 * Favorites: Array of barcodes
 */
export async function getFavorites(): Promise<string[]> {
  try {
    const value = await AsyncStorage.getItem(KEYS.FAVORITES);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error('Error reading favorites:', error);
    return [];
  }
}

export async function addToFavorites(barcode: string): Promise<void> {
  try {
    const favorites = await getFavorites();
    if (!favorites.includes(barcode)) {
      favorites.push(barcode);
      await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
}

export async function removeFromFavorites(barcode: string): Promise<void> {
  try {
    const favorites = await getFavorites();
    const newFavorites = favorites.filter((b) => b !== barcode);
    await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(newFavorites));
  } catch (error) {
    console.error('Error removing from favorites:', error);
  }
}

export async function toggleFavorite(barcode: string): Promise<boolean> {
  try {
    const favorites = await getFavorites();
    const isFavorite = favorites.includes(barcode);

    if (isFavorite) {
      await removeFromFavorites(barcode);
      return false;
    } else {
      await addToFavorites(barcode);
      return true;
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return false;
  }
}

export async function isFavorite(barcode: string): Promise<boolean> {
  try {
    const favorites = await getFavorites();
    return favorites.includes(barcode);
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
}

/**
 * Product Cache: Store complete product objects for offline access
 */
export async function getProductsCache(): Promise<Record<string, Product>> {
  try {
    const value = await AsyncStorage.getItem(KEYS.PRODUCTS);
    return value ? JSON.parse(value) : {};
  } catch (error) {
    console.error('Error reading products cache:', error);
    return {};
  }
}

export async function getCachedProduct(barcode: string): Promise<Product | null> {
  try {
    const cache = await getProductsCache();
    return cache[barcode] || null;
  } catch (error) {
    console.error('Error reading cached product:', error);
    return null;
  }
}

export async function cacheProduct(product: Product): Promise<void> {
  try {
    const cache = await getProductsCache();
    cache[product.barcode] = product;
    await AsyncStorage.setItem(KEYS.PRODUCTS, JSON.stringify(cache));
  } catch (error) {
    console.error('Error caching product:', error);
  }
}

export async function clearProductsCache(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEYS.PRODUCTS);
  } catch (error) {
    console.error('Error clearing products cache:', error);
  }
}
