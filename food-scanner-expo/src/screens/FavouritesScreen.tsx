import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, BackHandler, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProductList } from '@/components/ProductList';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NavigationProp } from '@/navigation/navigation-types';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import { ProductDetailSheet } from '@/components/ProductDetailSheet/ProductDetailSheet';
import { useProduct } from '@/hooks/useProduct';
import { useFavorites } from '@/hooks/useFavorites';
import { Images } from '@/constants/assets';
import { CTAScreen } from '@/components/CTAScreen';

type FavouritesRouteProp = RouteProp<RootStackParamList, 'Favourites'>;

export function FavouritesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<FavouritesRouteProp>();
  const insets = useSafeAreaInsets();
  const { favorites, isLoading } = useFavorites();
  const [selectedBarcode, setSelectedBarcode] = useState<string | null>(null);

  // Header height (44px) + status bar - only needed on iOS with transparent header
  const headerHeight = Platform.OS === 'ios' ? 44 + insets.top : 0;

  // Check if barcode was passed as route param (from FAQ navigation)
  useEffect(() => {
    const routeBarcode = route.params?.barcode;
    if (routeBarcode) {
      setSelectedBarcode(routeBarcode);
    }
  }, [route.params]);

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

  const isEmpty = !isLoading && favorites.length === 0;

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
      ) : favorites.length === 0 ? (
        <CTAScreen
          image={Images.brokenHeart}
          title="Broken heart"
          description="Your beloved snacks are all it needs to heal!"
          buttonText="Find your favorites"
          onButtonPress={handleGoToScanner}
        />
      ) : (
        <ProductList
          barcodes={favorites}
          onProductPress={handleProductPress}
          contentInsetTop={headerHeight}
        />
      )}

      {/* Product Detail Sheet */}
      <ProductDetailSheet product={selectedProduct || null} onClose={handleBottomSheetClose} />
    </View>
  );
}
