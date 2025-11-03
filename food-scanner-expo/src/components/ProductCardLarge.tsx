import React from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/Card';
import {
  IconFlame,
  IconDroplet,
  IconEggFried,
  IconWheat,
  IconPhotoOff,
  IconMoodSurprised,
  IconHeart,
} from '@tabler/icons-react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchProduct } from '@/lib/api/product';

interface ProductCardLargeProps {
  barcode: string;
}

export function ProductCardLarge({ barcode }: ProductCardLargeProps) {
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['product', barcode],
    queryFn: () => fetchProduct(barcode),
    enabled: !!barcode,
    staleTime: 5 * 60 * 1000,
  });

  const isError = !!error;

  return (
    <Card className="p-4">
      <View className="flex-row gap-4">
        {/* Product Image */}
        <View className="relative w-20 h-20 items-center justify-center rounded-xl border border-gray-30 bg-gray-10">
          {isLoading ? (
            <ActivityIndicator size="small" color="#8E99AB" />
          ) : isError ? (
            <IconMoodSurprised size={24} stroke="#8E99AB" />
          ) : product?.image ? (
            <Image
              source={{ uri: product.image }}
              className="rounded-lg"
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          ) : (
            <IconPhotoOff size={24} stroke="#8E99AB" />
          )}
        </View>

        {/* Product Info */}
        <View className="flex-1">
          {/* Product Name */}
          <Text className="font-semibold text-base text-gray-90" numberOfLines={2}>
            {isLoading
              ? 'Завантаження...'
              : isError
                ? 'Продукт не знайдено'
                : product?.name || 'Невідомий продукт'}
          </Text>

          {product && (
            <Text className="text-sm text-gray-60 mt-0.5">
              {product.product_quantity} {product.product_quantity_unit}
            </Text>
          )}

          {/* Nutritional Information */}
          {product && !isError && !isLoading && (
            <View className="flex-row flex-wrap gap-x-3 gap-y-1 mt-2">
              <View className="flex-row items-center gap-1">
                <IconFlame size={14} stroke="#8E99AB" />
                <Text className="text-xs font-medium text-gray-90">
                  {Math.round(product.nutrition.calories.value)}
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <IconEggFried size={14} stroke="#8E99AB" />
                <Text className="text-xs font-medium text-gray-90">
                  {product.nutrition.protein.value.toFixed(1)}
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <IconDroplet size={14} stroke="#8E99AB" />
                <Text className="text-xs font-medium text-gray-90">
                  {product.nutrition.fat.value.toFixed(1)}
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <IconWheat size={14} stroke="#8E99AB" />
                <Text className="text-xs font-medium text-gray-90">
                  {product.nutrition.carbohydrates.value.toFixed(1)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Favorite Button */}
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center"
          onPress={() => console.log('Toggle favorite')}
        >
          <IconHeart size={24} stroke="#DE1B1B" />
        </TouchableOpacity>
      </View>

      {/* Health Assessment Label */}
      {!isLoading && !isError && product?.assessment && (
        <View className="mt-3">
          <View
            className="self-start rounded-lg px-3 py-1.5"
            style={{
              backgroundColor:
                product.assessment.category === 'A' || product.assessment.category === 'B'
                  ? '#E1FAEB'
                  : product.assessment.category === 'C'
                    ? '#FCF2E6'
                    : '#FAF0F0',
              borderColor:
                product.assessment.category === 'A' || product.assessment.category === 'B'
                  ? '#038537'
                  : product.assessment.category === 'C'
                    ? '#AD5F00'
                    : '#DE1B1B',
              borderWidth: 1,
            }}
          >
            <Text
              className="text-xs font-semibold"
              style={{
                color:
                  product.assessment.category === 'A' || product.assessment.category === 'B'
                    ? '#038537'
                    : product.assessment.category === 'C'
                      ? '#AD5F00'
                      : '#DE1B1B',
              }}
            >
              {product.assessment.description}
            </Text>
          </View>
        </View>
      )}
    </Card>
  );
}

