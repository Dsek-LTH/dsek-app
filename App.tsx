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
  const [colorScheme, setColorScheme] = React.useState<'light' | 'dark'>(
    preferredColorScheme ?? 'dark'
  );
  const colors = colorScheme === 'light' ? COLORS.light : COLORS.dark;

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(colorScheme === 'dark' ? '#252225' : '#DDDDDD');
      NavigationBar.setBorderColorAsync(colorScheme === 'dark' ? '#252225' : '#DDDDDD');
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
