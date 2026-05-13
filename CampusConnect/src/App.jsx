import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useEffect } from 'react';

// Components & Pages
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import Explore from './pages/Explore';
import NotFound from './pages/NotFound';
import LoadingSpinner from './components/LoadingSpinner';
import ChatMessage from './components/ChatMessage';
import PostCard from './components/PostCard';
import UserList from './components/UserList';

// Contexts & Hooks
//import { useOffline } from './hooks/useOffline';
//import { useTheme } from './context/ThemeContext';
//import { useNotification } from './context/NotificationContext';
//import { useWebSocket } from './hooks/useWebSocket';
//import { useIdleTimer } from './hooks/useIdleTimer';
//import { useErrorBoundary } from './hooks/useErrorBoundary';
//import { useAnalytics } from './hooks/useAnalytics';
//import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';
//import { useAccessibility } from './hooks/useAccessibility';
//import { useLocalization } from './hooks/useLocalization';
//import { useUserPreferences } from './hooks/useUserPreferences';
//import { useDataFetching } from './hooks/useDataFetching';
//import { useFormValidation } from './hooks/useFormValidation';
//import { useInfiniteScroll } from './hooks/useInfiniteScroll';  
//import { useDebounce } from './hooks/useDebounce';
//import { useThrottle } from './hooks/useThrottle';
//import { useDarkMode } from './hooks/useDarkMode';
//import { useMediaQuery } from './hooks/useMediaQuery';
//import { useLocalStorage } from './hooks/useLocalStorage';
//import { useSessionStorage } from './hooks/useSessionStorage';
//import { useEventListener } from './hooks/useEventListener';
//import { useOnClickOutside } from './hooks/useOnClickOutside';
//import { useHover } from './hooks/useHover';
//import { useFocus } from './hooks/useFocus';
//import { useScrollPosition } from './hooks/useScrollPosition';
//import { useWindowSize } from './hooks/useWindowSize';
//import { useDocumentTitle } from './hooks/useDocumentTitle';
//import { usePrevious } from './hooks/usePrevious';
//import { useToggle } from './hooks/useToggle';
//import { useCounter } from './hooks/useCounter';
//import { useArray } from './hooks/useArray';
//import { useObject } from './hooks/useObject';
//import { useMap } from './hooks/useMap';
//import { useSet } from './hooks/useSet';
//import { useTimeout } from './hooks/useTimeout';
//import { useInterval } from './hooks/useInterval';
//import { useAsync } from './hooks/useAsync';
//import { usePromise } from './hooks/usePromise';
//import { useFetch } from './hooks/useFetch';
//import { useWebWorker } from './hooks/useWebWorker';
//import { useVirtualList } from './hooks/useVirtualList';
//import { useGesture } from './hooks/useGesture';
//import { useDragAndDrop } from './hooks/useDragAndDrop';
//import { useResizeObserver } from './hooks/useResizeObserver';
//import { useMutationObserver } from './hooks/useMutationObserver';
//import { useIntersectionObserver } from './hooks/useIntersectionObserver';
//import { useIdle } from './hooks/useIdle';
//import { useOnlineStatus } from './hooks/useOnlineStatus';
//import { usePageVisibility } from './hooks/usePageVisibility';
//import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
//import { usePrefersColorScheme } from './hooks/usePrefersColorScheme';
//import { usePrefersContrast } from './hooks/usePrefersContrast';
//import { usePrefersDarkMode } from './hooks/usePrefersDarkMode';
//import { usePrefersLightMode } from './hooks/usePrefersLightMode';
//import { usePrefersSystemTheme } from './hooks/usePrefersSystemTheme';
//import { usePrefersReducedData } from './hooks/usePrefersReducedData';
//import { usePrefersReducedMotionFallback } from './hooks/usePrefersReducedMotionFallback';
//import { usePrefersColorSchemeFallback } from './hooks/usePrefersColorSchemeFallback';
//import { usePrefersContrastFallback } from './hooks/usePrefersContrastFallback';
//import { usePrefersDarkModeFallback } from './hooks/usePrefersDarkModeFallback';
//import { usePrefersLightModeFallback } from './hooks/usePrefersLightModeFallback';
//import { usePrefersSystemThemeFallback } from './hooks/usePrefersSystemThemeFallback';
//import { usePrefersReducedDataFallback } from './hooks/usePrefersReducedDataFallback';
//import { useMedia } from './hooks/useMedia';
//import { useNetworkStatus } from './hooks/useNetworkStatus';
//import { useBatteryStatus } from './hooks/useBatteryStatus';
//import { useGeolocation } from './hooks/useGeolocation';
//import { useDeviceOrientation } from './hooks/useDeviceOrientation';
//import { useDeviceMotion } from './hooks/useDeviceMotion';
//import { useSpeechRecognition } from './hooks/useSpeechRecognition';    
//import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
//import { useClipboard } from './hooks/useClipboard';

/**
 * Route Guard Logic - Cleaned up to avoid duplicating the LoadingSpinner check
 */
const RouteGuard = ({ children, isPrivate }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;
  
  if (isPrivate) {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  }
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

const PrivateRoute = ({ children }) => <RouteGuard isPrivate>{children}</RouteGuard>;
const PublicRoute = ({ children }) => <RouteGuard isPrivate={false}>{children}</RouteGuard>;

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Navbar />}
      <main>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/profile/:userId?" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
          <Route path="/explore" element={<PrivateRoute><Explore /></PrivateRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;