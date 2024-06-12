import React, { useEffect } from 'react';
import WebView from 'react-native-webview';

import useNotifications from '~/hooks/useNotifications';

const NotificationProvider: React.FC<{
  webref: React.RefObject<WebView<object>>;
  isLoading: boolean;
}> = ({ webref, isLoading }) => {
  const token = useNotifications();

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (token && webref.current && !isLoading) {
      const uploadToken = () => {
        webref.current?.injectJavaScript(`
        // Use window object if notification token has been loaded before page loads
        window.notificationToken = '${token}';

        // Use events if notification token loads, or updates, AFTER page initially loads
        window.dispatchEvent(new CustomEvent('appSendNotificationToken', {detail: {token: '${token}'}}));

        true; // note: this is required, or you'll sometimes get silent failures
      `);
      };
      // Poll every 5 seconds to make sure web page has updated token (it it hasn't changed it won't do much)
      interval = setInterval(uploadToken, 5000);
      // And upload now
      uploadToken();
    }
    return () => {
      if (!interval) return;
      clearInterval(interval);
    };
  }, [token, webref, isLoading]);

  return null;
};

export default NotificationProvider;
