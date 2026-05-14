export const APP_NAME = 'Campus Connect';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  CHAT: '/chat',
  EXPLORE: '/explore',
  STUDY_HUB: '/study',
  STUDY_GROUPS: '/study/groups',
  TUTORING: '/study/tutoring',
  NOTES: '/study/notes',
  FLASHCARDS: '/study/flashcards',
  COURSES: '/courses',
  COURSE_DETAIL: '/courses/:courseId',
  EVENTS: '/events',
  EVENT_DETAIL: '/events/:eventId',
  CREATE_EVENT: '/events/create',
  MARKETPLACE: '/marketplace',
  LOST_FOUND: '/marketplace/lost-found',
  RIDE_SHARE: '/marketplace/ride-share',
  CAMPUS_MAP: '/map',
  GROUPS: '/groups',
  GROUP_DETAIL: '/groups/:groupId',
  CREATE_GROUP: '/groups/create',
  ANONYMOUS: '/confessions',
  ACHIEVEMENTS: '/achievements',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
  APPEARANCE: '/settings/appearance',
  PRIVACY: '/settings/privacy',
  NOTIFICATION_SETTINGS: '/settings/notifications',
  FOLLOWERS: '/profile/:userId/followers',
  FOLLOWING: '/profile/:userId/following',
  HELP: '/help',
};

export const COLORS = {
  PRIMARY: '#4F46E5',
  SECONDARY: '#F97316',
  ACCENT: '#10B981',
};

export const NOTIFICATION_TYPES = {
  LIKE: 'like',
  COMMENT: 'comment',
  FOLLOW: 'follow',
  MESSAGE: 'message',
  EVENT_REMINDER: 'event_reminder',
  EVENT_INVITE: 'event_invite',
  GROUP_INVITE: 'group_invite',
  ACHIEVEMENT: 'achievement',
  EMERGENCY: 'emergency',
  MENTION: 'mention',
};

export const EVENT_CATEGORIES = [
  { value: 'academic', label: 'Academic', color: 'bg-primary-100 text-primary-700' },
  { value: 'social', label: 'Social', color: 'bg-secondary-100 text-secondary-700' },
  { value: 'career', label: 'Career', color: 'bg-accent-100 text-accent-700' },
  { value: 'sports', label: 'Sports', color: 'bg-blue-100 text-blue-700' },
  { value: 'entertainment', label: 'Entertainment', color: 'bg-purple-100 text-purple-700' },
  { value: 'wellness', label: 'Wellness', color: 'bg-green-100 text-green-700' },
  { value: 'volunteer', label: 'Volunteer', color: 'bg-pink-100 text-pink-700' },
];

export const MARKETPLACE_CATEGORIES = [
  'Textbooks', 'Electronics', 'Furniture', 'Clothing', 'Tickets', 'Services', 'Housing', 'Other',
];

export const DEGREES = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'PhD'];

export const PRONOUNS = ['He/Him', 'She/Her', 'They/Them', 'Ze/Zir', 'Prefer not to say', 'Other'];

export const TIMEZONES = [
  'UTC-12', 'UTC-11', 'UTC-10', 'UTC-9', 'UTC-8', 'UTC-7', 'UTC-6', 'UTC-5',
  'UTC-4', 'UTC-3', 'UTC-2', 'UTC-1', 'UTC+0', 'UTC+1', 'UTC+2', 'UTC+3',
  'UTC+4', 'UTC+5', 'UTC+5:30', 'UTC+6', 'UTC+7', 'UTC+8', 'UTC+9', 'UTC+10',
  'UTC+11', 'UTC+12',
];

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'pt', name: 'Português' },
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export const PAGINATION_LIMIT = 20;