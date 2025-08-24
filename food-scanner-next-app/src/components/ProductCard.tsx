import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { IconFlame, IconDroplet, IconEggFried, IconWheat } from '@tabler/icons-react';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className='p-2'>
      <div className='flex gap-3'>
        {/* Left Section - Product Image */}
        <div className='relative h-full w-24 aspect-square rounded-lg bg-gray-30'>
          <Image src={product.image} alt={product.name} fill className='object-contain rounded-lg' sizes='96px' />
        </div>

        {/* Right Section - Product Info */}
        <div className='flex flex-1 flex-col justify-center gap-1'>
          {/* Product Name and Weight */}
          <h2 className='font-medium text-base'>
            {product.name}, {product.brand} {product.product_quantity ? `, ${product.product_quantity} ${product.product_quantity_unit} asdasd asdasdas` : ''}
          </h2>

          {/* Nutritional Information */}
          <div className='flex gap-4'>
            <div className='flex items-center gap-0.5'>
              <IconFlame size={16} className='text-gray-50' />
              <span className='font-semibold'>{Math.round(product.nutrition.calories.value)}</span>
            </div>
            <div className='flex items-center gap-0.5'>
              <IconEggFried size={16} className='text-gray-50' />
              <span className='font-semibold'>{product.nutrition.protein.value.toFixed(1)}</span>
            </div>
            <div className='flex items-center gap-0.5'>
              <IconDroplet size={16} className='text-gray-50' />
              <span className='font-semibold'>{product.nutrition.fat.value.toFixed(1)}</span>
            </div>
            <div className='flex items-center gap-0.5'>
              <IconWheat size={16} className='text-gray-50' />
              <span className='font-semibold'>{product.nutrition.carbohydrates.value.toFixed(1)}</span>
            </div>
          </div>

          {/* Health Assessment Label */}
          <div className='mt-1'>
            <span className='inline-block px-2 py-1 rounded-lg bg-bronze-10 text-bronze-60 border border-bronze-60 font-semibold'>{product.assessment.description}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
