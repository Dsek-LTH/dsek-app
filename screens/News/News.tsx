import ArticleList from '~/components/news/ArticleList';
import * as React from 'react';
import { View } from 'react-native';
import theme from '~/theme';

const NewsScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: theme['dark'].colors.background }}>
      <ArticleList />
    </View>
  );
};

export default NewsScreen;
