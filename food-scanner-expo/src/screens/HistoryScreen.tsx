import React, { useState, useRef, useEffect } from 'react';
import { View, ActivityIndicator, BackHandler, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProductList } from '@/components/ProductList';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@/navigation/navigation-types';
import { useHistory } from '@/hooks/useHistory';
import {
  ProductDetailSheet,
  type ProductDetailSheetRef,
} from '@/components/ProductDetailSheet/ProductDetailSheet';
import { useProduct } from '@/hooks/useProduct';
import { getCachedProduct } from '@/lib/storage/storage';

export function HistoryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { history, isLoading } = useHistory();
  const [selectedBarcode, setSelectedBarcode] = useState<string | null>(null);
  const bottomSheetRef = useRef<ProductDetailSheetRef>(null);
  const [validHistory, setValidHistory] = useState<string[]>([]);
  
  // Header height (44px) + status bar - only needed on iOS with transparent header
  const headerHeight = Platform.OS === 'ios' ? 44 + insets.top : 0;

  // Filter history to only include products that exist (not errors)
  useEffect(() => {
    const filterHistory = async () => {
      const validBarcodes: string[] = [];
      for (const barcode of history) {
        const cachedProduct = await getCachedProduct(barcode);
        if (cachedProduct !== null) {
          // Only include if product exists (not an error)
          validBarcodes.push(barcode);
        }
      }
      setValidHistory(validBarcodes);
    };

    if (!isLoading) {
      filterHistory();
    }
  }, [history, isLoading]);

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
        <View className="flex-1 justify-center items-center" style={{ paddingTop: headerHeight }}>
          <ActivityIndicator size="large" color="#3272D9" />
        </View>
      ) : (
        <ProductList 
          barcodes={validHistory} 
          onProductPress={handleProductPress}
          contentInsetTop={headerHeight}
        />
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
