import React, { useEffect } from 'react';
import WebView from 'react-native-webview';

import useNotifications from '~/hooks/useNotifications';

const NotificationProvider: React.FC<{
  webref: React.MutableRefObject<WebView<object> | null>;
  isLoading: boolean;
  pageLoadCount: number;
}> = ({ webref, isLoading, pageLoadCount }) => {
  const token = useNotifications();

  useEffect(() => {
    // pageLoadCount changes after every full page load. A login redirect or
    // reload replaces `window`, so hand the token to the new page too.
    if (pageLoadCount > 0 && token && webref.current && !isLoading) {
      webref.current?.injectJavaScript(`
        // Use window object if notification token has been loaded before page loads
        window.notificationToken = '${token}';

        // Use events if notification token loads, or updates, AFTER page initially loads
        window.dispatchEvent(new CustomEvent('appSendNotificationToken', {detail: {token: '${token}'}}));

        true; // note: this is required, or you'll sometimes get silent failures
      `);
    }
  }, [token, webref.current, isLoading, pageLoadCount]);

  return null;
};

export default NotificationProvider;
