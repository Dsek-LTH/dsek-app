import React, { useEffect, useRef } from 'react';
import { BackHandler, Platform, SafeAreaView, Linking, View } from 'react-native';
import WebView from 'react-native-webview';
import NotificationProvider from '~/providers/NotificationProvider';
import * as SplashScreen from 'expo-splash-screen';

const WEBSITE_URL = 'https://dsek.se';

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
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      <NotificationProvider webref={webViewRef} />
      <WebView
        source={{ uri: WEBSITE_URL }}
        ref={webViewRef}
        onLoadEnd={() => {
          SplashScreen.hideAsync();
        }}
        allowsBackForwardNavigationGestures /* for swipe navigation on iOS */
        sharedCookiesEnabled
        injectedJavaScript={initialCode}
        injectedJavaScriptBeforeContentLoaded={setupCode}
        onNavigationStateChange={(newNavState) => {
          if (
            !newNavState.url.includes(WEBSITE_URL) && 
            !newNavState.url.includes('https://www.dsek.se') &&
            !newNavState.url.includes('portal.dsek.se')
          ) {
            webViewRef.current.stopLoading();
            Linking.openURL(newNavState.url);
          }
        }}
        renderLoading={() => <View style={{ flex: 1, backgroundColor: '#121212', width: '100%', height: '100%', }} />}
      />
    </View>
  );
};

export default MainView;
