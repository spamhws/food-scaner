import React, { forwardRef, useState, useImperativeHandle, useEffect, useCallback } from 'react';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  PanResponder,
  Alert,
  BackHandler,
  Share,
  Platform,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  IconHeart,
  IconShare2,
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
  getNutriscoreColor,
  getNutriscoreDescription,
  getNutriscoreBadgeVariant,
} from '@/lib/utils/product-narrative';
import { Badge } from '@/components/ui/Badge';
import { SectionLabel } from './SectionLabel';
import { InfoCard } from './InfoCard';
import { InfoRow } from './InfoRow';
import { useFavorites } from '@/hooks/useFavorites';

interface ProductDetailSheetProps {
  product: Product | null;
  onClose: () => void;
}

export interface ProductDetailSheetRef {
  expand: () => void;
  close: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.9;

export const ProductDetailSheet = forwardRef<ProductDetailSheetRef, ProductDetailSheetProps>(
  ({ product, onClose }, ref) => {
    const insets = useSafeAreaInsets();
    const { isFavorite: checkIsFavorite, toggle: toggleFavorite } = useFavorites();
    const [visible, setVisible] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const translateY = React.useRef(new Animated.Value(SHEET_HEIGHT)).current;
    const opacity = React.useRef(new Animated.Value(0)).current;

    const isFavorite = product ? checkIsFavorite(product.barcode) : false;

    useImperativeHandle(ref, () => ({
      expand: () => {
        setVisible(true);
        Animated.parallel([
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      },
      close: () => {
        Animated.parallel([
          Animated.spring(translateY, {
            toValue: SHEET_HEIGHT,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setVisible(false);
          onClose();
        });
      },
    }));

    // Handle Android back button
    useEffect(() => {
      const backAction = () => {
        if (visible) {
          // Close drawer if it's open
          Animated.parallel([
            Animated.spring(translateY, {
              toValue: SHEET_HEIGHT,
              useNativeDriver: true,
              tension: 65,
              friction: 11,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setVisible(false);
            onClose();
          });
          return true; // Prevent default back behavior
        }
        return false; // Allow default back behavior
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => backHandler.remove();
    }, [visible, translateY, opacity, onClose]);

    const handlePanResponder = React.useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dy > 0) {
            translateY.setValue(gestureState.dy);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy > 100 || gestureState.vy > 0.5) {
            // Close if dragged down enough
            Animated.spring(translateY, {
              toValue: SHEET_HEIGHT,
              useNativeDriver: true,
              tension: 65,
              friction: 11,
            }).start(() => {
              setVisible(false);
              onClose();
            });
          } else {
            // Snap back
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
              tension: 65,
              friction: 11,
            }).start();
          }
        },
      })
    ).current;

    const handleFavoriteToggle = async () => {
      if (product) {
        await toggleFavorite(product.barcode);
      }
    };

    const handleShare = useCallback(async () => {
      if (!product || isSharing) {
        console.log('No product to share or already sharing');
        return;
      }

      setIsSharing(true);

      try {
        // Build share message with product details and macros
        const productTitle = product.brand ? `${product.name} - ${product.brand}` : product.name;

        const quantity = product.product_quantity
          ? `${product.product_quantity}${product.product_quantity_unit || ''}`
          : '';

        const macros = `
📊 Nutritional Information (per 100g):
🔥 Calories: ${product.nutrition.calories?.per_100g || 'N/A'} kcal
🥚 Protein: ${product.nutrition.protein?.per_100g || 'N/A'}g
💧 Fat: ${product.nutrition.fat?.per_100g || 'N/A'}g
🌾 Carbs: ${product.nutrition.carbohydrates?.per_100g || 'N/A'}g`;

        const nutriScore = product.assessment?.category
          ? `\n\n🏆 Nutri-Score: ${product.assessment.category}`
          : '';

        // Include image URL in message on iOS, or as separate on Android
        const imageUrl = product.image ? `\n\n📷 Product Image:\n${product.image}` : '';

        const appLink = '\n\n📱 Get FoodScanner:\nhttps://apps.apple.com/foodscanner (coming soon)';

        const message = `${productTitle}${
          quantity ? ` (${quantity})` : ''
        }${macros}${nutriScore}${imageUrl}${appLink}`;

        const shareOptions: any = {
          message: Platform.OS === 'android' ? message : message,
          title: productTitle,
        };

        // On iOS, url property works differently - it replaces message in some apps
        // Better to include image URL in the message text for consistency
        if (Platform.OS === 'android' && product.image) {
          shareOptions.url = product.image;
        }

        const result = await Share.share(shareOptions);

        if (result.action === Share.sharedAction) {
          console.log('Content shared successfully');
        } else if (result.action === Share.dismissedAction) {
          console.log('Share dismissed');
        }
      } catch (error: any) {
        console.error('Error sharing:', error);
        Alert.alert('Share Error', 'Unable to share product. Please try again.');
      } finally {
        setIsSharing(false);
      }
    }, [product, isSharing]);

    const handleNutriscorePress = () => {
      if (!product || !product.assessment) return;

      const narrative = generateProductNarrative(product);
      const gradeDescription = getNutriscoreDescription(product.assessment.category);

      Alert.alert(`Nutri-Score ${product.assessment.category} - ${gradeDescription}`, narrative, [
        { text: 'Got it', style: 'default' },
      ]);
    };

    if (!product || !visible) return null;

    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          // @ts-ignore - ref methods
          ref?.current?.close();
        }}
      >
        <View className="flex-1">
          {/* Backdrop */}
          <TouchableOpacity
            className="absolute inset-0"
            activeOpacity={1}
            onPress={() => {
              // @ts-ignore
              ref?.current?.close();
            }}
          >
            <Animated.View className="absolute inset-0 bg-black/50" style={{ opacity }} />
          </TouchableOpacity>

