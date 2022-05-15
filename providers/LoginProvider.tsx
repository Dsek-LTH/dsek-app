import React, { PropsWithChildren } from 'react';
import { KeycloakProvider } from 'expo-keycloak-auth';
import GraphQLProvider from '~/providers/GraphQLProvider';
import AppConfig from '../app.json';

const keycloakConfig = {
  clientId: 'dsek-se-openid',
  realm: 'dsek',
  url: 'https://portal.dsek.se/auth/',
  scheme: AppConfig.expo.scheme,
};

const initOptions = {
  redirectUri: 'dsek://home',
  // if you need to customize "react-native-inappbrowser-reborn" View you can use the following attribute
  inAppBrowserOptions: {
    // For iOS check: https://github.com/proyecto26/react-native-inappbrowser#ios-options
    // For Android check: https://github.com/proyecto26/react-native-inappbrowser#android-options
  },
};

type LoginProviderProps = PropsWithChildren<{}>;

const LoginProvider: React.FC<LoginProviderProps> = ({ children }) => {
  return (
    <KeycloakProvider {...keycloakConfig}>
      <GraphQLProvider>{children}</GraphQLProvider>
    </KeycloakProvider>
  );
};

export default LoginProvider;
