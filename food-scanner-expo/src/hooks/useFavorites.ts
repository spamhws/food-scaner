import { useState, useEffect, useCallback } from 'react';
import {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  clearFavorites,
  toggleFavorite,
  isFavorite as checkIsFavorite,
} from '@/lib/storage/storage';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    setIsLoading(true);
    const items = await getFavorites();
    setFavorites(items);
    setIsLoading(false);
  }, []);

  const addItem = useCallback(
    async (barcode: string) => {
      await addToFavorites(barcode);
      await loadFavorites();
    },
    [loadFavorites]
  );

  const removeItem = useCallback(
    async (barcode: string) => {
      await removeFromFavorites(barcode);
      await loadFavorites();
    },
    [loadFavorites]
  );

  const clear = useCallback(async () => {
    await clearFavorites();
    await loadFavorites();
  }, [loadFavorites]);

  const toggle = useCallback(
    async (barcode: string) => {
      const newState = await toggleFavorite(barcode);
      await loadFavorites();
      return newState;
    },
    [loadFavorites]
  );

  const isFavorite = useCallback(
    (barcode: string) => {
      return favorites.includes(barcode);
    },
    [favorites]
  );

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    favorites,
    isLoading,
    addItem,
    removeItem,
    clear,
    toggle,
    isFavorite,
    refresh: loadFavorites,
  };
}
