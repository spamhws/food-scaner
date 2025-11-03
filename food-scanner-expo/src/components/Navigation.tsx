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
      className="flex-row justify-around items-center w-full bg-white/10 rounded-full px-6"
      style={{ height: navigationHeight }}
    >
      <TouchableOpacity
        className="flex-1 items-center justify-center"
        activeOpacity={0.7}
        onPress={() => navigate('History')}
      >
        <IconHistory size={24} stroke="#FFFFFF" />
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-1 items-center justify-center"
        activeOpacity={0.7}
        onPress={() => navigate('Favourites')}
      >
        <IconHeart size={24} stroke="#FFFFFF" />
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-1 items-center justify-center"
        activeOpacity={0.7}
        onPress={() => navigate('Settings')}
      >
        <IconSettings size={24} stroke="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

