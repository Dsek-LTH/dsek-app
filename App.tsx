import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './hooks/useCachedResources';
import NewsScreen from './screens/News/News';
import { Provider as PaperProvider } from 'react-native-paper';
import theme from './theme';
import useColorScheme from './hooks/useColorScheme';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <PaperProvider theme={theme[colorScheme]}>
        <SafeAreaProvider>
          <NewsScreen />
          <StatusBar />
        </SafeAreaProvider>
      </PaperProvider>
    );
  }
}
