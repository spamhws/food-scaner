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
import { calculateBadgeGrade } from '@/lib/utils/badge-calculator';
import { getNutrientColor, getCaloriesColor } from '@/lib/utils/nutrient-colors';
import { useTranslation } from '@/hooks/useTranslation';

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
  const { t } = useTranslation();
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
      <View className="relative aspect-square h-full items-center justify-center rounded-xl border border-gray-30 bg-gray-10 overflow-hidden">
        {isLoading ? (
          <ActivityIndicator size="large" color="#8E99AB" />
        ) : isError ? (
          <IconMoodSurprised size={32} strokeWidth={1.75} stroke="#8E99AB" />
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
          <IconPhotoOff size={32} strokeWidth={1.75} stroke="#8E99AB" />
        )}
      </View>

      {/* Right Section - Product Info */}
      <View className="flex-1 justify-center gap-1.5">
        {/* Product Name, Brand, and Weight */}
        <Text className="font-medium text-base leading-6 text-black" numberOfLines={2}>
          {isLoading ? (
            t('product.loadingProduct')
          ) : isError ? (
            t('product.nothingFound')
          ) : (
            <>
              {product?.name || t('product.unknownProduct')}
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
            {isLoading ? t('common.pleaseWait') : t('product.notInDatabase')}
          </Text>
        )}

        {/* Nutritional Information */}
        {product && !isError && !isLoading && (
          <View className="flex-row flex-wrap gap-x-2 gap-y-1">
            {/* Calories - only if provided */}
            {product.nutrition.calories && (
              <View className="flex-row items-center gap-0.5">
                <IconFlame
                  size={16}
                  stroke={getCaloriesColor(product.nutrientLevels, product.nutrition)}
                  strokeWidth={1.75}
                />
                <Text className="font-semibold">
                  {Math.round(product.nutrition.calories.value)}
                </Text>
              </View>
            )}
            {/* Protein - only if provided */}
            {product.nutrition.protein && (
              <View className="flex-row items-center gap-0.5">
                <IconMeat
                  size={16}
                  stroke={getNutrientColor(product.nutrientLevels, 'proteins', product.nutrition)}
                  strokeWidth={1.75}
                />
                <Text className="font-semibold">{product.nutrition.protein.value.toFixed(1)}</Text>
              </View>
            )}
            {/* Fat - only if provided */}
            {product.nutrition.fat && (
              <View className="flex-row items-center gap-0.5">
                <IconDroplet
                  size={16}
                  stroke={getNutrientColor(product.nutrientLevels, 'fat', product.nutrition)}
                  strokeWidth={1.75}
                />
                <Text className="font-semibold">{product.nutrition.fat.value.toFixed(1)}</Text>
              </View>
            )}
            {/* Carbohydrates - only if provided */}
            {product.nutrition.carbohydrates && (
              <View className="flex-row items-center gap-0.5">
                <IconWheat
                  size={16}
                  stroke={getNutrientColor(
                    product.nutrientLevels,
                    'carbohydrates',
                    product.nutrition
                  )}
                  strokeWidth={1.75}
                />
                <Text className="font-semibold">
                  {product.nutrition.carbohydrates.value.toFixed(1)}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Health Assessment Badge */}
        {!isLoading &&
          !isError &&
          product &&
          (() => {
            const badgeGrade = calculateBadgeGrade(product);
            return badgeGrade ? (
              <View className="mt-1 self-start">
                <Badge
                  variant={getNutriscoreBadgeVariant(badgeGrade)}
                  label={getNutriscoreDescription(badgeGrade, t)}
                />
              </View>
            ) : null;
          })()}
      </View>
    </View>
  );

  return (
    <Card
      className={clsx('p-2 mb-0 flex-shrink-0 min-h-[120px]', inSlider ? '' : 'w-full', className)}
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
