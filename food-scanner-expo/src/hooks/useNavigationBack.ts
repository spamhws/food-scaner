import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NavigationProp } from '@/navigation/navigation-types';
import type { RootStackParamList } from '@/navigation/AppNavigator';

/**
 * Custom hook to handle back navigation with optional barcode parameter
 * Used for FAQ and Info screens to navigate back to previous screen with barcode
 */
export function useNavigationBack() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, keyof RootStackParamList>>();
  const barcode = (route.params as any)?.barcode;

  useEffect(() => {
    const backAction = () => {
      if (barcode) {
        // Get the previous route from navigation state
        const state = navigation.getState();
        const routes = state.routes;
        const currentIndex = state.index;

        if (currentIndex > 0) {
          const previousRoute = routes[currentIndex - 1];
          // Navigate to previous route with barcode to open the sheet
          navigation.navigate(previousRoute.name as keyof RootStackParamList, { barcode } as any);
        } else if (navigation.canGoBack()) {
          navigation.goBack();
        }
      } else if (navigation.canGoBack()) {
        navigation.goBack();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation, barcode]);

  // Override the header back button behavior
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // Prevent default behavior
      e.preventDefault();

      if (barcode) {
        // Get the previous route from navigation state
        const state = navigation.getState();
        const routes = state.routes;
        const currentIndex = state.index;

        if (currentIndex > 0) {
          const previousRoute = routes[currentIndex - 1];
          // Navigate to previous route with barcode
          navigation.navigate(previousRoute.name as keyof RootStackParamList, { barcode } as any);
        } else {
          // Default back behavior
          navigation.dispatch(e.data.action);
        }
      } else {
        // Default back behavior
        navigation.dispatch(e.data.action);
      }
    });

    return unsubscribe;
  }, [navigation, barcode]);

  return { barcode };
}

