import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, BackHandler, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProductList } from '@/components/ProductList';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@/navigation/navigation-types';
import { ProductDetailSheet } from '@/components/ProductDetailSheet/ProductDetailSheet';
import { useProduct } from '@/hooks/useProduct';
import { useFavorites } from '@/hooks/useFavorites';

export function FavouritesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { favorites, isLoading } = useFavorites();
  const [selectedBarcode, setSelectedBarcode] = useState<string | null>(null);
  
  // Header height (44px) + status bar - only needed on iOS with transparent header
  const headerHeight = Platform.OS === 'ios' ? 44 + insets.top : 0;

  // Fetch selected product data (from cache)
  const { data: selectedProduct } = useProduct({
    barcode: selectedBarcode || '',
    enabled: !!selectedBarcode,
    fromCache: true,
  });

  const handleProductPress = (barcode: string) => {
    setSelectedBarcode(barcode);
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
        <View className="flex-1 justify-center items-center" style={{ paddingTop: headerHeight }}>
          <ActivityIndicator size="large" color="#3272D9" />
        </View>
      ) : favorites.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6" style={{ paddingTop: headerHeight }}>
          <Text className="text-center text-gray-60 text-base">
            Add products to favourites to see them here
          </Text>
        </View>
      ) : (
        <ProductList 
          barcodes={favorites} 
          onProductPress={handleProductPress}
          contentInsetTop={headerHeight}
        />
      )}

      {/* Product Detail Sheet */}
      <ProductDetailSheet
        product={selectedProduct || null}
        onClose={handleBottomSheetClose}
      />
    </View>
  );
}