          {/* Sheet */}
          <Animated.View
            className="absolute bottom-0 left-0 right-0 bg-gray-10 rounded-t-3xl shadow-lg"
            style={{
              height: SHEET_HEIGHT,
              transform: [{ translateY }],
            }}
          >
            {/* Handle - swipe down to close */}
            <View className="py-3 px-5 items-center" {...handlePanResponder.panHandlers}>
              <View className="w-10 h-1 bg-gray-40 rounded-full" />
            </View>

            <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
              {/* Product Image and Title */}
              <InfoCard className="flex-col gap-4">
                {/* Image with grey background */}
                <View className="bg-gray-20 rounded-lg items-center -m-2 mb-0">
                  {product.image && (
                    <Image
                      source={{ uri: product.image }}
                      className="w-full h-60"
                      resizeMode="contain"
                    />
                  )}
                </View>

                {/* Title with Nutriscore Badge */}
                <View className="items-center mb-2 gap-3">
                  <Text className="text-2xl font-bold text-center text-gray-90">
                    {product.name || 'Unknown Product'}
                    {product.brand && ` (${product.brand})`}
                  </Text>

                  {/* Nutriscore Badge - only show if assessment exists */}
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

              {/* Nutrition Facts Card */}
              {product.nutrition && (
                <>
                  <SectionLabel>Nutritional value per 100g</SectionLabel>
                  <InfoCard>
                    {product.nutrition.calories && (
                      <InfoRow
                        icon={<IconFlame size={24} strokeWidth={1.5} color="#8E99AB" />}
                        label="Calories"
                        value={`${Math.round(product.nutrition.calories.value)} kcal`}
                        isLast={false}
                      />
                    )}

                    {product.nutrition.protein && (
                      <InfoRow
                        icon={<IconMeat size={24} strokeWidth={1.5} color="#8E99AB" />}
                        label="Protein"
                        value={`${product.nutrition.protein.value.toFixed(1)} g`}
                        isLast={false}
                      />
                    )}

                    {product.nutrition.fat && (
                      <InfoRow
                        icon={<IconDroplet size={24} strokeWidth={1.5} color="#8E99AB" />}
                        label="Fat"
                        value={`${product.nutrition.fat.value.toFixed(1)} g`}
                        isLast={false}
                      />
                    )}

                    {product.nutrition.carbohydrates && (
                      <InfoRow
                        icon={<IconWheat size={24} strokeWidth={1.5} color="#8E99AB" />}
                        label="Carbohydrates"
                        value={`${product.nutrition.carbohydrates.value.toFixed(1)} g`}
                        isLast={true}
                      />
                    )}
                  </InfoCard>
                </>
              )}

              {/* Assessment - Positive/Negative attributes */}
              {(() => {
                const assessments = generateAssessments(product);
                if (assessments.length === 0) return null;

                return (
                  <>
                    <SectionLabel>Key characteristics</SectionLabel>
                    <InfoCard>
                      {assessments.map((assessment, index) => (
                        <InfoRow
                          key={index}
                          icon={
                            assessment.type === 'positive' ? (
                              <IconThumbUp size={20} strokeWidth={1.5} color="#038537" />
                            ) : (
                              <IconThumbDown size={20} strokeWidth={1.5} color="#DE1B1B" />
                            )
                          }
                          label={assessment.label}
                          isLast={index === assessments.length - 1}
                        />
                      ))}
                    </InfoCard>
                  </>
                );
              })()}

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
                    <Text className="text-base text-black leading-6">
                      {product.ingredients.join(', ')}
                    </Text>
                  </InfoCard>
                </>
              )}

              {/* Bottom spacing for fixed buttons */}
              <View style={{ height: 100 + Math.max(insets.bottom, 16) }} />
            </ScrollView>

            {/* Fixed Bottom Navigation */}
            <View
              className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-30"
              style={{ paddingBottom: Math.max(insets.bottom, 16) }}
            >
              <View className="flex-row px-4 py-3 gap-2">
                <TouchableOpacity
                  onPress={handleFavoriteToggle}
                  className="flex-1 bg-gray-20 rounded-xl py-4 items-center justify-center"
                  activeOpacity={0.7}
                >
                  <IconHeart
                    size={32}
                    strokeWidth={1.5}
                    color={isFavorite ? '#DE1B1B' : '#000000'}
                    fill={isFavorite ? '#DE1B1B' : 'none'}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleShare}
                  className={`flex-1 bg-gray-20 rounded-xl py-4 items-center justify-center ${
                    isSharing ? 'opacity-50' : ''
                  }`}
                  activeOpacity={0.7}
                  disabled={isSharing}
                >
                  <IconShare2 size={32} strokeWidth={1.5} color="#000000" />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  }
);

ProductDetailSheet.displayName = 'ProductDetailSheet';
