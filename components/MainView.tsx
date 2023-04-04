import React, { useEffect, useRef } from 'react';
import { BackHandler, Platform, SafeAreaView, Linking, View, Text, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import WebView from 'react-native-webview';
import NotificationProvider from '~/providers/NotificationProvider';
import * as SplashScreen from 'expo-splash-screen';

const WEBSITE_URL = 'https://app.dsek.se';

const MainView: React.FC = () => {
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = React.useState(true);

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
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212', position: 'relative' }}>
      <NotificationProvider webref={webViewRef} isLoading={isLoading} />
      {isLoading && (
        <View style={{
            flex: 5,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
        }}>
          <ActivityIndicator color="#f280a1" size="large" />
        </View>
      )}
      <WebView
        source={{ uri: WEBSITE_URL }}
        ref={webViewRef}
        
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
            <View style={{ flex: 10000, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
              <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                Unable to connect to
                <Text style={{color: '#f280a1'}} onPress={() => Linking.openURL('https://dsek.se')}> D-sek </Text>
                servers.
              </Text>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                Try again later or contact 
                <Text style={{color: '#f280a1'}} onPress={() => Linking.openURL('mailto:dwww@dsek.se')}> dwww@dsek.se</Text>
              </Text>
            </View>
          );
        }}
        pullToRefreshEnabled
        decelerationRate="normal"
        style={{ flex: isLoading ? 0 : 1, backgroundColor: 'transparent' }}
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
          } else if (newNavState.url.startsWith('https://dsek.se') || newNavState.url.startsWith('https://www.dsek.se')) {
            webViewRef.current.stopLoading();
            webViewRef.current.injectJavaScript(`
              window.location = '${newNavState.url.replace('https://dsek.se', 'https://app.dsek.se')}';
            `);
          }
        }}
      />
    </SafeAreaView>
  );
};

export default MainView;
