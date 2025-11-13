import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { IconHistory, IconHeart, IconSettings } from '@tabler/icons-react-native';
import { useNavigation } from '@/navigation/SimpleNavigator';

interface NavigationProps {
  navigationHeight?: number;
}

export function Navigation({ navigationHeight = 64 }: NavigationProps) {
  const { navigate } = useNavigation();

  return (
    <View
      className="flex-row w-full items-center justify-center gap-1 overflow-hidden rounded-2xl"
      style={{ height: navigationHeight }}
    >
      <TouchableOpacity
        className="flex-1 h-full items-center justify-center bg-white/10"
        activeOpacity={0.7}
        onPress={() => navigate('Settings')}
      >
        <IconSettings size={24} stroke="#FFFFFF" />
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-1 h-full items-center justify-center bg-white/10"
        activeOpacity={0.7}
        onPress={() => navigate('History')}
      >
        <IconHistory size={24} stroke="#FFFFFF" />
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-1 h-full items-center justify-center bg-white/10"
        activeOpacity={0.7}
        onPress={() => navigate('Favourites')}
      >
        <IconHeart size={24} stroke="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

