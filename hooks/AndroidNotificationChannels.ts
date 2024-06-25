import { AndroidImportance, NotificationChannelInput } from 'expo-notifications';

// These should be the same as the ones specified in the web repo. Do not edit these, edit them there and copy over.
export enum NotificationSettingType {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  MENTION = 'MENTION',
  NEW_ARTICLE = 'NEW_ARTICLE',
  EVENT_GOING = 'EVENT_GOING',
  CREATE_MANDATE = 'CREATE_MANDATE',
  BOOKING_REQUEST = 'BOOKING_REQUEST',
  PING = 'PING',
}

type ChannelOptions = {
  channelId: string;
  options: NotificationChannelInput;
};

export const notificationChannels: Record<NotificationSettingType, NotificationChannelInput> = {
  [NotificationSettingType.LIKE]: {
    name: 'Likes',
    description: 'When you receive a like',
    importance: AndroidImportance.DEFAULT,
  },
  [NotificationSettingType.COMMENT]: {
    name: 'Comments',
    description: 'When you receive a comment',
    importance: AndroidImportance.HIGH,
  },
  [NotificationSettingType.MENTION]: {
    name: 'Mentions',
    description: 'When you are mentioned',
    importance: AndroidImportance.MAX,
  },
  [NotificationSettingType.NEW_ARTICLE]: {
    name: 'New articles',
    description: 'When a new article is published with a tag your are subscribed to',
    importance: AndroidImportance.MAX,
  },
  [NotificationSettingType.EVENT_GOING]: {
    name: 'Interest in your event',
    description: 'When someone is interested or going to your event',
    importance: AndroidImportance.DEFAULT,
  },
  [NotificationSettingType.CREATE_MANDATE]: {
    name: 'New position',
    description: 'When you get a new volunteer position (funktionärspost)',
    importance: AndroidImportance.MAX,
  },
  [NotificationSettingType.BOOKING_REQUEST]: {
    name: 'Bookings',
    description: 'Information relevant to your booking requests',
    importance: AndroidImportance.MAX,
  },
  [NotificationSettingType.PING]: {
    name: 'PINGs',
    description: 'When you get pinged',
    importance: AndroidImportance.DEFAULT,
  },
};

export const notificationChannelList: ChannelOptions[] = Object.entries(notificationChannels).map(
  ([channelId, options]) => ({
    channelId,
    options,
  })
);
