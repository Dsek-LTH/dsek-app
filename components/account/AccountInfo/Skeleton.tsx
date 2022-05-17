import React from 'react';
import { useWindowDimensions } from 'react-native';
import { List, Surface } from 'react-native-paper';
import Skeleton, { SKELETON_DELAY_STEP } from '~/components/ui/Skeleton';
import { styles } from '.';

const AccountInfoSkeleton: React.FC = () => {
  const dimensions = useWindowDimensions();
  return (
    <Surface style={{ ...styles.container }}>
      <Skeleton width={dimensions.width - 64} height={40} />
      <Skeleton width={dimensions.width - 64} height={40} delay={SKELETON_DELAY_STEP * 1} />
      <Skeleton width={dimensions.width - 64} height={40} delay={SKELETON_DELAY_STEP * 2} />
      <Skeleton width={dimensions.width - 64} height={40} delay={SKELETON_DELAY_STEP * 3} />
    </Surface>
  );
};

export default AccountInfoSkeleton;
