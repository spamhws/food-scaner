import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { IconHeart, IconShare2 } from '@tabler/icons-react-native';
import { BottomSheetFooter } from '@gorhom/bottom-sheet';

interface ProductDetailFooterProps {
  isFavorite: boolean;
  isSharing: boolean;
  onFavoriteToggle: () => void;
  onShare: () => void;
  props: any;
}

export function ProductDetailFooter({
  isFavorite,
  isSharing,
  onFavoriteToggle,
  onShare,
  props,
}: ProductDetailFooterProps) {
  return (
    <BottomSheetFooter {...props} bottomInset={0}>
      <View className="bg-white border-t border-gray-30 pb-6">
        <View className="flex-row px-4 py-3 gap-2">
          <TouchableOpacity
            onPress={onFavoriteToggle}
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
            onPress={onShare}
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
    </BottomSheetFooter>
  );
}
