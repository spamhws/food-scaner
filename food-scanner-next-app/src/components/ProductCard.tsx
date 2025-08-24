import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card>
      <div className='flex flex-col items-center gap-6'>
        <div className='relative w-48 h-48'>
          <Image src={product.image} alt={product.name} fill className='object-contain rounded-lg' sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' />
        </div>
        <div className='w-full'>
          <h2 className='text-xl font-semibold text-gray-90 text-center'>{product.name}</h2>
          <p className='text-gray-60 text-center'>{product.brand}</p>
          <div className='mt-2 flex flex-wrap justify-center gap-2'>
            {product.labels.map((label) => (
              <span key={label} className='px-2 py-1 text-sm rounded-full bg-blue-10 text-blue-70'>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
      {product.allergens.length > 0 && (
        <div className='mt-6'>
          <h3 className='text-sm font-medium text-gray-70'>Allergens:</h3>
          <div className='mt-1 flex flex-wrap gap-2'>
            {product.allergens.map((allergen) => (
              <span key={allergen} className='px-2 py-1 text-sm rounded-full bg-red-10 text-red-60'>
                {allergen}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
