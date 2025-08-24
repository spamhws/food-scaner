'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchProduct } from '@/lib/api/product';
import type { Product } from '@/types/product';

export function useProduct(barcode: string | null) {
  return useQuery<Product | null>({
    queryKey: ['product', barcode],
    queryFn: () => fetchProduct(barcode!),
    enabled: !!barcode,
  });
}
