import React, { useState, useEffect } from 'react';
import { View, BackHandler, Platform, Text, Alert } from 'react-native';
import { ProductList } from '@/components/ProductList';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@/navigation/navigation-types';
import { ProductDetailSheet } from '@/components/ProductDetailSheet/ProductDetailSheet';
import { useProduct } from '@/hooks/useProduct';
import { useFavorites } from '@/hooks/useFavorites';
import { Images } from '@/constants/assets';
import { CTAScreen } from '@/components/CTAScreen';
import { HeaderButton } from '@/navigation/AppNavigator';
import { useHeaderHeight } from '@/hooks/useHeaderHeight';

export function FavouritesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { favorites, clear, removeItem } = useFavorites();
  const [selectedBarcode, setSelectedBarcode] = useState<string | null>(null);
  const headerHeight = useHeaderHeight();

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
      'Clear All Favorites',
      'Are you sure you want to clear all items from your favorites?',
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
        favorites.length > 0 ? (
          <HeaderButton onPress={handleClearAll}>Clear All</HeaderButton>
        ) : null,
    });
  }, [navigation, favorites.length]);

  const isEmpty = favorites.length === 0;

  return (
    <View className={`flex-1 ${isEmpty ? 'bg-white' : 'bg-gray-10'}`}>
      {/* Product List */}
      {isEmpty ? (
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
          onProductDelete={removeItem}
          contentInsetTop={headerHeight}
          deleteIcon="heart-off"
        />
      )}

      {/* Product Detail Sheet */}
      <ProductDetailSheet product={selectedProduct || null} onClose={handleBottomSheetClose} />
    </View>
  );
}
