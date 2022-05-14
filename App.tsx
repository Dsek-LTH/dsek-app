import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import GraphQLProvider from './providers/GraphQLProvider';
import NotificationProvider from './providers/NotificationProvider';
import ArticleScreen from './screens/News/Article';
import NewsScreen from './screens/News/News';
import theme from './theme';
import { RootStackParamList } from './types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

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
          <NotificationProvider>
            <NavigationContainer>
              <SafeAreaProvider>
                <Stack.Navigator initialRouteName="News" screenOptions={screenOptions}>
                  <Stack.Screen name="News" component={NewsScreen} />
                  <Stack.Screen name="Article" component={ArticleScreen} />
                </Stack.Navigator>
                <StatusBar />
              </SafeAreaProvider>
            </NavigationContainer>
          </NotificationProvider>
        </GraphQLProvider>
      </PaperProvider>
    );
  }
};

export default App;
