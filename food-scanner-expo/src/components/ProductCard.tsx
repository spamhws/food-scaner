import React, { useEffect, useRef } from 'react';
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
import { vibrateProductFound, vibrateProductNotFound } from '@/lib/utils/vibration';
import { Badge } from '@/components/ui/Badge';
import { getNutriscoreBadgeVariant, getNutriscoreDescription } from '@/lib/utils/product-narrative';

type ProductCardVariant = 'slider' | 'list';

interface ProductCardProps {
  barcode: string;
  className?: string;
  variant?: ProductCardVariant;
  onPress?: () => void;
  showFavorite?: boolean;
  onFavoritePress?: () => void;
}

export function ProductCard({
  barcode,
  className,
  variant = 'slider',
  onPress,
  showFavorite = false,
  onFavoritePress,
}: ProductCardProps) {
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', barcode],
    queryFn: () => fetchProduct(barcode),
    enabled: !!barcode,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Product not found if data is null and not loading
  const isError = !isLoading && product === null;
  const hasVibratedRef = useRef(false);

  // Reset vibration flag when barcode changes
  useEffect(() => {
    hasVibratedRef.current = false;
  }, [barcode]);

  // Vibrate when product is found or not found (only for slider variant)
  useEffect(() => {
    if (variant === 'slider' && !isLoading && barcode && !hasVibratedRef.current) {
      if (product) {
        vibrateProductFound();
        hasVibratedRef.current = true;
      } else if (isError) {
        vibrateProductNotFound();
        hasVibratedRef.current = true;
      }
    }
  }, [product, isError, isLoading, barcode, variant]);

  const imageSize = variant === 'slider' ? 'h-24 w-24' : 'h-20 w-20';
  const iconSize = variant === 'slider' ? 32 : 24;
  const nutritionIconSize = variant === 'slider' ? 16 : 14;

  const content = (
    <View className="flex-row gap-3">
      {/* Left Section - Product Image */}
      <View
        className={`relative aspect-square ${imageSize} items-center justify-center rounded-xl border border-gray-30 bg-gray-10`}
      >
        {isLoading ? (
          <ActivityIndicator size={variant === 'slider' ? 'large' : 'small'} color="#8E99AB" />
        ) : isError ? (
          <IconMoodSurprised size={iconSize} stroke="#8E99AB" />
        ) : product?.image ? (
          <Image
            source={{ uri: product.image }}
            className="rounded-lg"
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
          />
        ) : (
          <IconPhotoOff size={iconSize} stroke="#8E99AB" />
        )}
      </View>

      {/* Right Section - Product Info */}
      <View className="flex-1 justify-center gap-1">
        {/* Product Name, Brand, and Weight */}
        <Text
          className={`font-${variant === 'slider' ? 'medium' : 'semibold'} text-${
            variant === 'slider' ? 'base' : 'base'
          } leading-5 text-black`}
          numberOfLines={2}
        >
          {isLoading ? (
            'Loading product...'
          ) : isError ? (
            'Oops, nothing found'
          ) : (
            <>
              {product?.name || 'Unknown Product'}
              {variant === 'slider' && product?.brand && `, ${product.brand}`}
              {variant === 'slider' &&
                product?.product_quantity &&
                `, ${product.product_quantity} ${product.product_quantity_unit}`}
            </>
          )}
        </Text>

        {/* Weight on separate line for list variant only */}
        {variant === 'list' && !isLoading && !isError && product?.product_quantity && (
          <Text className="text-sm text-gray-60">
            {product.product_quantity} {product.product_quantity_unit}
          </Text>
        )}

        {(isError || isLoading) && (
          <Text className="text-sm text-gray-60">
            {isLoading ? 'Please wait...' : 'Product not in knowledge base'}
          </Text>
        )}

        {/* Nutritional Information */}
        {product && !isError && !isLoading && (
          <View
            className={`flex-row flex-wrap ${
              variant === 'slider' ? 'gap-x-4' : 'gap-x-3'
            } gap-y-1 mt-${variant === 'list' ? '2' : '0'}`}
          >
            <View className="flex-row items-center gap-1">
              <IconFlame size={nutritionIconSize} stroke="#8E99AB" />
              <Text
                className={`${
                  variant === 'slider' ? 'font-semibold' : 'text-xs font-medium text-gray-90'
                }`}
              >
                {Math.round(product.nutrition.calories.value)}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <IconEggFried size={nutritionIconSize} stroke="#8E99AB" />
              <Text
                className={`${
                  variant === 'slider' ? 'font-semibold' : 'text-xs font-medium text-gray-90'
                }`}
              >
                {product.nutrition.protein.value.toFixed(1)}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <IconDroplet size={nutritionIconSize} stroke="#8E99AB" />
              <Text
                className={`${
                  variant === 'slider' ? 'font-semibold' : 'text-xs font-medium text-gray-90'
                }`}
              >
                {product.nutrition.fat.value.toFixed(1)}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <IconWheat size={nutritionIconSize} stroke="#8E99AB" />
              <Text
                className={`${
                  variant === 'slider' ? 'font-semibold' : 'text-xs font-medium text-gray-90'
                }`}
              >
                {product.nutrition.carbohydrates.value.toFixed(1)}
              </Text>
            </View>
          </View>
        )}

        {/* Health Assessment Label - only for slider variant */}
        {variant === 'slider' && !isLoading && !isError && product?.assessment && (
          <View className="mt-1">
            <View className="inline-flex self-start rounded-lg border border-bronze-60 bg-bronze-10 px-2 py-1">
              <Text className="font-semibold text-bronze-60 text-xs">
                {product?.assessment.description}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Favorite Button - only for list variant */}
      {variant === 'list' && showFavorite && (
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center"
          onPress={onFavoritePress}
        >
          <IconHeart size={24} stroke="#DE1B1B" />
        </TouchableOpacity>
      )}
    </View>
  );

  // Badge for list variant
  const badge =
    variant === 'list' && !isLoading && !isError && product?.assessment ? (
      <View className="mt-3">
        <Badge
          variant={getNutriscoreBadgeVariant(product.assessment.category)}
          label={getNutriscoreDescription(product.assessment.category)}
        />
      </View>
    ) : null;

  return (
    <Card
      className={`${variant === 'slider' ? 'p-2' : 'p-4'} mb-0 flex-shrink-0 w-full ${className}`}
    >
      {onPress && product && !isError && !isLoading ? (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
          {content}
        </TouchableOpacity>
      ) : (
        content
      )}
      {badge}
    </Card>
  );
}
