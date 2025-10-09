import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getScanHistory, addToScanHistory, clearScanHistory, removeFromHistory } from '@/lib/storage/history';
import type { ScannedProduct, Product } from '@/types/product';

export function useScanHistory() {
  const queryClient = useQueryClient();

  const { data: history = [], isLoading } = useQuery<ScannedProduct[]>({
    queryKey: ['scanHistory'],
    queryFn: getScanHistory,
  });

  const addMutation = useMutation({
    mutationFn: ({ barcode, product }: { barcode: string; product?: Product }) => addToScanHistory(barcode, product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scanHistory'] });
    },
  });

  const clearMutation = useMutation({
    mutationFn: clearScanHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scanHistory'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeFromHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scanHistory'] });
    },
  });

  return {
    history,
    isLoading,
    addToHistory: addMutation.mutate,
    clearHistory: clearMutation.mutate,
    removeFromHistory: removeMutation.mutate,
  };
}
