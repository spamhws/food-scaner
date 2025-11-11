import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { ProductCard } from './ProductCard';

interface ProductCardSliderProps {
  barcodes: string[];
  height: number;
}

export function ProductCardSlider({ barcodes, height }: ProductCardSliderProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const screenWidth = Dimensions.get('window').width;

  // Auto-scroll to the latest card when barcodes array changes
  useEffect(() => {
    if (barcodes.length > 0 && scrollViewRef.current) {
      const cardWidth = screenWidth - 48; // Account for padding
      const gap = 24;
      const scrollPosition = (barcodes.length - 1) * (cardWidth + gap);

      // Delay to ensure layout is complete
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: scrollPosition,
          animated: true,
        });
      }, 100);
    }
  }, [barcodes.length, screenWidth]);

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={screenWidth - 48 + 24} // card width + gap
      decelerationRate="fast"
      contentContainerStyle={{
        paddingHorizontal: 24,
        gap: 24,
        height: height,
      }}
      style={{ height: height }}
    >
      {barcodes.length > 0 &&
        barcodes.map((barcode) => (
          <View key={barcode} style={{ width: screenWidth - 48 }}>
            <ProductCard barcode={barcode} />
          </View>
        ))}
    </ScrollView>
  );
}
