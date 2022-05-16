import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { Text, View } from './components/Themed';
import useColorScheme from './hooks/useColorScheme';
import ArticleScreen from './screens/News/Article';
import NewsScreen from './screens/News/News';
import theme from './theme';
import { RootStackParamList } from './types/navigation';
import { useKeycloak } from 'expo-keycloak-auth';
import CreateArticleScreen from './screens/News/CreateArticle';
import EditArticleScreen from './screens/News/EditArticle';

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
              <Text>Logga ut</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => keycloak.login()}>
              <Text>Logga in</Text>
            </TouchableOpacity>
          )
        ) : undefined,
    }),
    [colorScheme, keycloak.isLoggedIn, keycloak.ready]
  );
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator initialRouteName="News" screenOptions={screenOptions}>
        <Stack.Screen name="News" component={NewsScreen} options={{ title: 'Nyheter' }} />
        <Stack.Screen name="Article" component={ArticleScreen} options={{ title: 'Artikel' }} />
        <Stack.Screen
          name="CreateArticle"
          component={CreateArticleScreen}
          options={{ title: 'Skapa Artikel' }}
        />
        <Stack.Screen
          name="EditArticle"
          component={EditArticleScreen}
          options={{ title: 'Redigera Artikel' }}
        />
      </Stack.Navigator>
      <StatusBar />
    </View>
  );
};

export default Screens;
