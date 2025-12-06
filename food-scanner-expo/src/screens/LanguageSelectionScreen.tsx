import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useHeaderHeight } from '@/hooks/useHeaderHeight';
import { useNavigationBack } from '@/hooks/useNavigationBack';
import { useTranslation } from '@/hooks/useTranslation';
import { getAvailableLanguages } from '@/constants/languages';
import { IconCheck } from '@tabler/icons-react-native';
import { getColor } from '@/lib/utils/colors';

interface LanguageItemProps {
  name: string;
  isSelected: boolean;
  onPress: () => void;
}

function LanguageItem({ name, isSelected, onPress }: LanguageItemProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center bg-white rounded-xl shadow-card px-4 py-5 mb-3"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-1">
        <Text className="text-base font-medium text-black">{name}</Text>
      </View>
      {isSelected && (
        <IconCheck size={20} stroke={getColor('blue.60')} strokeWidth={2} />
      )}
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
            name={lang.name}
            isSelected={lang.code === currentLanguage}
            onPress={() => handleLanguageSelect(lang.code)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

