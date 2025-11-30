import React from 'react';
import { View, Image, Text } from 'react-native';
import type { Product } from '@/types/product';
import { Badge } from '@/components/ui/Badge';
import { InfoCard } from './InfoCard';
import { getNutriscoreBadgeVariant, getNutriscoreDescription } from '@/lib/utils/product-narrative';

interface ImageTitleSectionProps {
  product: Product;
  onNutriscorePress: () => void;
}

export function ImageTitleSection({ product, onNutriscorePress }: ImageTitleSectionProps) {
  return (
    <InfoCard className="flex-col gap-4">
      <View
        className="rounded-xl items-center justify-center -m-2 mb-0 overflow-hidden"
        style={{ height: 240 }}
      >
        {product.image ? (
          <>
            <Image
              source={{ uri: product.image }}
              className="absolute h-full w-full"
              blurRadius={16}
            />
            <Image
              source={{ uri: product.image }}
              className="h-full w-full"
              resizeMode="contain"
            />
          </>
        ) : (
          <View className="bg-gray-20 w-full h-full" />
        )}
      </View>
      <View className="items-center mb-2 gap-3">
        <Text className="text-title font-bold text-center text-black">
          {product.name || 'Unknown Product'}
          {product.brand &&
            product.brand !== 'null' &&
            product.brand.trim() &&
            ` (${product.brand})`}
        </Text>
        {product.assessment && (
          <Badge
            variant={getNutriscoreBadgeVariant(product.assessment.category)}
            label={getNutriscoreDescription(product.assessment.category)}
            interactive
            onPress={onNutriscorePress}
          />
        )}
      </View>
    </InfoCard>
  );
}

