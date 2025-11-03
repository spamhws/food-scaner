import React from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { Card } from '@/components/ui/Card';
import {
  IconFlame,
  IconDroplet,
  IconEggFried,
  IconWheat,
  IconPhotoOff,
  IconMoodSurprised,
} from '@tabler/icons-react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchProduct } from '@/lib/api/product';

interface ProductCardProps {
  barcode: string;
  className?: string;
}

export function ProductCard({ barcode, className }: ProductCardProps) {
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['product', barcode],
    queryFn: () => fetchProduct(barcode),
    enabled: !!barcode,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isError = !!error;

  return (
    <Card className={`p-2 mb-0 flex-shrink-0 w-full ${className}`}>
      <View className="flex-row gap-3">
        {/* Left Section - Product Image */}
        <View className="relative aspect-square h-24 w-24 items-center justify-center rounded-xl border border-gray-30 bg-gray-10">
          {isLoading ? (
            <ActivityIndicator size="large" color="#8E99AB" />
          ) : isError ? (
            <IconMoodSurprised size={32} stroke="#8E99AB" />
          ) : product?.image ? (
            <Image
              source={{ uri: product.image }}
              className="rounded-lg"
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          ) : (
            <IconPhotoOff size={32} stroke="#8E99AB" />
          )}
        </View>

        {/* Right Section - Product Info */}
        <View className="flex-1 justify-center gap-1">
          {/* Product Name and Weight */}
          <Text className="font-medium text-base leading-5" numberOfLines={2}>
            {isLoading
              ? 'Loading product...'
              : isError
                ? 'Oops, nothing found'
                : product?.name || 'Unknown Product'}
            {!isLoading && !isError && product?.product_quantity
              ? `, ${product.product_quantity} ${product.product_quantity_unit}`
              : ''}
          </Text>

          {(isError || isLoading) && (
            <Text className="text-sm text-gray-60">
              {isLoading ? 'Please wait...' : 'Product not in knowledge base'}
            </Text>
          )}

          {/* Nutritional Information */}
          {product && !isError && !isLoading && (
            <View className="flex-row flex-wrap gap-x-4 gap-y-1">
              <View className="flex-row items-center gap-0.5">
                <IconFlame size={16} stroke="#8E99AB" />
                <Text className="font-semibold">
                  {Math.round(product.nutrition.calories.value)}
                </Text>
              </View>
              <View className="flex-row items-center gap-0.5">
                <IconEggFried size={16} stroke="#8E99AB" />
                <Text className="font-semibold">
                  {product.nutrition.protein.value.toFixed(1)}
                </Text>
              </View>
              <View className="flex-row items-center gap-0.5">
                <IconDroplet size={16} stroke="#8E99AB" />
                <Text className="font-semibold">
                  {product.nutrition.fat.value.toFixed(1)}
                </Text>
              </View>
              <View className="flex-row items-center gap-0.5">
                <IconWheat size={16} stroke="#8E99AB" />
                <Text className="font-semibold">
                  {product.nutrition.carbohydrates.value.toFixed(1)}
                </Text>
              </View>
            </View>
          )}

          {/* Health Assessment Label */}
          {!isLoading && !isError && product?.assessment && (
            <View className="mt-1">
              <View className="inline-flex self-start rounded-lg border border-bronze-60 bg-bronze-10 px-2 py-1">
                <Text className="font-semibold text-bronze-60 text-xs">
                  {product?.assessment.description}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
}

