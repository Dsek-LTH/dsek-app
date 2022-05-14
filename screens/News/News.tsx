import ArticleList from '~/components/news/ArticleList';
import * as React from 'react';
import { View } from 'react-native';
import theme from '~/theme';
import useColorScheme from '~/hooks/useColorScheme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/types/navigation';

export type NewsScreenParams = undefined;

const NewsScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'News'>> = () => {
  const colorScheme = useColorScheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme[colorScheme].colors.background }}>
      <ArticleList />
    </View>
  );
};

export default NewsScreen;
