import * as Linking from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useRef } from 'react';
import {
  AppState,
  ActivityIndicator,
  BackHandler,
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

const DARK_WRAP_COLOR = '#282828';
const DARK_COLOR = '#121212';
const LIGHT_COLOR = '#fff';

const INTIIAL_JAVASCRIPT_CODE = `
(function() {
  const mode = window.localStorage.getItem('mode');
  const updateMode = (newMode) => {
    if (newMode) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'mode',
        value: newMode
      }));
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

${
  Platform.OS === 'ios'
    ? ''
    : `
  setTimeout(() => {
    window.addEventListener('scroll', function (event) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: 'scroll',
          value: window.scrollY,
        })
      );
    }, true);
  }, 300);`
}

true;`;

const fixUrl = (url: string | undefined) =>
  url?.replace('https://dsek.se', WEBSITE_URL)?.replace('https://www.dsek.se', WEBSITE_URL);

const MainView: React.FC<{
  colorScheme: 'light' | 'dark';
  onColorChange: (mode: 'dark' | 'light') => void;
}> = ({ colorScheme, onColorChange }) => {
  const webViewRef = useRef<WebView>(null);
  const [initialLoad, setInitialLoad] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(true);
  const [ptrEnabled, setPTREnabled] = React.useState(true);
  const backgroundColor = colorScheme === 'light' ? LIGHT_COLOR : DARK_COLOR;

  const url = Linking.useURL();
  const startUrl =
    !url || (process.env.NODE_ENV === 'development' && url.startsWith('exp://'))
      ? WEBSITE_URL
      : url?.startsWith('dsek://') // If they use scheme
      ? `${WEBSITE_URL}/${url.substring(7)}`
      : fixUrl(url);

  useEffect(() => {
    if (AppState.currentState !== 'active') return;
    if (initialLoad) return;
    if (!url || (process.env.NODE_ENV === 'development' && url.startsWith('exp://'))) return;

    const fixedUrl = url.startsWith('dsek://') // If they use scheme
      ? `${WEBSITE_URL}/${url.substring(7)}`
      : fixUrl(url);

    webViewRef.current.injectJavaScript(`
      window.location.href = '${fixedUrl}';
    `);
  }, [url, initialLoad, webViewRef.current, AppState.currentState]);

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
    const timeout = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colorScheme === 'dark' ? DARK_WRAP_COLOR : backgroundColor,
        position: 'relative',
      }}>
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
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              setIsLoading(true);
              webViewRef.current?.reload();
            }}
            enabled={ptrEnabled}
          />
        }>
        <WebView
          source={{ uri: startUrl }}
          ref={webViewRef}
          forceDarkOn={colorScheme !== 'light'}
          injectedJavaScript={INTIIAL_JAVASCRIPT_CODE}
          onMessage={(event) => {
            let msg;
            try {
              msg = JSON.parse(event.nativeEvent.data);
            } catch (e) {
              return;
            }
            const value = msg.value;
            if (msg.type === 'scroll') {
              if (value === 0 && !ptrEnabled) {
                setPTREnabled(true);
              } else if (value > 10 && ptrEnabled) {
                setPTREnabled(false);
              }
            } else {
              if (value === 'light' || value === 'dark') {
                onColorChange(value);
              }
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
          textZoom={100}
          decelerationRate="normal"
          style={{
            flex: isLoading ? 0 : 1,
            backgroundColor,
            position: 'relative',
          }}
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
          window.location = '${fixUrl(newNavState.url)}';
        `);
            }
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MainView;
