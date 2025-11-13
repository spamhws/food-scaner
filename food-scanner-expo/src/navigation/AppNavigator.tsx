import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScannerScreen } from '@/screens/ScannerScreen';
import { HistoryScreen } from '@/screens/HistoryScreen';
import { FavouritesScreen } from '@/screens/FavouritesScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { FAQScreen } from '@/screens/FAQScreen';
import { UserAgreementScreen } from '@/screens/UserAgreementScreen';
import { PrivacyPolicyScreen } from '@/screens/PrivacyPolicyScreen';

export type RootStackParamList = {
  Scanner: undefined;
  History: undefined;
  Favourites: undefined;
  Settings: undefined;
  FAQ: undefined;
  UserAgreement: undefined;
  PrivacyPolicy: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#007AFF',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 17,
        },
        headerBackVisible: true,
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
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
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
