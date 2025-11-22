import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { QueryProvider } from './src/providers/query-provider';
import { AppNavigator } from './src/navigation/AppNavigator';
import './global.css';

export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  // Wait for fonts to load before rendering
  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryProvider>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </QueryProvider>
    </SafeAreaProvider>
  );
}
