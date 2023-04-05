import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import MainView from '~/components/MainView';

SplashScreen.preventAutoHideAsync();
const App = () => {
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = React.useState<'light' | 'dark'>(preferredColorScheme);

  return (
    <SafeAreaProvider>
      <MainView colorScheme={colorScheme} onColorChange={setColorScheme} />
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaProvider>
  );
};

export default App;
