import React, { useEffect } from 'react';
import Article from '~/components/news/Article';
import { FlatList, Text } from '~/components/Themed';
import { useArticleQuery } from '~/generated/graphql';
import { StyleSheet } from 'react-native';
import ArticleSkeleton from './ArticleSkeleton';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { NewsStackParamList } from '~/types/navigation';

const SingleArticle = ({ id }) => {
  const { loading, /* error, */ data, refetch } = useArticleQuery({ variables: { id } });
  const navigation = useNavigation<NavigationProp<NewsStackParamList>>();

  const article = data?.article;
  useEffect(() => {
    if (loading || !article) return;
    navigation.setOptions({ title: article.header });
  }, [article, loading]);
  if (loading) {
    return (
      <FlatList
        style={styles.list}
        renderItem={() => <ArticleSkeleton />}
        data={[1]}
        keyExtractor={(item) => item}
      />
    );
  }
  if (!article) {
    return (
      <FlatList data={['loading']} renderItem={() => <Text>Laddar</Text>} style={styles.list} />
    );
  }

  return (
    <FlatList
      data={[article]}
      renderItem={({ item }) => <Article showFull article={item} />}
      style={styles.list}
      refreshing={false}
      onRefresh={() => refetch()}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: 32,
  },
});

export default SingleArticle;
