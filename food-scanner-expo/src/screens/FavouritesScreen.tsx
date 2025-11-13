import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, BackHandler } from 'react-native';
import { ProductList } from '@/components/ProductList';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@/navigation/navigation-types';
import { useFavorites } from '@/hooks/useFavorites';
import { ProductDetailSheet, type ProductDetailSheetRef } from '@/components/ProductDetailSheet/ProductDetailSheet';
import { useProduct } from '@/hooks/useProduct';

export function FavouritesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { favorites, isLoading } = useFavorites();
  const [selectedBarcode, setSelectedBarcode] = useState<string | null>(null);
  const bottomSheetRef = useRef<ProductDetailSheetRef>(null);

  // Fetch selected product data (from cache)
  const { data: selectedProduct } = useProduct({
    barcode: selectedBarcode || '',
    enabled: !!selectedBarcode,
    fromCache: true,
  });

  const handleProductPress = (barcode: string) => {
    setSelectedBarcode(barcode);
    bottomSheetRef.current?.expand();
  };

  const handleBottomSheetClose = () => {
    setSelectedBarcode(null);
  };

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <View className="flex-1 bg-gray-10">
      {/* Product List */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3272D9" />
        </View>
      ) : favorites.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-gray-60 text-base">
            Add products to favourites to see them here
          </Text>
        </View>
      ) : (
        <ProductList barcodes={favorites} onProductPress={handleProductPress} />
      )}

      {/* Product Detail Sheet */}
      <ProductDetailSheet
        ref={bottomSheetRef}
        product={selectedProduct || null}
        onClose={handleBottomSheetClose}
      />
    </View>
  );
}
