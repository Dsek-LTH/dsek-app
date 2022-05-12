import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './hooks/useCachedResources';
import NewsScreen from './screens/News/News';
import { Provider as PaperProvider } from 'react-native-paper';
import theme from './theme';
import useColorScheme from './hooks/useColorScheme';
import { View } from './components/Themed';

const Stack = createNativeStackNavigator();

const App = () => {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <PaperProvider theme={theme[colorScheme]}>
        <SafeAreaProvider>
          <View>
            <Stack.Navigator initialRouteName="News">
                <Stack.Screen name="News" component={NewsScreen} />
            <Stack.Navigator>
          </View>
          <StatusBar />
        </SafeAreaProvider>
      </PaperProvider>
    );
  }
};

export default App;
