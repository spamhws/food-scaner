import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getFavorites } from '@/lib/storage/storage';

type FavoritesContextValue = {
  favorites: string[];
  isLoading: boolean;
  /** Re-fetches favorites from storage and updates state so the list re-renders. Call after any fav change (toggle, add, remove). */
  updateFavorites: () => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const updateFavorites = useCallback(async () => {
    const items = await getFavorites();
    setFavorites(items);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    getFavorites().then((items) => {
      if (mounted) {
        setFavorites(items);
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const value: FavoritesContextValue = {
    favorites,
    isLoading,
    updateFavorites,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavoritesContext(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavoritesContext must be used within FavoritesProvider');
  }
  return ctx;
}
