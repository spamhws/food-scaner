import React, { useEffect } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useProduct } from '@/hooks/useProduct';
import { useScanHistory } from '@/hooks/useScanHistory';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

interface ProductCardProps {
  barcode: string;
}

export function ProductCard({ barcode }: ProductCardProps) {
  const router = useRouter();
  const { data: product, isLoading, error } = useProduct(barcode);
  const { addToHistory } = useScanHistory();

  // Cache product data when successfully fetched
  useEffect(() => {
    if (product && !error) {
      addToHistory({ barcode, product });
    }
  }, [product, error, barcode, addToHistory]);

  const handlePress = () => {
    if (product) {
      router.push(`/product/${barcode}`);
    }
  };

  return (
    <Pressable onPress={handlePress} className='bg-white rounded-2xl p-2 shadow-lg active:opacity-80'>
      <View className='flex-row gap-3'>
        {/* Left Section - Product Image */}
        <View className='w-24 h-24 rounded-xl border border-gray-30 bg-gray-10 items-center justify-center'>{isLoading ? <MaterialIcons name='refresh' size={32} color='#8C8C8C' /> : error ? <Ionicons name='sad-outline' size={32} color='#8C8C8C' /> : product?.image ? <Image source={{ uri: product.image }} className='w-full h-full rounded-lg' resizeMode='contain' /> : <MaterialIcons name='photo-camera' size={32} color='#8C8C8C' />}</View>

        {/* Right Section - Product Info */}
        <View className='flex-1 justify-center gap-1'>
          <Text className='text-base font-medium leading-5' numberOfLines={2} style={{ maxHeight: 36 }}>
            {isLoading ? 'Loading product...' : error ? 'Oops, nothing found' : product?.name || 'Unknown Product'}
            {!isLoading && !error && product?.product_quantity ? `, ${product.product_quantity}${product.product_quantity_unit}` : ''}
          </Text>

          {(error || isLoading) && <Text className='text-sm text-gray-60'>{isLoading ? 'Please wait...' : 'Product not in knowledge base'}</Text>}

          {/* Nutritional Information */}
          {product && !error && !isLoading && (
            <View className='flex-row flex-wrap gap-x-4 gap-y-1'>
              <View className='flex-row items-center gap-0.5'>
                <MaterialIcons name='local-fire-department' size={16} color='#A6A6A6' />
                <Text className='text-sm font-semibold'>{Math.round(product.nutrition.calories.value)}</Text>
              </View>
              <View className='flex-row items-center gap-0.5'>
                <MaterialIcons name='egg' size={16} color='#A6A6A6' />
                <Text className='text-sm font-semibold'>{product.nutrition.protein.value.toFixed(1)}</Text>
              </View>
              <View className='flex-row items-center gap-0.5'>
                <MaterialIcons name='water-drop' size={16} color='#A6A6A6' />
                <Text className='text-sm font-semibold'>{product.nutrition.fat.value.toFixed(1)}</Text>
              </View>
              <View className='flex-row items-center gap-0.5'>
                <MaterialIcons name='grain' size={16} color='#A6A6A6' />
                <Text className='text-sm font-semibold'>{product.nutrition.carbohydrates.value.toFixed(1)}</Text>
              </View>
            </View>
          )}

          {/* Health Assessment Label */}
          {!isLoading && !error && product?.assessment && (
            <View className='mt-1'>
              <View className='self-start rounded-lg border px-2 py-1' style={{ borderColor: product.assessment.color, backgroundColor: `${product.assessment.color}15` }}>
                <Text className='text-xs font-semibold' style={{ color: product.assessment.color }}>
                  {product.assessment.description}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}
