import * as NavigationBar from 'expo-navigation-bar';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Platform, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import MainView from '~/components/MainView';

SplashScreen.preventAutoHideAsync();
const App = () => {
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = React.useState<'light' | 'dark'>(preferredColorScheme);

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(colorScheme === 'dark' ? '#121212' : '#fff');
      NavigationBar.setBorderColorAsync(colorScheme === 'dark' ? '#121212' : '#fff');
    }
  }, [colorScheme]);

  return (
    <SafeAreaProvider>
      <MainView colorScheme={colorScheme} onColorChange={setColorScheme} />
      <StatusBar style={colorScheme === 'dark' ? 'dark' : 'light'} />
    </SafeAreaProvider>
  );
};

export default App;
