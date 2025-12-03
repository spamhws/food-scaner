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
import { useTranslation } from '@/hooks/useTranslation';

export function FavouritesScreen() {
  const { t } = useTranslation();
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
      t('favourites.clearAllFavourites'),
      t('favourites.clearAllFavouritesMessage'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.clearAll'),
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
          <HeaderButton onPress={handleClearAll}>{t('common.clearAll')}</HeaderButton>
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
          title={t('favourites.brokenHeart')}
          description={t('favourites.brokenHeartDescription')}
          buttonText={t('favourites.findFavourites')}
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
