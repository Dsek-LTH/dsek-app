import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from './components/Themed';
import useColorScheme from './hooks/useColorScheme';
import ArticleScreen from './screens/News/Article';
import NewsScreen from './screens/News/News';
import theme from './theme';
import { RootStackParamList } from './types/navigation';
import { useKeycloak } from 'expo-keycloak-auth';

type Props = {};

const Screens = (props: Props) => {
  const colorScheme = useColorScheme();
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const keycloak = useKeycloak();

  const screenOptions: NativeStackNavigationOptions = useMemo(
    () => ({
      headerStyle: {
        backgroundColor: theme[colorScheme].colors.primary,
      },
      headerTitleStyle: {
        color: theme[colorScheme].colors.text,
      },
      headerRight: () =>
        keycloak.ready ? (
          keycloak.isLoggedIn ? (
            <TouchableOpacity onPress={() => keycloak.logout()}>
              <Text>Log out</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => keycloak.login()}>
              <Text>Log in</Text>
            </TouchableOpacity>
          )
        ) : undefined,
    }),
    [colorScheme, keycloak.isLoggedIn, keycloak.ready]
  );
  return (
    <>
      <Stack.Navigator initialRouteName="News" screenOptions={screenOptions}>
        <Stack.Screen name="News" component={NewsScreen} />
        <Stack.Screen name="Article" component={ArticleScreen} />
      </Stack.Navigator>
      <StatusBar />
    </>
  );
};

export default Screens;
