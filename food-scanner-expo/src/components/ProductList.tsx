import React, { useRef } from 'react';
import {
  View,
  ScrollView,
  LayoutChangeEvent,
  Dimensions,
  Animated as RNAnimated,
  TouchableOpacity,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ProductCard } from './ProductCard';
import { IconTrash, IconHeartOff } from '@tabler/icons-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DELETE_BUTTON_MIN_SIZE = 32;
const DELETE_BUTTON_MAX_SIZE = 64;

interface ProductListProps {
  barcodes: string[];
  onProductPress?: (barcode: string) => void;
  onProductDelete?: (barcode: string) => void;
  contentInsetTop?: number;
  deleteIcon?: 'trash' | 'heart-off';
}

// Animated wrapper for swipeable items with smooth deletion
function AnimatedSwipeableItem({
  barcode,
  index,
  totalItems,
  children,
  onDelete,
  renderRightActions,
}: {
  barcode: string;
  index: number;
  totalItems: number;
  children: React.ReactNode;
  onDelete: (barcode: string) => void;
  renderRightActions: (progress: RNAnimated.AnimatedInterpolation<number>) => React.ReactNode;
}) {
  const swipeableRef = useRef<Swipeable>(null);
  const CARD_MIN_HEIGHT = 120;
  const CARD_GAP = 12; // mb-3 = 12px
  const itemHeight = useSharedValue<number>(CARD_MIN_HEIGHT);
  const marginBottom = useSharedValue<number>(index < totalItems - 1 ? CARD_GAP : 0);
  const opacity = useSharedValue<number>(1);

  const handleLayout = (event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height;
    if (height > 0 && itemHeight.value === CARD_MIN_HEIGHT) {
      // Update to actual measured height if still at default
      itemHeight.value = height;
    }
  };

  const handleDelete = () => {
    // Animate out
    itemHeight.value = withTiming(0);
    marginBottom.value = withTiming(0);
    opacity.value = withTiming(0, undefined, (isFinished) => {
      if (isFinished) {
        runOnJS(onDelete)(barcode);
      }
    });
  };

  const containerStyle = useAnimatedStyle(() => ({
    height: itemHeight.value,
    marginBottom: marginBottom.value,
    opacity: opacity.value,
    overflow: 'visible',
  }));

  return (
    <Animated.View style={containerStyle} onLayout={handleLayout}>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        onSwipeableOpen={handleDelete}
        overshootRight={false}
        containerStyle={{
          overflow: 'visible',
        }}
      >
        {children}
      </Swipeable>
    </Animated.View>
  );
}

export function ProductList({
  barcodes,
  onProductPress,
  onProductDelete,
  contentInsetTop = 0,
  deleteIcon = 'trash',
}: ProductListProps) {
  if (barcodes.length === 0) {
    return null;
  }

  const renderRightActions = (barcode: string, onDeletePress: () => void) => {
    const IconComponent = deleteIcon === 'heart-off' ? IconHeartOff : IconTrash;

    return (progress: RNAnimated.AnimatedInterpolation<number>) => {
      if (!onProductDelete) return null;

      // Interpolate opacity: fade in as we swipe
      const opacity = progress.interpolate({
        inputRange: [0.1, 0.35],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      });

      // Interpolate button scale: 32px to 64px as we swipe
      const buttonScale = progress.interpolate({
        inputRange: [0.1, 0.35],
        outputRange: [DELETE_BUTTON_MIN_SIZE / DELETE_BUTTON_MAX_SIZE, 1],
        extrapolate: 'clamp',
      });

      return (
        <View
          className="justify-center items-end ml-3"
          style={{
            width: SCREEN_WIDTH,
            paddingRight: 8,
          }}
        >
          <RNAnimated.View
            style={{
              opacity,
              transform: [{ scale: buttonScale }],
            }}
          >
            <TouchableOpacity
              onPress={onDeletePress}
              activeOpacity={0.7}
              style={{
                width: DELETE_BUTTON_MAX_SIZE,
                height: DELETE_BUTTON_MAX_SIZE,
                borderRadius: DELETE_BUTTON_MAX_SIZE / 2,
                backgroundColor: '#EF4444',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <IconComponent size={24} stroke="#FFFFFF" strokeWidth={1.5} />
            </TouchableOpacity>
          </RNAnimated.View>
        </View>
      );
    };
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        paddingTop: contentInsetTop + 16,
        paddingHorizontal: 16,
        paddingBottom: 16,
      }}
      showsVerticalScrollIndicator={false}
    >
      {barcodes.map((barcode, index) => {
        const card = (
          <ProductCard
            barcode={barcode}
            onPress={onProductPress ? () => onProductPress(barcode) : undefined}
          />
        );

        if (onProductDelete) {
          const handleDelete = () => {
            onProductDelete(barcode);
          };

          return (
            <AnimatedSwipeableItem
              key={barcode}
              barcode={barcode}
              index={index}
              totalItems={barcodes.length}
              onDelete={onProductDelete}
              renderRightActions={renderRightActions(barcode, handleDelete)}
            >
              {card}
            </AnimatedSwipeableItem>
          );
        }

        return (
          <View key={barcode} style={{ marginBottom: index < barcodes.length - 1 ? 12 : 0 }}>
            {card}
          </View>
        );
      })}
    </ScrollView>
  );
}
