import * as NavigationBar from 'expo-navigation-bar';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Platform, useColorScheme, StatusBar as RNStatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import MainView from '~/components/MainView';
import { COLORS } from '~/globals';

SplashScreen.preventAutoHideAsync();
const App = () => {
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = React.useState<'light' | 'dark'>(preferredColorScheme);
  const colors = colorScheme === 'light' ? COLORS.light : COLORS.dark;

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(colorScheme === 'dark' ? '#121212' : '#fff');
      NavigationBar.setBorderColorAsync(colorScheme === 'dark' ? '#121212' : '#fff');
    }
  }, [colorScheme]);

  return (
    <SafeAreaProvider
      style={{
        backgroundColor: colors.headers,
        paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
      }}>
      <MainView colorScheme={colorScheme} onColorChange={setColorScheme} />
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaProvider>
  );
};

export default App;
