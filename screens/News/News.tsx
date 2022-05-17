import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import DsekIcon from '~/components/Icons/DsekIcon';
import ArticleList from '~/components/news/ArticleList';
import { View } from '~/components/Themed';
import { NewsStackParamList } from '~/types/navigation';

export type NewsScreenParams = undefined;

const NewsScreen: React.FC<NativeStackScreenProps<NewsStackParamList, 'News'>> = () => {
  return (
    <View style={{ flex: 1 }}>
      <ArticleList />
    </View>
  );
};

export default NewsScreen;
