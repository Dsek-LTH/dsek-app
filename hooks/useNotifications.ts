import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const registerForPushNotificationsAsync = async () => {
  if (!Device.isDevice) return;
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'D-sek notifications',
      description:
        'Notifications from D-sek, configure which types of notifications you want in the app.',
      importance: Notifications.AndroidImportance.MAX,
    });
  }
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    return;
  }
  try {
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  } catch {
    // probably bad network
  }
};

const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>('');

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));
  }, []);

  if (process.env.NODE_ENV === 'development' && expoPushToken) {
    return `DEV-${expoPushToken}`;
  }

  return expoPushToken;
};

export default useNotifications;
