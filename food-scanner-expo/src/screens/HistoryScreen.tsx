import React, { useState, useRef, useEffect } from 'react';
import { View, ActivityIndicator, BackHandler } from 'react-native';
import { ProductList } from '@/components/ProductList';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@/navigation/navigation-types';
import { useHistory } from '@/hooks/useHistory';
import {
  ProductDetailSheet,
  type ProductDetailSheetRef,
} from '@/components/ProductDetailSheet/ProductDetailSheet';
import { useProduct } from '@/hooks/useProduct';

export function HistoryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { history, isLoading } = useHistory();
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
      ) : (
        <ProductList barcodes={history} onProductPress={handleProductPress} />
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
