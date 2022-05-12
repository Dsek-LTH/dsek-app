
import { Theme } from '@react-navigation/native';
import { DarkTheme, DefaultTheme } from 'react-native-paper';
const customThemeProps = {
} as typeof DefaultTheme

const lightTheme: typeof DefaultTheme = {
  ...DefaultTheme,
  ...customThemeProps,
  colors: {
    ...DefaultTheme.colors,
    ...customThemeProps.colors
  }
};

const darkTheme: typeof DefaultTheme = {
  ...DarkTheme,
  ...customThemeProps,
  colors: {
    ...DarkTheme.colors,
    ...customThemeProps.colors
  }
}

const theme = {
  light: lightTheme,
  dark: darkTheme
}

export default theme