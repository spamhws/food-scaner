import React from 'react';
import { Pressable, Platform, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { ScannerScreen } from '@/screens/ScannerScreen';
import { HistoryScreen } from '@/screens/HistoryScreen';
import { FavouritesScreen } from '@/screens/FavouritesScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { FAQScreen } from '@/screens/FAQScreen';
import { FAQDetailScreen } from '@/screens/FAQDetailScreen';
import { UserAgreementScreen } from '@/screens/UserAgreementScreen';
import { PrivacyPolicyScreen } from '@/screens/PrivacyPolicyScreen';
import { LanguageSelectionScreen } from '@/screens/LanguageSelectionScreen';
import { isLiquidGlassAvailable } from 'expo-glass-effect';

// Header tint color - matches native header button styling
const HEADER_TINT_COLOR = '#007AFF';
const isIOS = Platform.OS === 'ios';

// Reusable header button component using native header styling
export function HeaderButton({
  onPress,
  children,
}: {
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <Text
          style={{
            color: isLiquidGlassAvailable() ? '#000000' : HEADER_TINT_COLOR,
            fontWeight: isIOS ? '500' : '600',
            fontFamily: 'Inter',
            fontSize: isIOS ? 16 : 18,
            padding: isLiquidGlassAvailable() ? 8 : 0,
            opacity: pressed ? 0.5 : 1,
          }}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
}

export type RootStackParamList = {
  Scanner: undefined;
  History: undefined;
  Favourites: undefined;
  Info: undefined;
  FAQ: undefined;
  FAQDetail: { id: string };
  UserAgreement: undefined;
  PrivacyPolicy: undefined;
  LanguageSelection: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: { color: '#000000' },
        headerTransparent: isLiquidGlassAvailable(), // Transparent only on iOS with Liquid Glass
        headerBackTitle: isIOS ? '' : undefined, // Hide back title only on iOS
        headerStyle: isLiquidGlassAvailable()
          ? { backgroundColor: 'transparent' }
          : { backgroundColor: '#FFFFFF' }, // transparent background with Liquid Glass
        headerTintColor: HEADER_TINT_COLOR,
        contentStyle: {
          backgroundColor: '#F5F7FA',
        },
      }}
    >
      <Stack.Screen
        name="Scanner"
        component={ScannerScreen}
        options={{
          headerShown: false, // Scanner has custom UI
          title: '', // Empty title so back button doesn't show "Scanner"
          headerBackTitle: '', // Hide back button title when navigating from this screen
        }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: t('navigation.history'),
        }}
      />
      <Stack.Screen
        name="Favourites"
        component={FavouritesScreen}
        options={{
          title: t('navigation.favourites'),
        }}
      />
      <Stack.Screen
        name="Info"
        component={SettingsScreen}
        options={{
          title: t('navigation.info'),
        }}
      />
      <Stack.Screen
        name="FAQ"
        component={FAQScreen}
        options={{
          title: t('navigation.faq'),
        }}
      />
      <Stack.Screen
        name="FAQDetail"
        component={FAQDetailScreen}
        options={({ route }) => {
          const i18nInstance = require('@/lib/i18n').default;
          const language = i18nInstance?.language || 'en';
          let faqData;
          try {
            faqData = require(`@/translations/${language}/faq.json`);
          } catch {
            faqData = require('@/translations/en/faq.json');
          }
          const item = faqData.find((i: any) => i.id === route.params?.id);
          return {
            title: item?.title || item?.question || t('navigation.faq'),
            headerBackButtonMenuEnabled: false,
          };
        }}
      />
      <Stack.Screen
        name="UserAgreement"
        component={UserAgreementScreen}
        options={{
          title: t('navigation.userAgreement'),
        }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{
          title: t('navigation.privacyPolicy'),
        }}
      />
      <Stack.Screen
        name="LanguageSelection"
        component={LanguageSelectionScreen}
        options={{
          title: t('settings.language'),
        }}
      />
    </Stack.Navigator>
  );
}
