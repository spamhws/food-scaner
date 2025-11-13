import React, { useEffect } from 'react';
import { View, Text, ScrollView, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@/navigation/navigation-types';
import faqData from '@/data/faq.json';

export function FAQScreen() {
  const navigation = useNavigation<NavigationProp>();

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
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {faqData.map((item, index) => (
          <View key={item.id} className="mb-6">
            <Text className="text-lg font-semibold text-gray-90 mb-3">
              {index + 1}. {item.question}
            </Text>
            <Text className="text-base leading-6 text-gray-70">{item.answer}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
