import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './hooks/useCachedResources';
import NewsScreen from './screens/News/News';
import { Provider as PaperProvider } from 'react-native-paper';
import theme from './theme';
import useColorScheme from './hooks/useColorScheme';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import GraphQLProvider from './providers/GraphQLProvider';

const Stack = createNativeStackNavigator();

const App = () => {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const screenOptions: NativeStackNavigationOptions = {
    headerStyle: {
      backgroundColor: theme[colorScheme].colors.primary,
    },
    headerTitleStyle: {
      color: theme[colorScheme].colors.text,
    },
  };

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <PaperProvider theme={theme[colorScheme]}>
        <GraphQLProvider>
          <NavigationContainer>
            <SafeAreaProvider>
              <Stack.Navigator initialRouteName="News" screenOptions={screenOptions}>
                <Stack.Screen name="News" component={NewsScreen} />
              </Stack.Navigator>
              <StatusBar />
            </SafeAreaProvider>
          </NavigationContainer>
        </GraphQLProvider>
      </PaperProvider>
    );
  }
};

export default App;
