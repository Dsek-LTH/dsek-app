import * as Notifications from 'expo-notifications';
import React, { useEffect } from 'react';
import WebView from 'react-native-webview';

import useNotifications from '~/hooks/useNotifications';

const NotificationProvider: React.FC<{
  webref: React.MutableRefObject<WebView<object>>;
  isLoading: boolean;
}> = ({ webref, isLoading }) => {
  const token = useNotifications();

  // Listen for if user taps on notification and open related page if they do
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      const link = lastNotificationResponse.notification.request.content.data.link as
        | string
        | undefined;
      if (!link) return;
      webref.current.injectJavaScript(`
        window.location.pathname = '${link}';
      `);
    }
  }, [lastNotificationResponse, webref.current]);

  useEffect(() => {
    if (token && webref.current && !isLoading) {
      webref.current.injectJavaScript(`
        // Use window object if notification token has been loaded before page loads
        window.notificationToken = '${token}';

        // Use events if notification token loads, or updates, AFTER page initially loads
        window.dispatchEvent(new CustomEvent('appSendNotificationToken', {detail: {token: '${token}'}}));

        true; // note: this is required, or you'll sometimes get silent failures
      `);
    }
  }, [token, webref, isLoading]);

  return null;
};

export default NotificationProvider;
