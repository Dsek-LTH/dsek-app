import { Theme } from '@react-navigation/native';
import { DarkTheme, DefaultTheme } from 'react-native-paper';
const customThemeProps = {
  colors: {
    primary: '#F280A1',
    accent: '#F280A1',
  },
};

const lightTheme: typeof DefaultTheme = {
  ...DefaultTheme,
  ...customThemeProps,
  colors: {
    ...DefaultTheme.colors,
    ...customThemeProps.colors,
  },
};

const darkTheme: typeof DefaultTheme = {
  ...DarkTheme,
  ...customThemeProps,
  colors: {
    ...DarkTheme.colors,
    ...customThemeProps.colors,
  },
};

const theme = {
  light: lightTheme,
  dark: darkTheme,
};

export default theme;
