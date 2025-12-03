import { useState, useEffect, useCallback } from 'react';
import { getHistory, addToHistory, clearHistory, removeFromHistory } from '@/lib/storage/storage';

export function useHistory() {
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    const items = await getHistory();
    setHistory(items);
    setIsLoading(false);
  }, []);

  const addItem = useCallback(
    async (barcode: string) => {
      await addToHistory(barcode);
      await loadHistory();
    },
    [loadHistory]
  );

  const removeItem = useCallback(
    async (barcode: string) => {
      await removeFromHistory(barcode);
      await loadHistory();
    },
    [loadHistory]
  );

  const clear = useCallback(async () => {
    await clearHistory();
    await loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    history,
    isLoading,
    addItem,
    removeItem,
    clear,
    refresh: loadHistory,
  };
}
