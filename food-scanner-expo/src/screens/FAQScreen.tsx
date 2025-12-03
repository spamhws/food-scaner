import React from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IconChevronRight } from '@tabler/icons-react-native';
import type { NavigationProp } from '@/navigation/navigation-types';
import { useTranslation } from '@/hooks/useTranslation';
import { useNavigationBack } from '@/hooks/useNavigationBack';
import { useHeaderHeight } from '@/hooks/useHeaderHeight';

// Load FAQ data based on language
const getFAQData = (language: 'en' | 'uk') => {
  if (language === 'uk') {
    return require('@/data/faq.uk.json');
  }
  return require('@/data/faq.json');
};

interface FAQItem {
  id: string;
  type: 'score' | 'question';
  question: string;
  title?: string;
}

export function FAQScreen() {
  const { currentLanguage } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  useNavigationBack();
  const headerHeight = useHeaderHeight();
  const faqData = getFAQData(currentLanguage);

  const handleQuestionPress = (id: string) => {
    navigation.navigate('FAQDetail', { id });
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
        {(faqData as FAQItem[]).map((item) => (
          <TouchableOpacity
            key={item.id}
            className="flex-row items-center bg-white rounded-xl shadow-card px-4 py-4 mb-3"
            onPress={() => handleQuestionPress(item.id)}
            activeOpacity={0.7}
          >
            <View className="flex-1">
              <Text className="text-base font-medium text-black">{item.question}</Text>
            </View>
            <IconChevronRight size={20} stroke="#8E99AB" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
