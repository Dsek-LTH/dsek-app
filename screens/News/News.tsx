import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Title } from 'react-native-paper';

import { Text, ScrollView, Markdown } from '../../components/Themed';
import mockNews from './mockData';

type NewsEntry = typeof mockNews[number];

const NewsScreen = () => {
  const news: NewsEntry[] = mockNews;

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Nyheter</Title>
      {news.map((newsEntry) => (
        <Card style={styles.newsEntry} key={newsEntry.id}>
          {/* <Card.Title title={newsEntry.header} /> */}
          <Card.Content>
            <Title style={styles.entryTitle}>{newsEntry.header}</Title>
            <Markdown style={styles.entryDescription}>{newsEntry.body}</Markdown>
            <View style={styles.entryBottom}>
              <Text style={styles.author}>
                {newsEntry.author.first_name || newsEntry.author.member?.first_name}
                {newsEntry.author.nickname && ` "${newsEntry.author.nickname}"`}
                {newsEntry.author.member?.nickname &&
                  ` "${newsEntry.author.member?.nickname}"`}{' '}
                {newsEntry.author.last_name || newsEntry.author.member?.last_name}
                {newsEntry.author.position && ` , ${newsEntry.author.position?.name}`}
              </Text>
              <Text style={styles.timestamp}>{newsEntry.publishedDatetime}</Text>
            </View>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 64,
  },
  title: {
    fontSize: 32,
    marginVertical: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  newsEntry: {
    marginVertical: 8,
    marginHorizontal: 8,
  },
  entryTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  entryDescription: {},
  entryBottom: {
    marginTop: 16,
  },
  author: {},
  timestamp: {},
});

export default NewsScreen;
