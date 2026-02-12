import { useCallback } from 'react';
import {
  addToFavorites,
  removeFromFavorites,
  clearFavorites,
  toggleFavorite,
} from '@/lib/storage/storage';
import { useFavoritesContext } from '@/providers/favorites-provider';

export function useFavorites() {
  const { favorites, isLoading, updateFavorites } = useFavoritesContext();

  const addItem = useCallback(
    async (barcode: string) => {
      await addToFavorites(barcode);
      await updateFavorites();
    },
    [updateFavorites]
  );

  const removeItem = useCallback(
    async (barcode: string) => {
      await removeFromFavorites(barcode);
      await updateFavorites();
    },
    [updateFavorites]
  );

  const clear = useCallback(async () => {
    await clearFavorites();
    await updateFavorites();
  }, [updateFavorites]);

  const toggle = useCallback(
    async (barcode: string) => {
      const newState = await toggleFavorite(barcode);
      await updateFavorites();
      return newState;
    },
    [updateFavorites]
  );

  const isFavorite = useCallback(
    (barcode: string) => {
      return favorites.includes(barcode);
    },
    [favorites]
  );

  return {
    favorites,
    isLoading,
    addItem,
    removeItem,
    clear,
    toggle,
    isFavorite,
    refresh: updateFavorites,
  };
}
