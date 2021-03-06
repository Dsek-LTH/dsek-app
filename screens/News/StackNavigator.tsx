import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { Text, View } from '../../components/Themed';
import useColorScheme from '../../hooks/useColorScheme';
import ArticleScreen from './Article';
import NewsScreen from './News';
import theme from '../../theme';
import { NewsStackParamList } from '../../types/navigation';
import { useKeycloak } from 'expo-keycloak-auth';
import CreateArticleScreen from './CreateArticle';
import EditArticleScreen from './EditArticle';
import DsekIcon from '~/components/Icons/DsekIcon';

type Props = {};

const Stack = createNativeStackNavigator<NewsStackParamList>();

const NewsStackNavigator: React.FC<Props> = (props) => {
  const colorScheme = useColorScheme();

  const screenOptions: NativeStackNavigationOptions = {
    headerStyle: {
      backgroundColor: theme[colorScheme].colors.primary,
    },
    headerTitleStyle: {
      color: theme[colorScheme].colors.text,
    },
  };
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator initialRouteName="News" screenOptions={screenOptions}>
        <Stack.Screen
          name="News"
          component={NewsScreen}
          options={{
            title: 'Nyheter',
            headerLeft: () => <DsekIcon fill="white" width={24} height={24} />,
          }}
        />
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

export default NewsStackNavigator;
