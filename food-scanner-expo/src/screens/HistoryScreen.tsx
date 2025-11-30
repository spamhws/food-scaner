import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, BackHandler, Platform, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProductList } from '@/components/ProductList';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NavigationProp } from '@/navigation/navigation-types';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import { useHistory } from '@/hooks/useHistory';
import { ProductDetailSheet } from '@/components/ProductDetailSheet/ProductDetailSheet';
import { useProduct } from '@/hooks/useProduct';
import { getCachedProduct } from '@/lib/storage/storage';
import { Images } from '@/constants/assets';
import { CTAScreen } from '@/components/CTAScreen';

type HistoryRouteProp = RouteProp<RootStackParamList, 'History'>;

export function HistoryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<HistoryRouteProp>();
  const insets = useSafeAreaInsets();
  const { history, isLoading } = useHistory();
  const [selectedBarcode, setSelectedBarcode] = useState<string | null>(null);
  const [validHistory, setValidHistory] = useState<string[]>([]);

  // Header height (44px) + status bar - only needed on iOS with transparent header
  const headerHeight = Platform.OS === 'ios' ? 44 + insets.top : 0;

  // Check if barcode was passed as route param (from FAQ navigation)
  useEffect(() => {
    const routeBarcode = route.params?.barcode;
    if (routeBarcode) {
      setSelectedBarcode(routeBarcode);
    }
  }, [route.params]);

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

  const isEmpty = !isLoading && validHistory.length === 0;

  return (
    <View className={`flex-1 ${isEmpty ? 'bg-white' : 'bg-gray-10'}`}>
      {/* Product List */}
      {isLoading ? (
        <View
          className="flex-1 justify-center items-center bg-gray-10"
          style={{ paddingTop: headerHeight }}
        >
          <ActivityIndicator size="large" color="#3272D9" />
        </View>
      ) : validHistory.length === 0 ? (
        <CTAScreen
          image={Images.emptyBasket}
          title="An empty basket tells no stories"
          description="Start building yours — one scan at a time!"
          buttonText="Scan your first product"
          onButtonPress={handleGoToScanner}
        />
      ) : (
        <ProductList
          barcodes={validHistory}
          onProductPress={handleProductPress}
          contentInsetTop={headerHeight}
        />
      )}

      {/* Product Detail Sheet */}
      <ProductDetailSheet product={selectedProduct || null} onClose={handleBottomSheetClose} />
    </View>
  );
}
