import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Image, Alert, BackHandler, Text, Dimensions } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {
  IconFlame,
  IconMeat,
  IconDroplet,
  IconWheat,
  IconAlertTriangle,
  IconThumbUp,
  IconThumbDown,
} from '@tabler/icons-react-native';
import type { Product } from '@/types/product';
import { generateAssessments } from '@/lib/utils/product-assessment';
import {
  generateProductNarrative,
  getNutriscoreDescription,
  getNutriscoreBadgeVariant,
} from '@/lib/utils/product-narrative';
import { shareProduct } from '@/lib/utils/share';
import { Badge } from '@/components/ui/Badge';
import { SectionLabel } from './SectionLabel';
import { InfoCard } from './InfoCard';
import { InfoRow } from './InfoRow';
import { NutritionRow } from './NutritionRow';
import { ProductDetailFooter } from './ProductDetailFooter';
import { useFavorites } from '@/hooks/useFavorites';

interface ProductDetailSheetProps {
  product: Product | null;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function ProductDetailSheet({ product, onClose }: ProductDetailSheetProps) {
  const { isFavorite: checkIsFavorite, toggle: toggleFavorite } = useFavorites();
  const [isSharing, setIsSharing] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => [SCREEN_HEIGHT - 150], []);
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
    if (!product?.assessment) return;
    const narrative = generateProductNarrative(product);
    const gradeDescription = getNutriscoreDescription(product.assessment.category);
    Alert.alert(`Nutri-Score ${product.assessment.category} - ${gradeDescription}`, narrative, [
      { text: 'Got it', style: 'default' },
    ]);
  };

  const assessments = product ? generateAssessments(product) : [];

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableContentPanningGesture={false}
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
            {/* Product Image and Title */}
            <InfoCard className="flex-col gap-4">
              <View
                className="rounded-xl items-center justify-center -m-2 mb-0 overflow-hidden"
                style={{ height: 240 }}
              >
                {product.image ? (
                  <>
                    <Image
                      source={{ uri: product.image }}
                      className="absolute h-full w-full"
                      blurRadius={16}
                    />
                    <Image
                      source={{ uri: product.image }}
                      className="h-full w-full"
                      resizeMode="contain"
                    />
                  </>
                ) : (
                  <View className="bg-gray-20 w-full h-full" />
                )}
              </View>
              <View className="items-center mb-2 gap-3">
                <Text className="text-2xl font-bold text-center text-black">
                  {product.name || 'Unknown Product'}
                  {product.brand && ` (${product.brand})`}
                </Text>
                {product.assessment && (
                  <Badge
                    variant={getNutriscoreBadgeVariant(product.assessment.category)}
                    label={getNutriscoreDescription(product.assessment.category)}
                    interactive
                    onPress={handleNutriscorePress}
                  />
                )}
              </View>
            </InfoCard>

            {/* Nutrition Facts */}
            {product.nutrition &&
              (() => {
                // Check if package size info is available
                const hasPackageInfo = !!product.product_quantity;

                // Calculate package weight in grams
                const packageWeight = hasPackageInfo
                  ? parseFloat(product.product_quantity) *
                    (product.product_quantity_unit === 'kg' ? 1000 : 1)
                  : null;

                // Helper to calculate per package value
                const getPerPackage = (per100g: number): number | null => {
                  if (packageWeight === null) return null;
                  return (per100g / 100) * packageWeight;
                };

                return (
                  <>
                    <View className="flex-row items-center justify-between mt-2">
                      <SectionLabel>Nutritional value</SectionLabel>
                      <Text className="text-CAPS font-medium text-gray-60 uppercase tracking-wide">
                        {hasPackageInfo ? 'PER 100G / PER PACKAGE' : 'PER 100G'}
                      </Text>
                    </View>
                    <InfoCard>
                      {product.nutrition.calories && (
                        <NutritionRow
                          icon={<IconFlame size={24} strokeWidth={1.5} color="#707A8A" />}
                          label="Calories, kcal"
                          per100g={product.nutrition.calories.per_100g}
                          perPackage={getPerPackage(product.nutrition.calories.per_100g)}
                          unit=""
                          isLast={false}
                          showPackageColumn={hasPackageInfo}
                        />
                      )}
                      {product.nutrition.protein && (
                        <NutritionRow
                          icon={<IconMeat size={24} strokeWidth={1.5} color="#707A8A" />}
                          label="Protein, g"
                          per100g={product.nutrition.protein.per_100g}
                          perPackage={getPerPackage(product.nutrition.protein.per_100g)}
                          unit="g"
                          isLast={false}
                          showPackageColumn={hasPackageInfo}
                        />
                      )}
                      {product.nutrition.fat && (
                        <NutritionRow
                          icon={<IconDroplet size={24} strokeWidth={1.5} color="#707A8A" />}
                          label="Fats, g"
                          per100g={product.nutrition.fat.per_100g}
                          perPackage={getPerPackage(product.nutrition.fat.per_100g)}
                          unit="g"
                          isLast={false}
                          showPackageColumn={hasPackageInfo}
                        />
                      )}
                      {product.nutrition.carbohydrates && (
                        <NutritionRow
                          icon={<IconWheat size={24} strokeWidth={1.5} color="#707A8A" />}
                          label="Carbs, g"
                          per100g={product.nutrition.carbohydrates.per_100g}
                          perPackage={getPerPackage(product.nutrition.carbohydrates.per_100g)}
                          unit="g"
                          isLast={true}
                          showPackageColumn={hasPackageInfo}
                        />
                      )}
                    </InfoCard>
                  </>
                );
              })()}

            {/* Key Characteristics */}
            {assessments.length > 0 && (
              <>
                <SectionLabel>Key characteristics</SectionLabel>
                <InfoCard>
                  {assessments.map((assessment, index) => (
                    <InfoRow
                      key={index}
                      icon={
                        assessment.type === 'positive' ? (
                          <IconThumbUp size={20} color="#038537" />
                        ) : (
                          <IconThumbDown size={20} color="#DE1B1B" />
                        )
                      }
                      label={assessment.label}
                      isLast={index === assessments.length - 1}
                    />
                  ))}
                </InfoCard>
              </>
            )}

            {/* Allergens */}
            {product.allergens && product.allergens.length > 0 && (
              <>
                <SectionLabel>Allergens</SectionLabel>
                <InfoCard>
                  {product.allergens.map((allergen: string, index: number) => (
                    <InfoRow
                      key={index}
                      icon={<IconAlertTriangle size={20} strokeWidth={1.5} color="#AD5F00" />}
                      label={allergen.charAt(0).toUpperCase() + allergen.slice(1)}
                      isLast={index === product.allergens.length - 1}
                    />
                  ))}
                </InfoCard>
              </>
            )}

            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <>
                <SectionLabel>Ingredients</SectionLabel>
                <InfoCard>
                  <Text className="font-medium leading-6">{product.ingredients.join(', ')}</Text>
                </InfoCard>
              </>
            )}
          </>
        )}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
