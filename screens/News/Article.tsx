import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import Article from '~/components/news/Article';
import SingleArticle from '~/components/news/SingleArticle';
import { FlatList, Text, View } from '~/components/Themed';
import { useArticleQuery } from '~/generated/graphql';
import useColorScheme from '~/hooks/useColorScheme';
import theme from '~/theme';
import { NewsStackParamList } from '~/types/navigation';
export type ArticleScreenParams = { id: string };

const ArticleScreen: React.FC<NativeStackScreenProps<NewsStackParamList, 'Article'>> = ({
  route,
  navigation,
}) => {
  const colorScheme = useColorScheme();
  const { id } = route.params;

  return (
    <View style={{ flex: 1, backgroundColor: theme[colorScheme].colors.background }}>
      <SingleArticle id={id} />
    </View>
  );
};

export default ArticleScreen;
