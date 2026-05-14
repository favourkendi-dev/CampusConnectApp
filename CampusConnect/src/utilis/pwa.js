export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('SW registered:', registration.scope);
        })
        .catch((error) => {
          console.log('SW registration failed:', error);
        });
    });
  }
};

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return false;
  
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const showNotification = (title, options = {}) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      ...options,
    });
  }
};

export const isPWAInstalled = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
};