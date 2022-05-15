/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import * as React from 'react';
import {
  Text as DefaultText,
  View as DefaultView,
  ScrollView as DefaultScrollView,
  FlatList as DefaultFlatList,
} from 'react-native';
import DefaultMarkdown, {
  MarkdownProps as DefaultMarkdownProps,
} from 'react-native-markdown-display';

import useColorScheme from '../hooks/useColorScheme';
import theme from '../theme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof theme[keyof typeof theme]['colors']
) {
  const colorScheme = useColorScheme();
  const colorFromProps = props[colorScheme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return theme[colorScheme].colors[colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];
export type ScrollViewProps = ThemeProps & DefaultScrollView['props'];
export type FlatListProps = ThemeProps & DefaultFlatList['props'];
export type MarkdownProps = ThemeProps & DefaultMarkdownProps & { children: ViewProps['children'] };

export const Text = (props: TextProps) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
};

export const View = (props: ViewProps) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
};

export const ScrollView = (props: ScrollViewProps) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultScrollView contentContainerStyle={[{ backgroundColor }, style]} {...otherProps} />;
};
export const FlatList = (props: FlatListProps) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultFlatList contentContainerStyle={[{ backgroundColor }, style]} {...otherProps} />;
};

export const Markdown = (props: MarkdownProps) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultMarkdown style={{ body: { color: color, ...style } }} {...otherProps} />;
};
