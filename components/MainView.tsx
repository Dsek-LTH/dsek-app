import React, { useEffect, useRef } from 'react';
import { BackHandler, Platform, SafeAreaView } from 'react-native';
import WebView from 'react-native-webview';
import NotificationProvider from '~/providers/NotificationProvider';

const WEBSITE_URL = 'http://192.168.1.167:3000';

const setupCode = `
window.isNativeApp = true;

true; // note: this is required, or you'll sometimes get silent failures
`;

const initialCode = `
const loadEvent = new CustomEvent('appLoad', {detail: {isNativeApp: true}});
window.dispatchEvent(loadEvent);

true; // note: this is required, or you'll sometimes get silent failures
`;

const MainView: React.FC = () => {
  const webViewRef = useRef<typeof WebView>(null);
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
        style={{}}
        source={{ uri: WEBSITE_URL }}
        // allowsBackForwardNavigationGestures /* for swipe navigation on iOS */
        ref={webViewRef} /* for swipe navigation (and back buttn) on Android */
        onMessage={(event) => {
          console.log(event);
        }}
        injectedJavaScript={initialCode}
        injectedJavaScriptBeforeContentLoaded={setupCode}
      />
    </SafeAreaView>
  );
};

export default MainView;
