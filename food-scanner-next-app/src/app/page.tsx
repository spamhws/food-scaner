'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { NutritionCard } from '@/components/NutritionCard';
import { AssessmentCard } from '@/components/AssessmentCard';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { useProduct } from '@/hooks/useProduct';

export default function Home() {
  const [searchBarcode, setSearchBarcode] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { data: product } = useProduct(searchBarcode);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleBarcodeDetected = (barcode: string) => {
    setSearchBarcode(barcode);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <main className='h-screen w-screen relative'>
        <div className='h-full w-full flex items-center justify-center'>
          <div className='text-gray-500'>Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main className='h-screen w-screen relative'>
      {!product && <BarcodeScanner onBarcodeDetected={handleBarcodeDetected} />}

      {product && (
        <div className='min-h-screen bg-gray-10 py-8 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-3xl mx-auto'>
            <ProductCard product={product} />
            <NutritionCard nutrition={product.nutrition} />
            <AssessmentCard assessment={product.assessment} />
          </div>
        </div>
      )}
    </main>
  );
}
