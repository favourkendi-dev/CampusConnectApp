import { NOTIFICATION_TYPES } from './constants';

export const createNotification = (type, senderId, recipientId, data = {}) => {
  return {
    type,
    senderId,
    recipientId,
    read: false,
    ...data,
    createdAt: new Date().toISOString(),
  };
};

export const getNotificationMessage = (notification) => {
  const { type, senderName } = notification;
  
  switch (type) {
    case NOTIFICATION_TYPES.LIKE:
      return `${senderName} liked your post`;
    case NOTIFICATION_TYPES.COMMENT:
      return `${senderName} commented on your post`;
    case NOTIFICATION_TYPES.FOLLOW:
      return `${senderName} started following you`;
    case NOTIFICATION_TYPES.MESSAGE:
      return `New message from ${senderName}`;
    case NOTIFICATION_TYPES.EVENT_REMINDER:
      return `Reminder: ${notification.eventName} starts soon`;
    case NOTIFICATION_TYPES.EVENT_INVITE:
      return `${senderName} invited you to ${notification.eventName}`;
    case NOTIFICATION_TYPES.GROUP_INVITE:
      return `${senderName} invited you to join ${notification.groupName}`;
    case NOTIFICATION_TYPES.ACHIEVEMENT:
      return `Achievement unlocked: ${notification.achievementName}`;
    case NOTIFICATION_TYPES.EMERGENCY:
      return `EMERGENCY: ${notification.message}`;
    case NOTIFICATION_TYPES.MENTION:
      return `${senderName} mentioned you in a post`;
    default:
      return 'New notification';
  }
};

export const getNotificationIcon = (type) => {
  switch (type) {
    case NOTIFICATION_TYPES.LIKE: return '❤️';
    case NOTIFICATION_TYPES.COMMENT: return '💬';
    case NOTIFICATION_TYPES.FOLLOW: return '👤';
    case NOTIFICATION_TYPES.MESSAGE: return '✉️';
    case NOTIFICATION_TYPES.EVENT_REMINDER: return '⏰';
    case NOTIFICATION_TYPES.EVENT_INVITE: return '📅';
    case NOTIFICATION_TYPES.GROUP_INVITE: return '👥';
    case NOTIFICATION_TYPES.ACHIEVEMENT: return '🏆';
    case NOTIFICATION_TYPES.EMERGENCY: return '🚨';
    case NOTIFICATION_TYPES.MENTION: return '@️';
    default: return '🔔';
  }
};

export const shouldNotify = (userSettings, notificationType) => {
  return userSettings?.[notificationType] !== false;
};