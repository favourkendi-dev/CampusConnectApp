import { useCallback } from 'react';

export const useAnalytics = () => {
  const trackEvent = useCallback((eventName, properties = {}) => {
    // In production, integrate with Google Analytics, Mixpanel, or Amplitude
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, properties);
    }
    
    // Also log to console in development
    if (import.meta.env.DEV) {
      console.log('[Analytics]', eventName, properties);
    }
  }, []);

  const trackPageView = useCallback((page) => {
    trackEvent('page_view', { page });
  }, [trackEvent]);

  const trackUserAction = useCallback((action, details = {}) => {
    trackEvent('user_action', { action, ...details });
  }, [trackEvent]);

  return { trackEvent, trackPageView, trackUserAction };
};