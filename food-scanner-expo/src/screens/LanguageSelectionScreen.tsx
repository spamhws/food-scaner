import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useHeaderHeight } from '@/hooks/useHeaderHeight';
import { useNavigationBack } from '@/hooks/useNavigationBack';
import { useTranslation } from '@/hooks/useTranslation';
import { getAvailableLanguages } from '@/constants/languages';
import { IconChevronRight } from '@tabler/icons-react-native';

interface LanguageItemProps {
  flag: string;
  name: string;
  isSelected: boolean;
  onPress: () => void;
}

function LanguageItem({ flag, name, isSelected, onPress }: LanguageItemProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center bg-white rounded-xl shadow-card px-4 py-4 mb-4"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="mr-3">
        <Text className="text-2xl">{flag}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-base font-medium text-black">{name}</Text>
      </View>
      {isSelected && (
        <View className="mr-2">
          <View className="w-2 h-2 bg-green-500 rounded-full" />
        </View>
      )}
      <IconChevronRight size={20} stroke="#8E99AB" />
    </TouchableOpacity>
  );
}

export function LanguageSelectionScreen() {
  const { t, currentLanguage, changeLanguage } = useTranslation();
  const navigation = useNavigation();
  useNavigationBack();
  const headerHeight = useHeaderHeight();

  const languages = getAvailableLanguages();

  const handleLanguageSelect = (langCode: string) => {
    if (langCode !== currentLanguage) {
      changeLanguage(langCode);
    }
    navigation.goBack();
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
        {languages.map((lang) => (
          <LanguageItem
            key={lang.code}
            flag={lang.flag}
            name={lang.name}
            isSelected={lang.code === currentLanguage}
            onPress={() => handleLanguageSelect(lang.code)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

