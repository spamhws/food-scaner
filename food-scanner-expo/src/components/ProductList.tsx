import React, { useRef } from 'react';
import { View, Text, ScrollView, LayoutChangeEvent } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ProductCard } from './ProductCard';
import { IconTrash, IconHeartOff } from '@tabler/icons-react-native';

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
  renderRightActions: () => React.ReactNode;
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

  const renderRightActions = (barcode: string) => {
    if (!onProductDelete) return null;

    const IconComponent = deleteIcon === 'heart-off' ? IconHeartOff : IconTrash;

    return (
      <View className="flex-1 justify-center items-end bg-red-60 rounded-xl ml-3">
        <View className="w-20 h-full justify-center items-center">
          <IconComponent size={24} stroke="#FFFFFF" strokeWidth={1.5} />
        </View>
      </View>
    );
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
          return (
            <AnimatedSwipeableItem
              key={barcode}
              barcode={barcode}
              index={index}
              totalItems={barcodes.length}
              onDelete={onProductDelete}
              renderRightActions={() => renderRightActions(barcode)}
              
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
