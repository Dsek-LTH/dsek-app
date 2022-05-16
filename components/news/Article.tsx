import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Title } from 'react-native-paper';
import { getSignature } from '~/helpers/authorFunctions';
import { ArticleQuery } from '../../generated/graphql';
import { Markdown, Text } from '../Themed';
import truncateMarkdown from 'markdown-truncate';
import theme from '~/theme';
import { Link, NavigationProp, useNavigation } from '@react-navigation/native';
import DateTime from '~/helpers/datetime';
import { RootStackParamList } from '~/types/navigation';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
type Article = ArticleQuery['article'];

export type ArticleProps = { article: Article; showFull?: boolean };

const Article: React.FC<ArticleProps> = ({ article, showFull }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const apiAccess = useApiAccess();
  const markdown = showFull
    ? article.body
    : truncateMarkdown(article.body, {
        limit: article.imageUrl ? 370 : 560,
        ellipsis: true,
      });
  const isTruncated = !showFull && markdown.length < article.body.length;
  return (
    <Card style={styles.container}>
      {/* <Card.Title title={article.header} /> */}
      <Card.Content>
        <Title style={styles.title}>{article.header}</Title>
        <Markdown style={styles.body}>{markdown}</Markdown>
        {isTruncated && (
          <Link to={{ screen: 'Article', params: { id: article.id } }}>
            <Text
              darkColor={theme.dark.colors.primary}
              lightColor={theme.light.colors.primary}
              style={{ fontSize: 20 }}>
              Läs mer
            </Text>
          </Link>
        )}
        <View style={styles.bottom}>
          <View style={{ justifyContent: 'space-between', flexDirection: 'row', maxWidth: '100%' }}>
            <View style={{ flexShrink: 1 }}>
              <Text style={styles.author}>{getSignature(article.author)}</Text>
              <Text style={styles.timestamp}>
                {DateTime.formatReadableDateTime(new Date(article.publishedDatetime))}
              </Text>
            </View>

            {hasAccess(apiAccess, 'news:article:update') && (
              <Button
                onPress={() => navigation.navigate('EditArticle', { id: article.id })}
                style={{}}>
                Redigera
              </Button>
            )}
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  body: {},
  bottom: {
    marginTop: 16,
  },
  author: {},
  timestamp: {},
});

export default Article;
