import React from 'react';
import { View, Image, Text } from 'react-native';
import type { Product } from '@/types/product';
import { Badge } from '@/components/ui/Badge';
import { InfoCard } from './InfoCard';
import { getNutriscoreBadgeVariant, getNutriscoreDescription } from '@/lib/utils/product-narrative';
import { calculateBadgeGrade } from '@/lib/utils/badge-calculator';

interface ImageTitleSectionProps {
  product: Product;
  onNutriscorePress: () => void;
}

export function ImageTitleSection({ product, onNutriscorePress }: ImageTitleSectionProps) {
  return (
    <InfoCard className="flex-col gap-4">
      {product.image ? (
        <View
          className="rounded-xl items-center justify-center -m-2 mb-0 overflow-hidden"
          style={{ height: 240 }}
        >
          <Image
            source={{ uri: product.image }}
            className="absolute h-full w-full"
            blurRadius={16}
          />
          <Image source={{ uri: product.image }} className="h-full w-full" resizeMode="contain" />
        </View>
      ) : null}

      <View className="items-center mb-2 gap-3">
        <Text className="text-title font-bold text-center -mx-2 text-black">
          {product.name || 'Unknown Product'}
          {product.brand &&
            product.brand !== 'null' &&
            product.brand.trim() &&
            ` (${product.brand})`}
        </Text>
        {(() => {
          const badgeGrade = calculateBadgeGrade(product);
          return badgeGrade ? (
            <Badge
              variant={getNutriscoreBadgeVariant(badgeGrade)}
              label={getNutriscoreDescription(badgeGrade)}
              interactive
              onPress={onNutriscorePress}
            />
          ) : null;
        })()}
      </View>
    </InfoCard>
  );
}
