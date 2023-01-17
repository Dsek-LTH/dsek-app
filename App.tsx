import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainView from '~/components/MainView';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import { ApiAccessProvider } from './providers/ApiAccessProvider';
import LoginProvider from './providers/LoginProvider';
import NotificationProvider from './providers/NotificationProvider';
import { UserProvider } from './providers/UserProvider';
import theme from './theme';
import * as SplashScreen from 'expo-splash-screen';

const App = () => {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <PaperProvider theme={theme[colorScheme]}>
        <LoginProvider>
          <UserProvider>
            <ApiAccessProvider>
              <NavigationContainer>
                <NotificationProvider>
                  <SafeAreaProvider >
                    <MainView />
                  </SafeAreaProvider>
                </NotificationProvider>
              </NavigationContainer>
            </ApiAccessProvider>
          </UserProvider>
        </LoginProvider>
      </PaperProvider>
    );
  }
};

export default App;
