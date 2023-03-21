import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useEffect, useRef, useState } from 'react';
import { Platform, PlatformColor } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const registerForPushNotificationsAsync = async () => {
  let token;

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('LIKE', {
      name: 'Likes',
      description: 'When someone likes your posts',
      importance: Notifications.AndroidImportance.LOW,
    });
    Notifications.setNotificationChannelAsync('COMMENT', {
      name: 'Comments',
      description: 'When someone comments on your posts',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
    Notifications.setNotificationChannelAsync('MENTION', {
      name: 'Mentions',
      description: 'When someone mentions you',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
    Notifications.setNotificationChannelAsync('NEW_ARTICLE', {
      name: 'News relevant to you',
      description: 'When there is a new article with a tag you are subscribed to',
      importance: Notifications.AndroidImportance.HIGH,
    });
    Notifications.setNotificationChannelAsync('EVENT_LIKE', {
      name: 'Likes on your events',
      importance: Notifications.AndroidImportance.LOW,
    });
    Notifications.setNotificationChannelAsync('EVENT_GOING', {
      name: "Going to your event",
      description: 'When someone wants to go to your event',
      importance: Notifications.AndroidImportance.LOW,
    });
    Notifications.setNotificationChannelAsync('EVENT_INTERESTED', {
      name: "Interested in your event",
      description: 'When someone is interested in your event',
      importance: Notifications.AndroidImportance.LOW,
    });
    Notifications.setNotificationChannelAsync('CREATE_MANDATE', {
      name: "New position",
      description: 'When you get a new volunteer position (funktionärspost)',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
    Notifications.setNotificationChannelAsync('BOOKING_REQUEST', {
      name: 'Bookings',
      description: 'Information relevant to your booking requests',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }
    
  return token;
};

const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));
  }, []);

  return expoPushToken;
};

export default useNotifications;
