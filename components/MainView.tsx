import * as Linking from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, Platform, Text, View } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

import { COLORS, WEBSITE_URL } from '~/globals';
import NotificationProvider from '~/providers/NotificationProvider';

const DARK_LIGHT_MODE_CODE = `
  (() => {
    const headElement = document.documentElement;
    const getCurrentMode = () => {
      // read the html element and read the "data-theme" attribute which will be "dark" or "light"
      const mode = document.documentElement.getAttribute("data-theme") ?? "dark";
      return mode;
    }
    const updateMode = (newMode) => {
      if (newMode) {
        window.ReactNativeWebView?.postMessage(JSON.stringify({
          type: 'mode',
          value: newMode
        }));
      }
    }
    updateMode(getCurrentMode());
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === "attributes" && mutation.attributeName == "data-theme") {
            updateMode(mutation.target.getAttribute("data-theme"));
        }
      });
    });

    observer.observe(headElement, {
      attributes: true //configure it to listen to attribute changes
    });
    return true;
  })();
`;

const INTIIAL_JAVASCRIPT_CODE = (insets: EdgeInsets) => `
  ${DARK_LIGHT_MODE_CODE}

  window.appInsets = {
    top: ${insets.top},
    bottom: ${insets.bottom},
    left: ${insets.left},
    right: ${insets.right},
  };

true;`;

// const REFRESH_DATA_JAVASCRIPT = `
// window.dispatchEvent(new CustomEvent('appRefetch'));

// true; // note: this is required, or you'll sometimes get silent failures
// `;

const MainView: React.FC<{
  colorScheme: 'light' | 'dark';
  onColorChange: (mode: 'dark' | 'light') => void;
}> = ({ colorScheme, onColorChange }) => {
  const webViewRef = useRef<WebView>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const colors = colorScheme === 'light' ? COLORS.light : COLORS.dark;
  const insets = useSafeAreaInsets();

  // const url = useDeepLinking(isLoading, webViewRef);
  const url = WEBSITE_URL;

  useEffect(() => {
    if (isLoading === false && initialLoad === true) {
      setInitialLoad(false);
    }
  }, [isLoading, initialLoad]);
  /* for swipe navigation (and back button) on Android */
  const onAndroidBackPress = useCallback(() => {
    if (webViewRef.current) {
      webViewRef.current.goBack();
      return true; // prevent default behavior (exit app)
    }
    return false;
  }, [webViewRef.current]);
  useEffect(() => {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onAndroidBackPress);
      };
    }
  }, [onAndroidBackPress]);

  // Forcefully remove splash screen after 1 second if loading takes longer than that
  useEffect(() => {
    if (!isLoading) return;
    const timeout = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 3000);
    return () => clearTimeout(timeout);
  }, [isLoading]);

  const onMessage = (event: WebViewMessageEvent) => {
    let msg;
    try {
      msg = JSON.parse(event.nativeEvent.data);
    } catch (e) {
      return;
    }
    const value = msg.value;
    if (msg.type === 'mode') {
      if (value === 'light' || value === 'dark') {
        onColorChange(value);
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.headers,
        position: 'relative',
      }}>
      <NotificationProvider webref={webViewRef} isLoading={isLoading} />
      <WebView
        userAgent={`DSEK-APP (${Platform.OS})`}
        source={{
          uri: url,
          headers: {
            'app-insets': JSON.stringify(insets),
          },
        }}
        ref={webViewRef}
        forceDarkOn={colorScheme !== 'light'}
        injectedJavaScript={INTIIAL_JAVASCRIPT_CODE(insets)}
        onMessage={onMessage}
        onLoadEnd={() => {
          SplashScreen.hideAsync();
          setIsLoading(false);
        }}
        renderError={LoadingError(colorScheme)} // eslint-disable-line @typescript-eslint/no-use-before-define
        setBuiltInZoomControls={false}
        pullToRefreshEnabled
        textZoom={100}
        // decelerationRate="normal"
        style={{
          flex: isLoading ? 0 : 1,
          backgroundColor: colors.background,
          position: 'relative',
        }}
        // renderLoading={() => null}
        onContentProcessDidTerminate={() => {
          // Content process terminated, reload webView (this causes blank screen on iOS otherwise)
          webViewRef.current?.reload();
        }}
        allowsBackForwardNavigationGestures /* for swipe navigation on iOS */
        sharedCookiesEnabled
        onNavigationStateChange={(newNavState) => {
          webViewRef.current?.injectJavaScript(INTIIAL_JAVASCRIPT_CODE(insets));
          if (
            !newNavState.url.startsWith(WEBSITE_URL) &&
            !newNavState.url.startsWith('https://www.dsek.se') &&
            !newNavState.url.includes('portal.dsek.se')
          ) {
            webViewRef.current?.stopLoading();
            Linking.openURL(newNavState.url);
            return;
          }
          // inject scroll listener on page change
          if (
            newNavState.url.startsWith(WEBSITE_URL) ||
            newNavState.url.startsWith('https://www.dsek.se')
          ) {
            webViewRef.current?.injectJavaScript(INTIIAL_JAVASCRIPT_CODE(insets));
          }
        }}
      />
    </View>
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
