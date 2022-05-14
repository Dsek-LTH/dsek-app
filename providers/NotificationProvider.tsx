import React from 'react';
import * as Notifications from 'expo-notifications';
import { useUploadTokenMutation } from '~/generated/graphql';
import useNotifications from '~/hooks/useNotifications';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '~/types/navigation';

const NotificationProvider: React.FC = ({ children }) => {
  const token = useNotifications();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Listen for if user taps on notification and open related article if they do
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  React.useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      const { id } = lastNotificationResponse.notification.request.content.data as {
        id: string | undefined;
      };
      if (!id) return;
      navigation.navigate('Article', { id });
    }
  }, [lastNotificationResponse]);

  const [uploadTokenMutation, { error }] = useUploadTokenMutation();

  React.useEffect(() => {
    if (token) {
      uploadTokenMutation({ variables: { token } });
    }
  }, [token, uploadTokenMutation]);
  return <React.Fragment>{children}</React.Fragment>;
};

export default NotificationProvider;
