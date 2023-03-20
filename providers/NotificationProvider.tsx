import React, { Ref, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import useNotifications from '~/hooks/useNotifications';
import WebView from 'react-native-webview';

const NotificationProvider: React.FC<{ webref: Ref<typeof WebView> }> = ({ webref }) => {
  const token = useNotifications();

  // Listen for if user taps on notification and open related page if they do
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      const link: string = lastNotificationResponse.notification.request.content.data.link;
      if (!link) return;
      webref.current.injectJavaScript(`
        window.location.pathname = '${link}';
      `);
    }
  }, [lastNotificationResponse, webref.current]);

  useEffect(() => {
    if (token && webref.current) {
      webref.current.injectJavaScript(`
        // Use window object if notification token has been loaded before page loads
        window.notificationToken = '${token}';

        // Use events if notification token loads, or updates, AFTER page initially loads
        const notificationEvent = new CustomEvent('appSendNotificationToken', {detail: {token: '${token}'}});
        window.dispatchEvent(notificationEvent);

        true; // note: this is required, or you'll sometimes get silent failures
      `);
    }
  }, [token, webref]);

  


  return null;
};

export default NotificationProvider;
