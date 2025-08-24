import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, Platform, Text, View } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

import { COLORS, WEBSITE_URL } from '~/globals';
import useDeepLinking from '~/hooks/useDeepLinking';
import useForcedUpdate from '~/hooks/useForcedUpdate';
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

const BADGE_COUNT_CODE = `
  (() => {
    const initial = window.unreadNotificationCount;
    if (initial !== undefined) {
      window.ReactNativeWebView?.postMessage(JSON.stringify({
        type: 'badge',
        value: initial
      }));
    }
    window.addEventListener('unreadNotificationCount', (event) => {
      const count = event.detail?.count;
      if (count === undefined) return;

      window.ReactNativeWebView?.postMessage(JSON.stringify({
        type: 'badge',
        value: count
      }));
    });
  })();
`;

const INTIIAL_JAVASCRIPT_CODE = (insets: EdgeInsets) => `
  ${DARK_LIGHT_MODE_CODE}
  ${BADGE_COUNT_CODE}

  window.appInsets = {
    top: ${insets.top},
    bottom: ${insets.bottom},
    left: ${insets.left},
    right: ${insets.right},
  };

true;`;

const MainView: React.FC<{
  colorScheme: 'light' | 'dark';
  onColorChange: (mode: 'dark' | 'light') => void;
}> = ({ colorScheme, onColorChange }) => {
  const updateCheckDone = useForcedUpdate();
  const webViewRef = useRef<WebView>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const colors = colorScheme === 'light' ? COLORS.light : COLORS.dark;
  const insets = useSafeAreaInsets();

  const url = useDeepLinking(isLoading, webViewRef);

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

  const onMessage = async (event: WebViewMessageEvent) => {
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
    } else if (msg.type === 'badge') {
      try {
        await Notifications.setBadgeCountAsync(value ?? 0);
      } catch (e) {
        console.warn('setBadgeCountAsync failed', e);
      }
    }
  };

  useEffect(() => {
    if (!isLoading && updateCheckDone) SplashScreen.hideAsync();
  }, [isLoading, updateCheckDone]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.headers,
        position: 'relative',
      }}>
      <NotificationProvider webref={webViewRef} isLoading={isLoading} />
      <WebView
        userAgent={`DSEK-APP (${Platform.OS}), APP-INSETS (${JSON.stringify({
          ...insets,
          bottom: Platform.OS === 'ios' ? insets.bottom : insets.bottom + 16,
        })})`}
        // Due to a known bug where custom headers are only sent upon first request and not subsequent, without any solution right now, the preferred way is to send custom data in the user agent instead.
        source={{
          uri:
            url === WEBSITE_URL || url === WEBSITE_URL + '/'
              ? // ? `${WEBSITE_URL}/native-app-router`
                `${WEBSITE_URL}/app/home`
              : url,
          // headers: {
          //   'app-insets': JSON.stringify(insets),
          // },
        }}
        ref={webViewRef}
        // forceDarkOn={colorScheme !== 'light'}
        injectedJavaScript={INTIIAL_JAVASCRIPT_CODE(insets)}
        onMessage={onMessage}
        onLoadEnd={() => {
          setIsLoading(false);
        }}
        renderError={LoadingError(colorScheme, webViewRef.current?.reload)} // eslint-disable-line @typescript-eslint/no-use-before-define
        setBuiltInZoomControls={false}
        pullToRefreshEnabled
        textZoom={100}
        decelerationRate={Platform.OS === 'ios' ? 'normal' : undefined}
        style={{
          flex: isLoading ? 0 : 1,
          backgroundColor: colors.background,
          position: 'relative',
        }}
        // renderLoading={() => <ActivityIndicator size="large" />}
        onContentProcessDidTerminate={() => {
          // Content process terminated, reload webView (this causes blank screen on iOS otherwise)
          webViewRef.current?.reload();
        }}
        allowsBackForwardNavigationGestures /* for swipe navigation on iOS */
        sharedCookiesEnabled
        onNavigationStateChange={(newNavState) => {
          if (newNavState.url === 'about:blank') return;
          if (
            !newNavState.url.startsWith(WEBSITE_URL) &&
            !newNavState.url.startsWith('https://dsek.se') &&
            !newNavState.url.startsWith('https://www.dsek.se') &&
            !newNavState.url.includes('auth.dsek.se')
          ) {
            webViewRef.current?.stopLoading();
            Linking.openURL(newNavState.url);
          } else {
            webViewRef.current?.injectJavaScript(INTIIAL_JAVASCRIPT_CODE(insets));
          }
        }}
      />
    </View>
  );
};

const LoadingError = (colorScheme: 'light' | 'dark', reload: (() => void) | undefined) => () => {
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
        <Text style={{ color: '#f280a1' }} onPress={reload}>
          Try again
        </Text>{' '}
        later or contact
        <Text style={{ color: '#f280a1' }} onPress={() => Linking.openURL('mailto:dwww@dsek.se')}>
          {' '}
          dwww@dsek.se
        </Text>
      </Text>
    </View>
  );
};

export default MainView;
