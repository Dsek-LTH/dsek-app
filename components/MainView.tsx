import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Linking,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import WebView from 'react-native-webview';

import NotificationProvider from '~/providers/NotificationProvider';

const WEBSITE_URL = 'https://app.dsek.se';

const DARK_COLOR = '#121212';
const LIGHT_COLOR = '#fff';

const INTIIAL_JAVASCRIPT_CODE = `
(function() {
  const mode = window.localStorage.getItem('mode');
  const updateMode = (newMode) => {
    if (newMode) {
      window.ReactNativeWebView.postMessage(newMode);
    }
  }
  updateMode(mode);

  const method = "setItem";
  const object = window.localStorage;
  const original = object[method].bind(object);
  const newMethod = function (...args) {
    if (Array.isArray(args) && args[0] === 'mode') {
      updateMode(args[1]);
    }
    const result = original.apply(null, args);
    return result;
  };
  object[method] = newMethod.bind(object);
})();

true;`;

const MainView: React.FC<{
  colorScheme: 'light' | 'dark';
  onColorChange: (mode: 'dark' | 'light') => void;
}> = ({ colorScheme, onColorChange }) => {
  const webViewRef = useRef<WebView>(null);
  const [initialLoad, setInitialLoad] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(true);
  const backgroundColor = colorScheme === 'light' ? LIGHT_COLOR : DARK_COLOR;

  useEffect(() => {
    if (isLoading === false && initialLoad === true) {
      setInitialLoad(false);
    }
  }, [isLoading, initialLoad]);

  /* for swipe navigation (and back button) on Android */
  const onAndroidBackPress = () => {
    if (webViewRef.current) {
      webViewRef.current.goBack();
      return true; // prevent default behavior (exit app)
    }
    return false;
  };
  useEffect(() => {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onAndroidBackPress);
      };
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      SplashScreen.hideAsync();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor, position: 'relative' }}>
      <NotificationProvider webref={webViewRef} isLoading={isLoading} />
      {initialLoad && (
        <View
          style={{
            flex: 5,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}>
          <ActivityIndicator color="#f280a1" size="large" />
        </View>
      )}
      <ScrollView
        style={{
          backgroundColor: 'transparent',
          position: 'relative',
        }}
        contentContainerStyle={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              setIsLoading(true);
              webViewRef?.current?.reload();
            }}
          />
        }>
        <WebView
          source={{ uri: WEBSITE_URL }}
          ref={webViewRef}
          forceDarkOn={colorScheme !== 'light'}
          injectedJavaScript={INTIIAL_JAVASCRIPT_CODE}
          onMessage={(event) => {
            const msg = event.nativeEvent.data;
            if (msg === 'light' || msg === 'dark') {
              onColorChange(msg);
            }
          }}
          onLoadEnd={() => {
            SplashScreen.hideAsync();
            setIsLoading(false);
          }}
          onError={() => {
            SplashScreen.hideAsync();
            setIsLoading(false);
          }}
          renderError={() => {
            return (
              <View
                style={{
                  flex: 10000,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                }}>
                <Text
                  style={{
                    color: colorScheme === 'light' ? 'black' : 'white',
                    fontSize: 20,
                    fontWeight: 'bold',
                  }}>
                  Unable to connect to
                  <Text
                    style={{ color: '#f280a1' }}
                    onPress={() => Linking.openURL('https://dsek.se')}>
                    {' '}
                    D-sek{' '}
                  </Text>
                  servers.
                </Text>
                <Text
                  style={{
                    color: colorScheme === 'light' ? 'black' : 'white',
                    fontSize: 16,
                    fontWeight: '600',
                  }}>
                  Try again later or contact
                  <Text
                    style={{ color: '#f280a1' }}
                    onPress={() => Linking.openURL('mailto:dwww@dsek.se')}>
                    {' '}
                    dwww@dsek.se
                  </Text>
                </Text>
              </View>
            );
          }}
          nestedScrollEnabled
          setBuiltInZoomControls={false}
          textZoom={0}
          decelerationRate="normal"
          style={{ flex: isLoading ? 0 : 1, backgroundColor: 'transparent' }}
          renderLoading={() => null}
          allowsBackForwardNavigationGestures /* for swipe navigation on iOS */
          sharedCookiesEnabled
          onNavigationStateChange={(newNavState) => {
            if (
              !newNavState.url.startsWith(WEBSITE_URL) &&
              !newNavState.url.startsWith('https://dsek.se') &&
              !newNavState.url.startsWith('https://www.dsek.se') &&
              !newNavState.url.includes('portal.dsek.se')
            ) {
              webViewRef.current.stopLoading();
              Linking.openURL(newNavState.url);
            } else if (
              newNavState.url.startsWith('https://dsek.se') ||
              newNavState.url.startsWith('https://www.dsek.se')
            ) {
              webViewRef.current.stopLoading();
              webViewRef.current.injectJavaScript(`
                window.location = '${newNavState.url
                  .replace('https://dsek.se', 'https://app.dsek.se')
                  .replace('https://www.dsek.se', 'https://app.dsek.se')}';
              `);
            }
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MainView;
