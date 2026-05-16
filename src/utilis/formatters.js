import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

export const formatDate = (date, pattern = 'MMM d, yyyy') => {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  return format(d, pattern);
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  
  if (isToday(d)) return format(d, "'Today at' h:mm a");
  if (isYesterday(d)) return format(d, "'Yesterday at' h:mm a");
  return formatDistanceToNow(d, { addSuffix: true });
};

export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const slugify = (str) => {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};