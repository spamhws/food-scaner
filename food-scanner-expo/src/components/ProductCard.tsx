import React, { useEffect, useRef } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/Card';
import { clsx } from 'clsx';
import {
  IconFlame,
  IconDroplet,
  IconMeat,
  IconWheat,
  IconPhotoOff,
  IconMoodSurprised,
} from '@tabler/icons-react-native';
import { useProduct } from '@/hooks/useProduct';
import { vibrateProductFound, vibrateProductNotFound } from '@/lib/utils/vibration';
import { Badge } from '@/components/ui/Badge';
import { getNutriscoreBadgeVariant, getNutriscoreDescription } from '@/lib/utils/product-narrative';

interface ProductCardProps {
  barcode: string;
  className?: string;
  onPress?: () => void;
  vibrateOnScan?: boolean;
  inSlider?: boolean;
  sliderWidth?: number;
}

export function ProductCard({
  barcode,
  className,
  onPress,
  vibrateOnScan = false,
  inSlider = false,
  sliderWidth,
}: ProductCardProps) {
  const { data: product, isLoading } = useProduct({
    barcode,
    enabled: !!barcode,
    fromCache: !vibrateOnScan, // Scanner mode: always fetch, History/Favs: use cache
  });

  // Product not found if data is null and not loading
  const isError = !isLoading && product === null;
  const hasVibratedRef = useRef(false);

  // Reset vibration flag when barcode changes
  useEffect(() => {
    hasVibratedRef.current = false;
  }, [barcode]);

  // Vibrate when product is found or not found
  useEffect(() => {
    if (vibrateOnScan && !isLoading && barcode && !hasVibratedRef.current) {
      if (product) {
        vibrateProductFound();
        hasVibratedRef.current = true;
      } else if (isError) {
        vibrateProductNotFound();
        hasVibratedRef.current = true;
      }
    }
  }, [product, isError, isLoading, barcode, vibrateOnScan]);

  const content = (
    <View className="flex-row gap-3">
      {/* Left Section - Product Image */}
      <View className="relative aspect-square h-[100px] w-[100px] items-center justify-center rounded-xl border border-gray-30 bg-gray-10 overflow-hidden">
        {isLoading ? (
          <ActivityIndicator size="large" color="#8E99AB" />
        ) : isError ? (
          <IconMoodSurprised size={32} strokeWidth={1.5} stroke="#8E99AB" />
        ) : product?.image ? (
          <>
            <Image
              source={{ uri: product.image }}
              className="absolute h-full w-full"
              blurRadius={16}
            />
            <Image source={{ uri: product.image }} className="h-full w-full" resizeMode="contain" />
          </>
        ) : (
          <IconPhotoOff size={32} strokeWidth={1.5} stroke="#8E99AB" />
        )}
      </View>

      {/* Right Section - Product Info */}
      <View className="flex-1 justify-center gap-1">
        {/* Product Name, Brand, and Weight */}
        <Text className="font-medium text-base leading-5 text-black" numberOfLines={2}>
          {isLoading ? (
            'Loading product...'
          ) : isError ? (
            'Oops, nothing found'
          ) : (
            <>
              {product?.name || 'Unknown Product'}
              {product?.brand &&
                product.brand !== 'null' &&
                product.brand.trim() &&
                `, ${product.brand}`}
              {product?.product_quantity &&
                `, ${product.product_quantity} ${product.product_quantity_unit}`}
            </>
          )}
        </Text>

        {(isError || isLoading) && (
          <Text className="text-sm text-gray-60">
            {isLoading ? 'Please wait...' : 'It seems this item is not in my knowledge base'}
          </Text>
        )}

        {/* Nutritional Information */}
        {product && !isError && !isLoading && (
          <View className="flex-row flex-wrap gap-x-2 gap-y-1">
            <View className="flex-row items-center gap-0.5">
              <IconFlame size={16} stroke="#8E99AB" strokeWidth={1.5} />
              <Text className="font-semibold">{Math.round(product.nutrition.calories.value)}</Text>
            </View>
            <View className="flex-row items-center gap-0.5">
              <IconMeat size={16} stroke="#8E99AB" strokeWidth={1.5} />
              <Text className="font-semibold">{product.nutrition.protein.value.toFixed(1)}</Text>
            </View>
            <View className="flex-row items-center gap-0.5">
              <IconDroplet size={16} stroke="#8E99AB" strokeWidth={1.5} />
              <Text className="font-semibold">{product.nutrition.fat.value.toFixed(1)}</Text>
            </View>
            <View className="flex-row items-center gap-0.5">
              <IconWheat size={16} stroke="#8E99AB" strokeWidth={1.5} />
              <Text className="font-semibold">
                {product.nutrition.carbohydrates.value.toFixed(1)}
              </Text>
            </View>
          </View>
        )}

        {/* Health Assessment Badge */}
        {!isLoading && !isError && product?.assessment && (
          <View className="mt-1 self-start">
            <Badge
              variant={getNutriscoreBadgeVariant(product.assessment.category)}
              label={getNutriscoreDescription(product.assessment.category)}
            />
          </View>
        )}
      </View>
    </View>
  );

  return (
    <Card
      className={clsx('p-2 mb-0 flex-shrink-0 min-h-[116px]', inSlider ? '' : 'w-full', className)}
      style={inSlider && sliderWidth ? { width: sliderWidth } : undefined}
    >
      {onPress && product && !isError && !isLoading ? (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
          {content}
        </TouchableOpacity>
      ) : (
        content
      )}
    </Card>
  );
}
