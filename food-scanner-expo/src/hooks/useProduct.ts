import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { fetchProduct } from '@/lib/api/product';
import { getCachedProduct, cacheProduct } from '@/lib/storage/storage';
import type { Product } from '@/types/product';

interface UseProductOptions {
  barcode: string;
  enabled?: boolean;
  fromCache?: boolean; // If true, prioritize cache and don't refetch
}

/**
 * Custom hook that fetches product data with persistent cache
 *
 * Behavior:
 * - fromCache=false (scanner): Always fetch from API, cache result
 * - fromCache=true (history/favs): Load from cache first, skip API call
 */
export function useProduct({ barcode, enabled = true, fromCache = false }: UseProductOptions) {
  const [cachedData, setCachedData] = useState<Product | null | undefined>(undefined);

  // Load cached data on mount or when barcode changes
  useEffect(() => {
    if (!barcode || !enabled) {
      setCachedData(undefined);
      return;
    }

    getCachedProduct(barcode).then((cached) => {
      if (cached) {
        console.log(`📦 Loaded product ${barcode} from cache`);
        setCachedData(cached);
      } else {
        setCachedData(null);
      }
    });
  }, [barcode, enabled]);

  const query = useQuery({
    queryKey: ['product', barcode],
    queryFn: async () => {
      // Always fetch from API to get fresh data
      console.log(`🌐 Fetching product ${barcode} from API`);
      const product = await fetchProduct(barcode);

      // Cache the result if successful
      if (product) {
        await cacheProduct(product);
        setCachedData(product);
      }

      return product;
    },
    enabled: enabled && !!barcode && !fromCache, // Skip API call if fromCache=true
    staleTime: 0, // Always refetch when scanner mode
    gcTime: 24 * 60 * 60 * 1000, // Keep in React Query cache for 24 hours
  });

  // Return cached data if available and using cache mode, otherwise return query data
  return {
    ...query,
    data: fromCache && cachedData !== undefined ? cachedData : query.data,
    isLoading: fromCache ? cachedData === undefined : query.isLoading,
  };
}
