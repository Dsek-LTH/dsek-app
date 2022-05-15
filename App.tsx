import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import { ApiAccessProvider } from './providers/ApiAccessProvider';
import LoginProvider from './providers/LoginProvider';
import NotificationProvider from './providers/NotificationProvider';
import { UserProvider } from './providers/UserProvider';
import Screens from './Screens';
import theme from './theme';

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
                  <SafeAreaProvider>
                    <Screens />
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
