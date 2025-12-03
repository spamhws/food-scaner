import React, { useEffect } from 'react';
import { View, Text, ScrollView, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@/navigation/navigation-types';
import { useTranslation } from '@/hooks/useTranslation';
import { useHeaderHeight } from '@/hooks/useHeaderHeight';

// Load agreement data based on language
const getAgreementData = (language: 'en' | 'uk') => {
  if (language === 'uk') {
    return require('@/data/userAgreement.uk.json');
  }
  return require('@/data/userAgreement.json');
};

export function UserAgreementScreen() {
  const { currentLanguage } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const headerHeight = useHeaderHeight();
  const agreementData = getAgreementData(currentLanguage);

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
          {currentLanguage === 'uk' ? 'Останнє оновлення: ' : 'Last updated: '}
          {new Intl.DateTimeFormat(currentLanguage === 'uk' ? 'uk-UA' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }).format(new Date(agreementData.lastUpdated))}
        </Text>

        {agreementData.sections.map((section) => (
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
