import { useCallback } from 'react';
import { db, collection, addDoc, serverTimestamp } from '../firebase/config';

export const useAnalytics = () => {
  const trackEvent = useCallback(async (eventName, properties = {}) => {
    try {
      await addDoc(collection(db, 'analytics'), {
        event: eventName,
        properties,
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }, []);

  const trackPageView = useCallback((page) => {
    trackEvent('page_view', { page });
  }, [trackEvent]);

  const trackAction = useCallback((action, details = {}) => {
    trackEvent('user_action', { action, ...details });
  }, [trackEvent]);

  return { trackEvent, trackPageView, trackAction };
};