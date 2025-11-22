import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  barcodes: string[];
  onProductPress?: (barcode: string) => void;
  contentInsetTop?: number;
}

export function ProductList({ barcodes, onProductPress, contentInsetTop = 0 }: ProductListProps) {
  if (barcodes.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6" style={{ paddingTop: contentInsetTop }}>
        <Text className="text-center text-gray-60 text-base">No products to display</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ 
        paddingTop: contentInsetTop + 16,
        paddingHorizontal: 16,
        paddingBottom: 16,
      }}
      showsVerticalScrollIndicator={false}
    >
      {barcodes.map((barcode, index) => (
        <View key={barcode} className={index < barcodes.length - 1 ? "mb-3" : ""}>
          <ProductCard
            barcode={barcode}
            onPress={onProductPress ? () => onProductPress(barcode) : undefined}
          />
        </View>
      ))}
    </ScrollView>
  );
}
