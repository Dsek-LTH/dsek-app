import * as Linking from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

import { COLORS, WEBSITE_URL } from '~/globals';
import useDeepLinking, { fixUrl } from '~/hooks/useDeepLinking';
import NotificationProvider from '~/providers/NotificationProvider';

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

  ${
    Platform.OS === 'ios'
      ? ''
      : `
  let timeout;
  let lastY = 0;
  const addScrollListener = (step) => {
    if (step > 1000) return;
    const mainBox = document.getElementById('main-container');
    if (!mainBox) {
      // retry until page loads
      setTimeout(() => addScrollListener(step+1), 100);
      return;
    }
    if (mainBox.getAttribute('scroll-listener-added') === 'true') return;
    mainBox.addEventListener('scroll', function (event) {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        const value = Math.max(mainBox.scrollTop, 0);
        if (lastY == value) return;
        lastY = value;
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'scroll',
            value,
          })
        );
      }, 10);
    }, true);
    mainBox.setAttribute('scroll-listener-added', 'true');
  };

  setTimeout(() => {
    addScrollListener(0);
  }, 300);
    `
  }

})();

true;`;

const REFRESH_DATA_JAVASCRIPT = `
window.dispatchEvent(new CustomEvent('appRefetch'));

true; // note: this is required, or you'll sometimes get silent failures
`;

const MainView: React.FC<{
  colorScheme: 'light' | 'dark';
  onColorChange: (mode: 'dark' | 'light') => void;
}> = ({ colorScheme, onColorChange }) => {
  const webViewRef = useRef<WebView>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [ptrEnabled, setPTREnabled] = useState(true);
  const colors = colorScheme === 'light' ? COLORS.light : COLORS.dark;

  const url = useDeepLinking(isLoading, webViewRef);

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

  // Forcefully remove splash screen after 1 second if loading takes longer than that
  useEffect(() => {
    const timeout = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const onMessage = (event: WebViewMessageEvent) => {
    let msg;
    try {
      msg = JSON.parse(event.nativeEvent.data);
    } catch (e) {
      return;
    }
    const value = msg.value;
    if (msg.type === 'scroll') {
      if (value <= 0 && !ptrEnabled) {
        setPTREnabled(true);
      } else if (value > 10 && ptrEnabled) {
        setPTREnabled(false);
      }
    } else {
      if (value === 'light' || value === 'dark') {
        onColorChange(value);
      }
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.headers,
        position: 'relative',
      }}>
      <NotificationProvider webref={webViewRef} isLoading={isLoading} />
      <ScrollView
        style={{
          backgroundColor: 'transparent',
          position: 'relative',
          flex: 1,
        }}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              if (isError) {
                setIsLoading(true);
                webViewRef.current.reload();
                setIsError(false);
                return;
              }
              webViewRef.current.injectJavaScript(REFRESH_DATA_JAVASCRIPT);
            }}
            enabled={ptrEnabled}
          />
        }>
        <WebView
          source={{ uri: url }}
          ref={webViewRef}
          forceDarkOn={colorScheme !== 'light'}
          injectedJavaScript={INTIIAL_JAVASCRIPT_CODE}
          onMessage={onMessage}
          onLoadEnd={() => {
            SplashScreen.hideAsync();
            setIsLoading(false);
          }}
          onError={() => {
            setIsError(true);
          }}
          renderError={LoadingError(colorScheme)} // eslint-disable-line @typescript-eslint/no-use-before-define
          nestedScrollEnabled
          setBuiltInZoomControls={false}
          textZoom={100}
          decelerationRate="normal"
          style={{
            flex: isLoading ? 0 : 1,
            backgroundColor: colors.background,
            position: 'relative',
          }}
          renderLoading={() => null}
          onContentProcessDidTerminate={() => {
            // Content process terminated, reload webView (this causes blank screen on iOS otherwise)
            webViewRef.current.reload();
          }}
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
              return;
            }

            if (
              newNavState.url.startsWith('https://dsek.se') ||
              newNavState.url.startsWith('https://www.dsek.se')
            ) {
              webViewRef.current.stopLoading();
              webViewRef.current.injectJavaScript(`
                window.location = '${fixUrl(newNavState.url)}';
              `);
              return;
            }

            // inject scroll listener on page change
            if (newNavState.url.startsWith(WEBSITE_URL)) {
              webViewRef.current?.injectJavaScript(INTIIAL_JAVASCRIPT_CODE);
            }
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const LoadingError = (colorScheme: 'light' | 'dark') => () => {
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
        <Text style={{ color: '#f280a1' }} onPress={() => Linking.openURL('https://dsek.se')}>
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
        <Text style={{ color: '#f280a1' }} onPress={() => Linking.openURL('mailto:dwww@dsek.se')}>
          {' '}
          dwww@dsek.se
        </Text>
      </Text>
    </View>
  );
};

export default MainView;
