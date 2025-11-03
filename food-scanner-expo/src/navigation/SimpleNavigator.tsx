import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ScreenName = 'Scanner' | 'History' | 'Favourites' | 'Settings';

interface NavigationContextType {
  currentScreen: ScreenName;
  navigate: (screen: ScreenName) => void;
  goBack: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('Scanner');
  const [history, setHistory] = useState<ScreenName[]>(['Scanner']);

  const navigate = (screen: ScreenName) => {
    setCurrentScreen(screen);
    setHistory((prev) => [...prev, screen]);
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // Remove current screen
      const previousScreen = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCurrentScreen(previousScreen);
    }
  };

  return (
    <NavigationContext.Provider value={{ currentScreen, navigate, goBack }}>
      {children}
    </NavigationContext.Provider>
  );
}

