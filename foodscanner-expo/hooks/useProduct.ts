import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProduct } from '@/lib/api/product';
import { getScanHistory } from '@/lib/storage/history';
import type { Product } from '@/types/product';

export function useProduct(barcode: string | null) {
  const queryClient = useQueryClient();

  return useQuery<Product | null, Error>({
    queryKey: ['product', barcode],
    queryFn: async () => {
      if (!barcode) return null;

      // First, check if we have cached data in history
      const history = await getScanHistory();
      const cachedItem = history.find((item) => item.barcode === barcode);

      if (cachedItem?.product) {
        console.log(`Using cached product data for barcode: ${barcode}`);
        return cachedItem.product;
      }

      // If not in cache, fetch from API
      console.log(`Fetching fresh product data for barcode: ${barcode}`);
      return fetchProduct(barcode);
    },
    enabled: !!barcode,
    staleTime: Infinity, // Cached data never becomes stale (we control updates via history)
  });
}
