import React, { useEffect } from 'react';
import { View, Text, ScrollView, BackHandler, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@/navigation/navigation-types';
import agreementData from '@/data/userAgreement.json';

export function UserAgreementScreen() {
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
          paddingTop: headerHeight + 20,
          paddingHorizontal: 20,
          paddingBottom: 40,
        }}
      >
        <Text className="text-sm text-gray-60 mb-6 italic">
          Last updated: {agreementData.lastUpdated}
        </Text>

        {agreementData.sections.map((section) => (
          <View key={section.id} className="mb-6">
            <Text className="text-lg font-semibold mb-3">
              {section.id}. {section.title}
            </Text>
            <Text className="leading-6 text-gray-90">{section.content}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
