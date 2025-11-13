import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { IconHistory, IconHeart, IconSettings } from '@tabler/icons-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@/navigation/navigation-types';

interface NavigationButtonsProps {
  navigationHeight?: number;
}

export function NavigationButtons({ navigationHeight = 64 }: NavigationButtonsProps) {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View
      className="flex-row w-full items-center justify-center gap-1 overflow-hidden rounded-2xl"
      style={{ height: navigationHeight }}
    >
      <TouchableOpacity
        className="flex-1 h-full items-center justify-center bg-white/10"
        activeOpacity={0.7}
        onPress={() => navigation.navigate('Settings')}
      >
        <IconSettings size={24} stroke="#FFFFFF" />
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-1 h-full items-center justify-center bg-white/10"
        activeOpacity={0.7}
        onPress={() => navigation.navigate('History')}
      >
        <IconHistory size={24} stroke="#FFFFFF" />
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-1 h-full items-center justify-center bg-white/10"
        activeOpacity={0.7}
        onPress={() => navigation.navigate('Favourites')}
      >
        <IconHeart size={24} stroke="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}
