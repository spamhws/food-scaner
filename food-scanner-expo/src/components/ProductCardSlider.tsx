import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { ProductCard } from './ProductCard';

interface ProductCardSliderProps {
  barcodes: string[];
  height: number;
  onProductPress?: (barcode: string) => void;
}

export interface ProductCardSliderRef {
  scrollToBarcode: (barcode: string, barcodesArray: string[]) => void;
}

export const ProductCardSlider = forwardRef<ProductCardSliderRef, ProductCardSliderProps>(
  ({ barcodes, height, onProductPress }, ref) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const screenWidth = Dimensions.get('window').width;
    const cardWidth = screenWidth - 48; // Account for padding
    const gap = 24;

    useImperativeHandle(ref, () => ({
      scrollToBarcode: (barcode: string, barcodesArray: string[]) => {
        // Use the passed array to ensure we have the current state
        const index = barcodesArray.indexOf(barcode);
        if (index === -1) {
          return; // Barcode not found in array
        }

        if (!scrollViewRef.current) {
          // Retry after a short delay if ref isn't ready
          setTimeout(() => {
            if (scrollViewRef.current) {
              const scrollPosition = index * (cardWidth + gap);
              scrollViewRef.current.scrollTo({
                x: scrollPosition,
                animated: true,
              });
            }
          }, 100);
          return;
        }

        const scrollPosition = index * (cardWidth + gap);
        // Ensure layout is complete before scrolling
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (scrollViewRef.current) {
              scrollViewRef.current.scrollTo({
                x: scrollPosition,
                animated: true,
              });
            }
          });
        });
      },
    }));

    // Auto-scroll to the latest card when barcodes array changes (only if new item added)
    const prevLengthRef = useRef(barcodes.length);
    useEffect(() => {
      if (barcodes.length > 0 && barcodes.length > prevLengthRef.current && scrollViewRef.current) {
        const scrollPosition = (barcodes.length - 1) * (cardWidth + gap);

        // Delay to ensure layout is complete
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            x: scrollPosition,
            animated: true,
          });
        }, 100);
      }
      prevLengthRef.current = barcodes.length;
    }, [barcodes.length, cardWidth, gap]);

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
              <ProductCard
                barcode={barcode}
                onPress={onProductPress ? () => onProductPress(barcode) : undefined}
              />
            </View>
          ))}
      </ScrollView>
    );
  }
);

ProductCardSlider.displayName = 'ProductCardSlider';
