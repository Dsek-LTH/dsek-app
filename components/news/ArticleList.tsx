import * as React from 'react';
import { StyleSheet } from 'react-native';
import { FlatList, Text } from '../../components/Themed';
import { useNewsPageQuery } from '../../generated/graphql';
import Article from './Article';

const ArticleList = () => {
  const { loading, data, fetchMore, refetch } = useNewsPageQuery({
    variables: { page_number: 0, per_page: 10 },
  });
  const articles = data?.news?.articles;
  console.log(data);

  if (loading) {
    return <Text>loading</Text>;
  }

  return (
    <FlatList
      style={styles.container}
      renderItem={({ item }) => <Article article={item} />}
      data={articles}
      keyExtractor={(article) => article.id}
      refreshing={false}
      onRefresh={refetch}
      onEndReached={() => fetchMore({ variables: { page_number: articles.length } })}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
  },
});

export default ArticleList;
