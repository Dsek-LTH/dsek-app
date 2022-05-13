import React from 'react';
import { Card, Title } from 'react-native-paper';
import { getSignature } from '~/helpers/authorFunctions';
import { StyleSheet, View } from 'react-native';
import { ArticleQuery, NewsPageQuery, useNewsPageQuery } from '../../generated/graphql';
import { Markdown, Text } from '../Themed';
type Article = ArticleQuery['article'];

const Article: React.FC<{ article: Article }> = ({ article }) => {
  return (
    <Card style={styles.container} key={article.id}>
      {/* <Card.Title title={article.header} /> */}
      <Card.Content>
        <Title style={styles.title}>{article.header}</Title>
        <Markdown style={styles.body}>{article.body}</Markdown>
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
    fontSize: 32,
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
