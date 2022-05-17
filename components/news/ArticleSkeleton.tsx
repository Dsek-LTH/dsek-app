import { Link } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { getSignature } from '~/helpers/authorFunctions';
import DateTime from '~/helpers/datetime';
import theme from '~/theme';
import { Markdown, Text } from '../Themed';
import Skeleton, { SKELETON_DELAY_STEP } from '../ui/Skeleton';
// import SkeletonContent from 'react-native-skeleton-content';

const DELAY_STEP = SKELETON_DELAY_STEP / 2;

const ArticleSkeleton: React.FC = () => {
  const dimensions = useWindowDimensions();
  const width = dimensions.width - 48;
  return (
    <Card style={styles.container}>
      <Card.Content style={styles.list}>
        <Skeleton width={width} height={50} />
        <Skeleton width={width * 0.95} height={20} delay={DELAY_STEP} />
        <Skeleton width={width * 0.9} height={20} delay={2 * DELAY_STEP} />
        <Skeleton width={150} height={150} delay={3 * DELAY_STEP} roundness={10} />
        <Skeleton width={width / 2} height={20} delay={4 * DELAY_STEP} />
        <Skeleton width={width / 2} height={20} delay={5 * DELAY_STEP} />
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 8,
  },
  list: {
    flexDirection: 'column',
  },
});

export default ArticleSkeleton;
