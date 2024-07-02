import React, { useEffect } from 'react';
import WebView from 'react-native-webview';

import useNotifications from '~/hooks/useNotifications';

const NotificationProvider: React.FC<{
  webref: React.MutableRefObject<WebView<object> | null>;
  isLoading: boolean;
}> = ({ webref, isLoading }) => {
  const token = useNotifications();

  useEffect(() => {
    let interval: NodeJS.Timer | undefined;
    if (token && webref.current && !isLoading) {
      webref.current?.injectJavaScript(`
        // Use window object if notification token has been loaded before page loads
        window.notificationToken = '${token}';

        // Use events if notification token loads, or updates, AFTER page initially loads
        window.dispatchEvent(new CustomEvent('appSendNotificationToken', {detail: {token: '${token}'}}));

        true; // note: this is required, or you'll sometimes get silent failures
      `);
    }
    return () => {
      if (!interval) return;
      clearInterval(interval);
    };
  }, [token, webref.current, isLoading]);

  return null;
};

export default NotificationProvider;
