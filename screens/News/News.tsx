import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { View } from 'react-native';
import ArticleList from '~/components/news/ArticleList';
import { RootStackParamList } from '~/types/navigation';

export type NewsScreenParams = undefined;

const NewsScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'News'>> = () => {
  return (
    <View style={{ flex: 1 }}>
      <ArticleList />
    </View>
  );
};

export default NewsScreen;
