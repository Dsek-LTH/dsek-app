import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useMemo } from 'react';
import WebView from 'react-native-webview';

import { WEBSITE_URL } from '~/globals';

export const fixUrl = (url: string) => {
  if (!url) return url;
  if (url.startsWith('dsek://')) return `${WEBSITE_URL}/${url.substring(7)}`;
  if (url.startsWith('https://dsek.se')) return url.replace('https://dsek.se', WEBSITE_URL);
  if (url.startsWith('https://www.dsek.se')) return url.replace('https://www.dsek.se', WEBSITE_URL);
  if (url.startsWith('/')) return `${WEBSITE_URL}${url}`;
  return url;
};

export const getPathname = (url: string | undefined) => {
  if (!url?.startsWith(WEBSITE_URL)) return undefined;
  return url.substring(WEBSITE_URL.length);
};

const getInitialUrl = (
  deepLinkingUrl: string | undefined | null,
  lastNotificationResponse: Notifications.NotificationResponse | null | undefined
) => {
  // First, you may want to do the default deep link handling
  // Check if app was opened from a deep link
  if (deepLinkingUrl !== null && deepLinkingUrl !== undefined) {
    return deepLinkingUrl;
  }

  // Handle URL from expo push notifications
  const link = lastNotificationResponse?.notification?.request?.content?.data?.link as
    | string
    | undefined;

  return link;
};

const useDeepLinking = (isLoading: boolean, webViewRef: React.RefObject<WebView<object>>) => {
  const deepLinkingUrl = Linking.useURL();
  // Listen for if user taps on notification and open related page if they do
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  const [latestReceivedDynamicUrl, setLatestReceivedDynamicUrl] = React.useState<
    string | undefined
  >(getInitialUrl(deepLinkingUrl, lastNotificationResponse));
  const initialUrl = useMemo(() => {
    return !latestReceivedDynamicUrl ||
      (process.env.NODE_ENV === 'development' && latestReceivedDynamicUrl.startsWith('exp://'))
      ? WEBSITE_URL
      : fixUrl(latestReceivedDynamicUrl);
  }, [webViewRef.current, latestReceivedDynamicUrl]);
  // Calculate initial url
  useEffect(() => {
    if (!deepLinkingUrl) return;
    setLatestReceivedDynamicUrl(deepLinkingUrl);
  }, [deepLinkingUrl]);

  useEffect(() => {
    const link = lastNotificationResponse?.notification.request.content.data?.link as
      | string
      | undefined;
    if (!link) return;
    setLatestReceivedDynamicUrl(link);
  }, [lastNotificationResponse]);

  return initialUrl;
};

export default useDeepLinking;
