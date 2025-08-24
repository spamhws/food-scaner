'use client';

import { useQuery } from '@tanstack/react-query';
import { ProductCard } from './ProductCard';
import { fetchProduct } from '@/lib/api/product';

interface ProductResultProps {
  barcode: string | null;
}

export function ProductResult({ barcode }: ProductResultProps) {
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['product', barcode],
    queryFn: () => fetchProduct(barcode!),
    enabled: !!barcode,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (!barcode) {
    return null;
  }

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center h-full gap-2'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-500'></div>
        <p className='text-xs text-gray-50 font-mono'>Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center h-full gap-2'>
        <p className='text-xs text-red-60 font-mono'>Product not found</p>
      </div>
    );
  }

  if (product) {
    return (
      <div className='animate-in fade-in duration-500 ease-out'>
        <ProductCard product={product} />
      </div>
    );
  }

  return null;
}
