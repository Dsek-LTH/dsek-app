import React from 'react';
import Article from '~/components/news/Article';
import { FlatList, Text } from '~/components/Themed';
import { useArticleQuery } from '~/generated/graphql';
import { StyleSheet } from 'react-native';
import ArticleSkeleton from './ArticleSkeleton';

const SingleArticle = ({ id }) => {
  const { loading, /* error, */ data, refetch } = useArticleQuery({ variables: { id } });

  const article = data?.article;
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
      <FlatList data={['loading']} renderItem={() => <Text>loading</Text>} style={styles.list} />
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
