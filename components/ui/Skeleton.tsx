import React, { useEffect } from 'react';
import { Animated, useWindowDimensions } from 'react-native';
import theme from '~/theme';

type Props = {
  width: number;
  height: number;
  color?: string;
  delay?: number;
  roundness?: number;
};

const Skeleton: React.FC<Props> = ({ width, height, delay, color, roundness }) => {
  const dimensions = useWindowDimensions();
  const circleAnimatedValue = new Animated.Value(0);
  useEffect(() => {
    let timeout: null | NodeJS.Timeout = null;
    const circleAnimated = () => {
      circleAnimatedValue.setValue(0);
      Animated.timing(circleAnimatedValue, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }).start(() => {
        Animated.timing(circleAnimatedValue, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }).start(() => {
          timeout = setTimeout(() => {
            circleAnimated();
          }, 500);
        });
      });
    };
    const startTimeout = setTimeout(() => {
      circleAnimated();
    }, delay ?? 0);

    return () => {
      clearTimeout(startTimeout);
      if (timeout != null) {
        clearTimeout(timeout);
      }
    };
  }, []);

  const opacity = circleAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.5],
  });

  return (
    <Animated.View
      style={{
        backgroundColor: color ?? theme['dark'].colors.background,
        opacity: opacity,
        height,
        width,
        marginBottom: 12,
        borderRadius: roundness ?? 5,
      }}
    />
  );
};

export default Skeleton;
