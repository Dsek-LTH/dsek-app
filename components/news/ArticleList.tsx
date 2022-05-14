import * as React from 'react';
import { useEffect, useRef } from 'react';
import { StyleSheet, AppState } from 'react-native';
import { FlatList, Text } from '../../components/Themed';
import { useNewsPageQuery } from '../../generated/graphql';
import Article from './Article';

const ArticleList = () => {
  const [amountToLoad, setAmountToLoad] = React.useState(10);
  const [loadedPages, setLoadedPages] = React.useState(1);
  const { loading, data, refetch } = useNewsPageQuery({
    variables: { page_number: 0, per_page: amountToLoad },
  });
  const appState = useRef(AppState.currentState);
  const articles = data?.news?.articles;

  useEffect(() => {
    const subscriptions = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        refetch();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

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
      onRefresh={() => refetch()}
      onEndReached={() => {
        if (data.news.pageInfo.totalPages > loadedPages) {
          setAmountToLoad((current) => current + 10);
          setLoadedPages((current) => current + 1);
        }
      }}
      onEndReachedThreshold={0.5}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
  },
});

export default ArticleList;
