import * as React from 'react';
import { useEffect, useRef } from 'react';
import { StyleSheet, AppState } from 'react-native';
import { FlatList, Text } from '../../components/Themed';
import { useNewsPageQuery } from '../../generated/graphql';
import Article from './Article';
import ArticleSkeleton from './ArticleSkeleton';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { Button } from 'react-native-paper';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { NewsStackParamList } from '~/types/navigation';
import { Ionicons } from '@expo/vector-icons';

const ArticleList = () => {
  const [amountToLoad, setAmountToLoad] = React.useState(10);
  const [loadedPages, setLoadedPages] = React.useState(1);
  const { loading, data, refetch } = useNewsPageQuery({
    variables: { page_number: 0, per_page: amountToLoad },
  });

  const appState = useRef(AppState.currentState);
  const apiContext = useApiAccess();
  const navigation = useNavigation<NavigationProp<NewsStackParamList>>();

  const articles = data?.news?.articles;

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
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
    return (
      <FlatList
        style={styles.container}
        renderItem={() => <ArticleSkeleton />}
        data={[1, 2, 3]}
        keyExtractor={(item) => item}
      />
    );
  }

  return (
    <FlatList
      style={styles.container}
      renderItem={({ item }) => <Article article={item} />}
      data={articles}
      keyExtractor={(article) => article.id}
      refreshing={false}
      onRefresh={() => refetch()}
      ListHeaderComponent={
        hasAccess(apiContext, 'news:article:create') ? (
          <Button
            mode="contained"
            onPress={() => navigation.navigate('CreateArticle')}
            dark
            style={styles.createButton}
            contentStyle={styles.createButtonContent}
            icon="plus-box"
            labelStyle={{ fontSize: 24 }}>
            <Text style={{ fontSize: 16 }}>Skapa inlägg</Text>
          </Button>
        ) : undefined
      }
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
  createButton: {
    marginBottom: 16,
    marginHorizontal: 8,
    padding: 0,
  },
  createButtonContent: {
    paddingVertical: 8,
  },
});

export default ArticleList;
