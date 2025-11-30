import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { IconChevronRight } from '@tabler/icons-react-native';
import { ScannerScreen } from '@/screens/ScannerScreen';
import { HistoryScreen } from '@/screens/HistoryScreen';
import { FavouritesScreen } from '@/screens/FavouritesScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { FAQScreen } from '@/screens/FAQScreen';
import { FAQDetailScreen } from '@/screens/FAQDetailScreen';
import { UserAgreementScreen } from '@/screens/UserAgreementScreen';
import { PrivacyPolicyScreen } from '@/screens/PrivacyPolicyScreen';

// Custom back button with just chevron (no text)
function CustomBackButton() {
  const navigation = useNavigation();

  if (!navigation.canGoBack()) {
    return null;
  }

  return (
    <TouchableOpacity onPress={() => navigation.goBack()} className="ml-2" activeOpacity={0.7}>
      <IconChevronRight
        size={32}
        stroke="#000000"
        style={{ transform: [{ rotate: '180deg' }], marginLeft: -6 }}
      />
    </TouchableOpacity>
  );
}

export type RootStackParamList = {
  Scanner: { barcode?: string } | undefined;
  History: { barcode?: string } | undefined;
  Favourites: { barcode?: string } | undefined;
  Info: undefined;
  FAQ: undefined;
  FAQDetail: { id: string; barcode?: string } | undefined;
  UserAgreement: undefined;
  PrivacyPolicy: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const isIOS = Platform.OS === 'ios';

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerTransparent: isIOS, // Transparent only on iOS
        headerBackTitle: isIOS ? '' : undefined, // Hide back title only on iOS
        headerLeft: isIOS ? () => <CustomBackButton /> : undefined, // Custom button only on iOS
        headerStyle: isIOS ? undefined : { backgroundColor: '#FFFFFF' }, // White background on Android
        headerTintColor: isIOS ? undefined : '#007AFF', // Blue tint on Android
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
          title: 'History',
        }}
      />
      <Stack.Screen
        name="Favourites"
        component={FavouritesScreen}
        options={{
          title: 'Favourites',
        }}
      />
      <Stack.Screen
        name="Info"
        component={SettingsScreen}
        options={{
          title: 'Info',
        }}
      />
      <Stack.Screen
        name="FAQ"
        component={FAQScreen}
        options={{
          title: 'FAQ',
        }}
      />
      <Stack.Screen
        name="FAQDetail"
        component={FAQDetailScreen}
        options={({ route }) => {
          const faqData = require('@/data/faq.json');
          const item = faqData.find((i: any) => i.id === route.params?.id);
          return {
            title: item?.title || item?.question || 'FAQ',
          };
        }}
      />
      <Stack.Screen
        name="UserAgreement"
        component={UserAgreementScreen}
        options={{
          title: 'User Agreement',
        }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{
          title: 'Privacy Policy',
        }}
      />
    </Stack.Navigator>
  );
}
