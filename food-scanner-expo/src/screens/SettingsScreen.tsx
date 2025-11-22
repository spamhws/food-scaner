import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, BackHandler, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  IconHelpHexagon,
  IconFileText,
  IconShieldLock,
  IconDeviceMobile,
  IconChevronRight,
} from '@tabler/icons-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@/navigation/navigation-types';

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
}

function SettingItem({
  icon,
  title,
  subtitle,
  value,
  onPress,
  showChevron = true,
}: SettingItemProps) {
  const content = (
    <>
      <View className="mr-4">{icon}</View>
      <View className="flex-1">
        <Text className="text-base font-medium ">{title}</Text>
        {subtitle && <Text className="text-sm text-gray-60 mt-0.5">{subtitle}</Text>}
      </View>
      {value && <Text className="text-caption font-medium ">{value}</Text>}
      {showChevron && <IconChevronRight size={20} stroke="#8E99AB" />}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        className="flex-row items-center bg-white rounded-xl shadow-card px-4 py-4 mb-3"
        onPress={onPress}
        activeOpacity={0.7}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View className="flex-row items-center bg-white rounded-xl shadow-card px-4 py-4 mb-3">
      {content}
    </View>
  );
}

export function SettingsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  // Header height (44px) + status bar - only needed on iOS with transparent header
  const headerHeight = Platform.OS === 'ios' ? 44 + insets.top : 0;

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <View className="flex-1 bg-gray-10">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: headerHeight + 24,
          paddingHorizontal: 16,
          paddingBottom: 24,
        }}
      >
        {/* Information Section */}
        <SettingItem
          icon={<IconHelpHexagon size={24} stroke="#8E99AB" />}
          title="FAQ"
          onPress={() => navigation.navigate('FAQ')}
        />
        <SettingItem
          icon={<IconFileText size={24} stroke="#8E99AB" />}
          title="User Agreement"
          onPress={() => navigation.navigate('UserAgreement')}
        />
        <SettingItem
          icon={<IconShieldLock size={24} stroke="#8E99AB" />}
          title="Privacy Policy"
          onPress={() => navigation.navigate('PrivacyPolicy')}
        />

        <SettingItem
          icon={<IconDeviceMobile size={24} stroke="#8E99AB" />}
          title="App Version"
          value="1.0"
          showChevron={false}
        />
      </ScrollView>
    </View>
  );
}
