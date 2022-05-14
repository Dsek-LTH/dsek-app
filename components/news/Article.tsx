import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { getSignature } from '~/helpers/authorFunctions';
import { ArticleQuery } from '../../generated/graphql';
import { Markdown, Text } from '../Themed';
import truncateMarkdown from 'markdown-truncate';
import theme from '~/theme';
import { Link } from '@react-navigation/native';
import DateTime from '~/helpers/datetime';
type Article = ArticleQuery['article'];

export type ArticleProps = { article: Article; showFull?: boolean };

const Article: React.FC<ArticleProps> = ({ article, showFull }) => {
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
              Read More
            </Text>
          </Link>
        )}
        <View style={styles.bottom}>
          <Text style={styles.author}>{getSignature(article.author)}</Text>
          <Text style={styles.timestamp}>
            {DateTime.formatReadableDateTime(new Date(article.publishedDatetime))}
          </Text>
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
