import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Alert, BackHandler, Dimensions, View, Text } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@/navigation/navigation-types';
import type { Product } from '@/types/product';
import { generateAssessments } from '@/lib/utils/product-assessment';
import { generateProductNarrative, getNutriscoreDescription } from '@/lib/utils/product-narrative';
import { shareProduct } from '@/lib/utils/share';
import { ProductDetailFooter } from './ProductDetailFooter';
import { useFavorites } from '@/hooks/useFavorites';
import { ImageTitleSection } from './ImageTitleSection';
import { NutrientsSection } from './NutrientsSection';
import { NutriScoresSection } from './NutriScoresSection';
import { CharacteristicsSection } from './CharacteristicsSection';
import { AllergensSection } from './AllergensSection';
import { IngredientsSection } from './IngredientsSection';
import { useTranslation } from '@/hooks/useTranslation';

interface ProductDetailSheetProps {
  product: Product | null;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function ProductDetailSheet({ product, onClose }: ProductDetailSheetProps) {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const { isFavorite: checkIsFavorite, toggle: toggleFavorite } = useFavorites();
  const [isSharing, setIsSharing] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => [SCREEN_HEIGHT - 64], []);
  const isFavorite = product ? checkIsFavorite(product.barcode) : false;

  // Ignore safe area for the sheet itself
  const topInset = 0;

  // Present modal when product is set
  useEffect(() => {
    if (product) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [product]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose]
  );

  const handleDismiss = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    const backAction = () => {
      if (product) {
        bottomSheetModalRef.current?.dismiss();
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [product]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    []
  );

  const handleFavoriteToggle = async () => {
    if (product) await toggleFavorite(product.barcode);
  };

  const handleShare = useCallback(async () => {
    if (!product || isSharing) return;
    setIsSharing(true);
    try {
      await shareProduct(product);
    } finally {
      setIsSharing(false);
    }
  }, [product, isSharing]);

  const renderFooter = useCallback(
    (props: any) => (
      <ProductDetailFooter
        isFavorite={isFavorite}
        isSharing={isSharing}
        onFavoriteToggle={handleFavoriteToggle}
        onShare={handleShare}
        props={props}
      />
    ),
    [isFavorite, isSharing, handleFavoriteToggle, handleShare]
  );

  const handleNutriscorePress = () => {
    // Only show NutriScore info if it's official from OpenFoodFacts
    if (!product?.assessment) return;
    const narrative = generateProductNarrative(product, t);
    const gradeDescription = getNutriscoreDescription(product.assessment.category, t);
    Alert.alert(
      t('alerts.nutriScoreTitle', {
        grade: product.assessment.category,
        description: gradeDescription,
      }),
      narrative,
      [{ text: t('common.gotIt'), style: 'default' }]
    );
  };

  const assessments = product ? generateAssessments(product) : [];

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableContentPanningGesture={true}
      enableHandlePanningGesture={true}
      onChange={handleSheetChanges}
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}
      footerComponent={renderFooter}
      backgroundStyle={{ backgroundColor: '#F5F7FA' }}
      handleIndicatorStyle={{ backgroundColor: '#D1D5DB' }}
      topInset={topInset}
      android_keyboardInputMode="adjustResize"
      enableDynamicSizing={false}
    >
      <BottomSheetScrollView
        className="p-4"
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {product && (
          <>
            <ImageTitleSection product={product} onNutriscorePress={handleNutriscorePress} />
            <NutrientsSection
              nutrition={product.nutrition}
              nutrientLevels={product.nutrientLevels}
              product_quantity={product.product_quantity}
              product_quantity_unit={product.product_quantity_unit}
            />
            {(() => {
              const hasNutriScores =
                product.assessment?.category || product.ecoscoreGrade || product.novascoreGrade;
              const hasCharacteristics = assessments.length > 0;
              const hasAllergens = product.allergens && product.allergens.length > 0;
              const hasIngredients = product.ingredients && product.ingredients.length > 0;
              const hasAnyAdditionalInfo =
                hasNutriScores || hasCharacteristics || hasAllergens || hasIngredients;

              if (!hasAnyAdditionalInfo) {
                return (
                  <View className="py-4">
                    <Text className="text-caption text-gray-70 text-center">
                      {t('product.noInformation')}
                    </Text>
                  </View>
                );
              }

              return (
                <>
                  <NutriScoresSection
                    nutriscoreGrade={product.assessment?.category}
                    ecoscoreGrade={product.ecoscoreGrade}
                    novascoreGrade={product.novascoreGrade}
                    navigation={navigation}
                    onClose={onClose}
                    productBarcode={product.barcode}
                  />
                  <CharacteristicsSection assessments={assessments} />
                  <AllergensSection allergens={product.allergens} />
                  <IngredientsSection ingredients={product.ingredients} />
                </>
              );
            })()}
          </>
        )}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
