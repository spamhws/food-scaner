import React, { forwardRef, useState, useImperativeHandle, ReactNode } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  PanResponder,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  IconHeart,
  IconShare2,
  IconFlame,
  IconEggFried,
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
    const [isFavorite, setIsFavorite] = useState(false);
    const [visible, setVisible] = useState(false);
    const translateY = React.useRef(new Animated.Value(SHEET_HEIGHT)).current;
    const opacity = React.useRef(new Animated.Value(0)).current;

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

    const handleFavoriteToggle = () => {
      setIsFavorite(!isFavorite);
      // TODO: Save to favorites
    };

    const handleShare = () => {
      // TODO: Implement share functionality
    };

    const handleNutriscorePress = () => {
      if (!product) return;

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
        animationType="none"
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
            <Animated.View
              className="absolute inset-0"
            />
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
                  {product.image ? (
                    <Image
                      source={{ uri: product.image }}
                      className="w-full h-60"
                      resizeMode="contain"
                    />
                  ) : (
                    <View className="w-full h-64 items-center justify-center">
                      <Text className="text-gray-60">No image</Text>
                    </View>
                  )}
                </View>

                {/* Title with Nutriscore Badge */}
                <View className="items-center mb-2">
                  <Text className="text-2xl font-bold text-center text-gray-90 mb-3">
                    {product.name || 'Unknown Product'}
                    {product.brand && ` (${product.brand})`}
                  </Text>

                  {/* Nutriscore Badge */}
                  <Badge
                    variant={getNutriscoreBadgeVariant(product.assessment.category)}
                    label={getNutriscoreDescription(product.assessment.category)}
                    interactive
                    onPress={handleNutriscorePress}
                  />
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
                        icon={<IconEggFried size={24} strokeWidth={1.5} color="#8E99AB" />}
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
                        label={allergen}
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
              <View style={{ height: 100 }} />
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
                    color={isFavorite ? '#DE1B1B' : '#000000'}
                    strokeWidth={1.5}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleShare}
                  className="flex-1 bg-gray-20 rounded-xl py-4 items-center justify-center opacity-50"
                  activeOpacity={0.7}
                  disabled
                >
                  <IconShare2 size={32} color="#8E99AB" />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  }
);

// Section Label Component
interface SectionLabelProps {
  children: string;
}

function SectionLabel({ children }: SectionLabelProps) {
  return (
    <Text className="text-caption font-semibold text-gray-60 uppercase tracking-wide mb-2 mt-4">
      {children}
    </Text>
  );
}

// Reusable Card Component
interface InfoCardProps {
  children: ReactNode;
  className?: string;
}

function InfoCard({ children, className = '' }: InfoCardProps) {
  return (
    <View className={`bg-white rounded-2xl p-4 shadow-card mb-4 ${className}`}>{children}</View>
  );
}

// Reusable Row Component
interface InfoRowProps {
  icon: ReactNode;
  label: string;
  value?: string;
  isLast?: boolean;
}

function InfoRow({ icon, label, value, isLast = false }: InfoRowProps) {
  return (
    <View className="py-2">
      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-row items-center gap-2">
          {icon}
          <Text className="text-title text-black">{label}</Text>
        </View>
        {value && <Text className="text-title font-semibold text-gray-90">{value}</Text>}
      </View>
      {!isLast && <View className="h-px bg-gray-30 mt-2 ml-8" />}
    </View>
  );
}

ProductDetailSheet.displayName = 'ProductDetailSheet';
