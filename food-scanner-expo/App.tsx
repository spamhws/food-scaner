import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryProvider } from './src/providers/query-provider';
import { NavigationProvider, useNavigation } from './src/navigation/SimpleNavigator';
import { ScannerScreen } from './src/screens/ScannerScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { FavouritesScreen } from './src/screens/FavouritesScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import './global.css';

function AppContent() {
  const { currentScreen } = useNavigation();

  return (
    <>
      {currentScreen === 'Scanner' && <ScannerScreen />}
      {currentScreen === 'History' && <HistoryScreen />}
      {currentScreen === 'Favourites' && <FavouritesScreen />}
      {currentScreen === 'Settings' && <SettingsScreen />}
      <StatusBar style={currentScreen === 'Scanner' ? 'light' : 'dark'} />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryProvider>
        <NavigationProvider>
          <AppContent />
        </NavigationProvider>
      </QueryProvider>
    </SafeAreaProvider>
  );
}
