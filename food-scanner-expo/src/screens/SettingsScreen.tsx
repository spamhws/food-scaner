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
import { Picker } from '@react-native-picker/picker';
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
  IconMessageChatbot,
  IconLanguage,
} from '@tabler/icons-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@/navigation/navigation-types';
import { useNavigationBack } from '@/hooks/useNavigationBack';
import { APP_STORE_LINKS, APP_STORE_REVIEW_LINKS } from '@/constants/app-store';
import contactInfo from '@/constants/contact.json';
import { useTranslation } from '@/hooks/useTranslation';

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
      <View className="mr-3">{icon}</View>
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
        className="flex-row items-center bg-white rounded-xl shadow-card px-4 py-4 mb-4"
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
  const { t, currentLanguage, changeLanguage } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  useNavigationBack();
  const headerHeight = useHeaderHeight();

  const languages = [
    { code: 'en' as const, name: 'English', flag: '🇺🇸' },
    { code: 'uk' as const, name: 'Українська', flag: '🇺🇦' },
  ];

  const handleLanguageChange = (langCode: string) => {
    if (langCode === 'en' || langCode === 'uk') {
      changeLanguage(langCode);
    }
  };

  const currentLanguageData = languages.find((lang) => lang.code === currentLanguage);

  const handleShareApp = async () => {
    try {
      const message = t('settings.shareMessage', {
        iosLink: APP_STORE_LINKS.ios,
        androidLink: APP_STORE_LINKS.android,
      });

      await Share.share({
        message,
        title: t('settings.shareFoodId'),
      });
    } catch (error) {
      Alert.alert(t('common.error'), t('settings.unableToShare'));
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
      Alert.alert(t('common.error'), t('settings.unableToOpenStore'));
    }
  };

  const handleContactDevelopers = async () => {
    try {
      const subject = t('settings.contactSubject');
      const mailtoUrl = `mailto:${contactInfo.email}?subject=${encodeURIComponent(subject)}`;

      // Try to open mailto: URL
      const canOpen = await Linking.canOpenURL(mailtoUrl);
      if (canOpen) {
        try {
          await Linking.openURL(mailtoUrl);
          return; // Successfully opened
        } catch (openError) {
          // If opening fails (e.g., Expo Go iOS limitation), fall back to Share
        }
      }

      // Fallback: Use Share API (works in Expo Go)
      // This allows users to share the email via any app (Mail, Messages, etc.)
      const emailMessage = t('settings.contactMessage', {
        email: contactInfo.email,
        subject,
      });
      await Share.share({
        message: emailMessage,
        title: t('settings.contactFoodId'),
      });
    } catch (error) {
      // Final fallback: show email in alert
      Alert.alert(
        t('settings.contactDevelopers'),
        t('settings.contactFallback', { email: contactInfo.email }),
        [{ text: t('common.ok') }]
      );
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
          title={t('settings.faq')}
          onPress={() => navigation.navigate('FAQ')}
        />
        <SettingItem
          icon={<IconSend size={24} stroke="#8E99AB" />}
          title={t('settings.shareTheApp')}
          onPress={handleShareApp}
        />
        <SettingItem
          icon={<IconStar size={24} stroke="#8E99AB" />}
          title={t('settings.rateTheApp')}
          onPress={handleRateApp}
        />
        <SettingItem
          icon={<IconMessageChatbot size={24} stroke="#8E99AB" />}
          title={t('settings.contactDevelopers')}
          onPress={handleContactDevelopers}
        />
        <SettingItem
          icon={<IconFileText size={24} stroke="#8E99AB" />}
          title={t('settings.userAgreement')}
          onPress={() => navigation.navigate('UserAgreement')}
        />

        <SettingItem
          icon={<IconDeviceMobile size={24} stroke="#8E99AB" />}
          title={t('settings.appVersion')}
          value={Constants.expoConfig?.version || t('common.unknown')}
          showChevron={false}
        />

        {/* Language Picker - Full Card Style */}
        <View className="flex-row items-center bg-white rounded-xl shadow-card px-4 py-1 mb-3">
          <View className="mr-3">
            <IconLanguage size={24} stroke="#8E99AB" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-medium text-black">{t('settings.language')}</Text>
          </View>
          <View className="flex-row items-center flex-1 justify-end">
            <Picker
              selectedValue={currentLanguage}
              onValueChange={handleLanguageChange}
              style={{
                flex: 1,
                minWidth: 140,
                height: Platform.OS === 'ios' ? 100 : 50,
              }}
              dropdownIconColor="#8E99AB"
              mode={Platform.OS === 'android' ? 'dropdown' : 'dialog'}
            >
              {languages.map((lang) => (
                <Picker.Item
                  key={lang.code}
                  label={`${lang.flag}  ${lang.name}`}
                  value={lang.code}
                />
              ))}
            </Picker>
          </View>
        </View>

        <SettingItem
          icon={<IconShieldLock size={24} stroke="#8E99AB" />}
          title={t('settings.privacyPolicy')}
          onPress={() => navigation.navigate('PrivacyPolicy')}
        />
      </ScrollView>
    </View>
  );
}
