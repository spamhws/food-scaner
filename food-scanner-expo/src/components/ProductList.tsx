import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  barcodes: string[];
  onProductPress?: (barcode: string) => void;
}

export function ProductList({ barcodes, onProductPress }: ProductListProps) {
  if (barcodes.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-center text-gray-60 text-base">No products to display</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {barcodes.map((barcode, index) => (
        <View key={barcode} style={{ marginBottom: index < barcodes.length - 1 ? 12 : 0 }}>
          <ProductCard
            barcode={barcode}
            onPress={onProductPress ? () => onProductPress(barcode) : undefined}
          />
        </View>
      ))}
    </ScrollView>
  );
}
