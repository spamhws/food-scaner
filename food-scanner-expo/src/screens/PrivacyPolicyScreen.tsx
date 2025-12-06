import React, { useEffect } from 'react';
import { View, Text, ScrollView, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@/navigation/navigation-types';
import { useTranslation } from '@/hooks/useTranslation';
import { useHeaderHeight } from '@/hooks/useHeaderHeight';

// Load privacy policy data based on language
const getPrivacyData = (language: string) => {
  try {
    return require(`@/translations/${language}/privacyPolicy.json`);
  } catch {
    // Fallback to English if language file doesn't exist
    return require('@/translations/en/privacyPolicy.json');
  }
};

export function PrivacyPolicyScreen() {
  const { currentLanguage } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const headerHeight = useHeaderHeight();
  const privacyData = getPrivacyData(currentLanguage);

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
          paddingTop: headerHeight + 20,
          paddingHorizontal: 20,
          paddingBottom: 40,
        }}
      >
        <Text className="text-sm text-gray-60 mb-6 italic font-inter">
          {new Intl.DateTimeFormat(
            currentLanguage === 'uk'
              ? 'uk-UA'
              : currentLanguage === 'en'
              ? 'en-US'
              : currentLanguage,
            {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }
          ).format(new Date(privacyData.lastUpdated))}
        </Text>

        {privacyData.sections.map((section) => (
          <View key={section.id} className="mb-6">
            <Text className="text-lg font-semibold mb-3">
              {section.id}. {section.title}
            </Text>
            <Text className="leading-6 text-gray-90 font-inter">{section.content}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
