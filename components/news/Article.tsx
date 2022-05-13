import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { getSignature } from '~/helpers/authorFunctions';
import { ArticleQuery } from '../../generated/graphql';
import { Markdown, Text } from '../Themed';
import truncateMarkdown from 'markdown-truncate';
import theme from '~/theme';
import { Link } from '@react-navigation/native';
type Article = ArticleQuery['article'];

const Article: React.FC<{ article: Article }> = ({ article }) => {
  const markdown = truncateMarkdown(article.body, {
    limit: article.imageUrl ? 370 : 560,
    ellipsis: true,
  });
  const isTruncated = markdown.length < article.body.length;
  return (
    <Card style={styles.container} key={article.id}>
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
            {(article.publishedDatetime as string).substring(0, 9)}
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
