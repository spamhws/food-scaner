import React, { useState, useEffect } from 'react';
import { View, BackHandler, Platform, Text, Alert } from 'react-native';
import { ProductList } from '@/components/ProductList';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@/navigation/navigation-types';
import { useHistory } from '@/hooks/useHistory';
import { ProductDetailSheet } from '@/components/ProductDetailSheet/ProductDetailSheet';
import { useProduct } from '@/hooks/useProduct';
import { getCachedProduct } from '@/lib/storage/storage';
import { Images } from '@/constants/assets';
import { CTAScreen } from '@/components/CTAScreen';
import { HeaderButton } from '@/navigation/AppNavigator';
import { useHeaderHeight } from '@/hooks/useHeaderHeight';

export function HistoryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { history, isLoading, clear, removeItem } = useHistory();
  const [selectedBarcode, setSelectedBarcode] = useState<string | null>(null);
  const [validHistory, setValidHistory] = useState<string[]>([]);
  const headerHeight = useHeaderHeight();

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

  const handleGoToScanner = () => {
    navigation.navigate('Scanner');
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to clear all items from your history?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await clear();
          },
        },
      ]
    );
  };

  // Set header right button for Clear All
  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        validHistory.length > 0 ? (
          <HeaderButton onPress={handleClearAll}>Clear All</HeaderButton>
        ) : null,
    });
  }, [navigation, validHistory.length]);

  const isEmpty = validHistory.length === 0;

  return (
    <View className={`flex-1 ${isEmpty ? 'bg-white' : 'bg-gray-10'}`}>
      {/* Product List */}
      {isEmpty ? (
        <CTAScreen
          image={Images.emptyBasket}
          title={
            <Text className="text-title-large font-bold text-center">
              An empty basket {'tells\u00a0no\u00a0stories'}
            </Text>
          }
          description="Start building yours - one scan at a time!"
          buttonText="Scan your first product"
          onButtonPress={handleGoToScanner}
        />
      ) : (
        <ProductList
          barcodes={validHistory}
          onProductPress={handleProductPress}
          onProductDelete={removeItem}
          contentInsetTop={headerHeight}
        />
      )}

      {/* Product Detail Sheet */}
      <ProductDetailSheet product={selectedProduct || null} onClose={handleBottomSheetClose} />
    </View>
  );
}
