import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import React, { useEffect } from 'react';
import WebView from 'react-native-webview';

import { WEBSITE_URL } from '~/globals';
import useAppState from '~/hooks/useAppState';

export const fixUrl = (url: string | undefined) =>
  url?.replace('https://dsek.se', WEBSITE_URL)?.replace('https://www.dsek.se', WEBSITE_URL);

const useDeepLinking = (
  isLoading: boolean,
  webViewRef: React.MutableRefObject<WebView<object>>
) => {
  const appState = useAppState();

  const deepLinkingUrl = Linking.useURL();
  // Listen for if user taps on notification and open related page if they do
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  const initialUrl = ((): string | undefined => {
    // First, you may want to do the default deep link handling
    // Check if app was opened from a deep link
    if (deepLinkingUrl != null) {
      return deepLinkingUrl;
    }

    // Handle URL from expo push notifications
    const link = lastNotificationResponse.notification.request.content.data.link as
      | string
      | undefined;

    return link;
  })();

  const [urlToLoad, setUrlToLoad] = React.useState<string | undefined>(initialUrl);
  const startUrl =
    !urlToLoad || (process.env.NODE_ENV === 'development' && urlToLoad.startsWith('exp://'))
      ? WEBSITE_URL
      : urlToLoad?.startsWith('dsek://') // If they use scheme
      ? `${WEBSITE_URL}/${urlToLoad.substring(7)}`
      : fixUrl(urlToLoad);

  useEffect(() => {
    if (!deepLinkingUrl) return;
    setUrlToLoad(deepLinkingUrl);
  }, [deepLinkingUrl]);

  useEffect(() => {
    const link = lastNotificationResponse.notification.request.content.data.link as
      | string
      | undefined;
    if (!link) return;
    setUrlToLoad(link);
  }, [lastNotificationResponse]);

  useEffect(() => {
    if (!urlToLoad) return; // If no url to load
    if (appState !== 'active') return; // Only change page in foreground
    if (isLoading) return; // If the app is still loading
    // Dev guard
    if (process.env.NODE_ENV === 'development' && urlToLoad.startsWith('exp://')) return;

    const fixedUrl = urlToLoad.startsWith('dsek://') // If link is from scheme
      ? `${WEBSITE_URL}/${urlToLoad.substring(7)}`
      : fixUrl(urlToLoad);

    webViewRef.current.injectJavaScript(`
      window.location.href = '${fixedUrl}';
    `);
    setUrlToLoad(undefined); // Only navigate to each url ONCE
  }, [urlToLoad, isLoading, webViewRef.current, appState]);

  return startUrl;
};

export default useDeepLinking;
