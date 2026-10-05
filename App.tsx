import * as NavigationBar from 'expo-navigation-bar';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Platform, useColorScheme, StatusBar as RNStatusBar, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import MainView from '~/components/MainView';
import { COLORS } from '~/globals';

const isAndroid16 = Platform.OS === 'android' && Platform.Version >= 36;

const AndroidEdgeToEdgeSpacer = ({ children }: { children: React.ReactNode }) => {
  const insets = useSafeAreaInsets();
  if (!isAndroid16) return <>{children}</>;
  return <View style={{ flex: 1, paddingBottom: insets.bottom }}>{children}</View>;
};

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
      <AndroidEdgeToEdgeSpacer>
        <MainView colorScheme={colorScheme} onColorChange={setColorScheme} />
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </AndroidEdgeToEdgeSpacer>
    </SafeAreaProvider>
  );
};

export default App;
