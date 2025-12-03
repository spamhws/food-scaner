import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Share,
  Linking,
  Alert,
} from 'react-native';
import Constants from 'expo-constants';
import { useHeaderHeight } from '@/hooks/useHeaderHeight';
import {
  IconHelpHexagon,
  IconFileText,
  IconShieldLock,
  IconDeviceMobile,
  IconChevronRight,
  IconSend,
  IconStar,
} from '@tabler/icons-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@/navigation/navigation-types';
import { useNavigationBack } from '@/hooks/useNavigationBack';
import { APP_STORE_LINKS, APP_STORE_REVIEW_LINKS } from '@/constants/app-store';

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
        <Text className="text-base font-medium text-black">{title}</Text>
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
  useNavigationBack();
  const headerHeight = useHeaderHeight();

  const handleShareApp = async () => {
    try {
      const message = `Check out Food ID - the app that helps you make informed food choices!

🍎 App Store: ${APP_STORE_LINKS.ios}
🤖 Google Play: ${APP_STORE_LINKS.android}`;

      await Share.share({
        message,
        title: 'Share Food ID',
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share the app. Please try again.');
    }
  };

  const handleRateApp = async () => {
    try {
      const reviewLink =
        Platform.OS === 'ios' ? APP_STORE_REVIEW_LINKS.ios : APP_STORE_REVIEW_LINKS.android;
      const canOpen = await Linking.canOpenURL(reviewLink);

      if (canOpen) {
        await Linking.openURL(reviewLink);
      } else {
        // Fallback to regular app store link if review link doesn't work
        const fallbackLink = Platform.OS === 'ios' ? APP_STORE_LINKS.ios : APP_STORE_LINKS.android;
        await Linking.openURL(fallbackLink);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to open the app store. Please try again.');
    }
  };

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
          icon={<IconSend size={24} stroke="#8E99AB" />}
          title="Share the App"
          onPress={handleShareApp}
        />
        <SettingItem
          icon={<IconStar size={24} stroke="#8E99AB" />}
          title="Rate the App"
          onPress={handleRateApp}
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
          value={Constants.expoConfig?.version || 'unknown'}
          showChevron={false}
        />
      </ScrollView>
    </View>
  );
}
