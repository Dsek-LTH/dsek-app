import React, { useEffect, useRef } from 'react';
import { BackHandler, Platform, SafeAreaView, Linking } from 'react-native';
import WebView from 'react-native-webview';
import NotificationProvider from '~/providers/NotificationProvider';

const WEBSITE_URL = 'http://81.226.224.120:3000/en';

const setupCode = `
window.isNativeApp = true;

true; // note: this is required, or you'll sometimes get silent failures
`;

const initialCode = `
ReactNativeWebView.postMessage(document.cookie)

true; // note: this is required, or you'll sometimes get silent failures
`;

const MainView: React.FC = () => {
  const webViewRef = useRef<typeof WebView>(null);

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
      <NotificationProvider webref={webViewRef} />
      <WebView
        source={{ uri: WEBSITE_URL }}
        // allowsBackForwardNavigationGestures /* for swipe navigation on iOS */
        ref={webViewRef}
        sharedCookiesEnabled
        injectedJavaScript={initialCode}
        injectedJavaScriptBeforeContentLoaded={setupCode}
        onNavigationStateChange={(newNavState) => {
          if (
            !newNavState.url.includes(WEBSITE_URL) &&
            !newNavState.url.includes('portal.dsek.se')
          ) {
            webViewRef.current.stopLoading();
            Linking.openURL(newNavState.url);
          }
        }}
      />
    </SafeAreaView>
  );
};

export default MainView;
